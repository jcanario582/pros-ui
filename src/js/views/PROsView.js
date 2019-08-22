import get from 'lodash.get';
import _ from 'underscore';
import Marionette from 'backbone.marionette';
import ProductCarouselView from '@feature/product-carousel-ui';
import Logger from '@component/common/src/util/Logger';
import * as PROsUICoremetrics from '../analytics/PROsUICoremetrics';
import AdobeAnalytics from '../analytics/AdobeAnalytics';
import EventsWarPixelManager from '../analytics/EventsWarPixelManager';
import RTORecommendationsModel from '../models/RTORecommendationsModel';
import getAnalyticsProductURL from '../analytics/AnalyticsLinkUpdate';
import * as ChoiceIdParser from '../analytics/ChoiceIdParser';
import {
  getAnalyticZones,
  getRecommendationContexts,
  RECOMMENDATION_CONTEXT_MAP,
} from '../richRelevance/RRConfig';

const horMaxNumProducts = 12;
const verMaxNumProducts = 5;
const events = {
  recommendationsReceived: 'recommendationsReceived',
  productsRendered: 'prosProductsRendered',
};

const PROsView = Marionette.ItemView.extend({

  template: false,

  initialize(options) {
    this.carouselCount = 0;
    this.productCarousels = {};

    if (get(this.options, 'properties.isRTOPROsEnabled')) {
      const panelConfig = get(this.options, 'panelConfig', {});
      panelConfig.lazyLoadProducts = true;
    }

    this.recommendationsObject = new RTORecommendationsModel(options);

    this.analyticsZone = getAnalyticZones()[this.options.recommendationContext];

    this.firePageViewTag = _.once(PROsUICoremetrics.firePageViewTag);
    this.firePROSLoadLinkTag = _.once(AdobeAnalytics.firePROSLoadLinkTag);
  },

  onRender() {
    if (get(this, 'options.panelConfig.disableAutoRenderCarousel')) {
      return;
    }

    this.productCarouselView = this.initializeProductCarousel();

    if (get(this, 'options.panelConfig.lazyLoadProducts')) {
      this.productCarouselView.render();
    }

    this.fetchRecommendations()
      .then((recommendationData) => {
        this.fetchProductData(recommendationData, this.productCarouselView);
      });
  },

  fetchRecommendations() {
    return this.recommendationsObject.fetchRecommendations()
      .then(recommendationData => new Promise((resolve) => {
        this.recommendationData = recommendationData;
        this.eventsWarPixelManager = new EventsWarPixelManager(recommendationData);
        this.trigger(events.recommendationsReceived, _.clone(recommendationData));
        resolve(recommendationData);
      }))
      .catch(e => Logger.error(`RR data not received for ${this.options.recommendationContext}`, e));
  },

  initializeProductCarousel(panelOptions = {}) {
    const { recommendationContext } = this.options;
    const contextData = RECOMMENDATION_CONTEXT_MAP[recommendationContext] || {};
    const { vertical } = {
      ...this.options.panelConfig,
      ...panelOptions,
    };
    const productCarouselView = new ProductCarouselView({
      el: this.el,
      maxNumProducts: vertical ? verMaxNumProducts : horMaxNumProducts,
      registrableOnly: contextData.registrableOnly || window.location.pathname.toLowerCase().indexOf('registry/wedding') > -1,
      respondTo: 'slider',
      ...this.options.panelConfig,
      ...panelOptions,
    });

    const panelKey = panelOptions.panelName || `${recommendationContext}${this.carouselCount}`;

    this.productCarousels[panelKey] = productCarouselView;
    this.carouselCount += 1;

    return productCarouselView;
  },

  fetchProductData(recommendationData, productCarouselView) {
    const recommendations = recommendationData.recs || recommendationData.recommendedItems;
    const zone = getAnalyticZones()[this.options.recommendationContext];
    const pageID = PROsUICoremetrics.getPageID(this);
    const choiceId = ChoiceIdParser.getChoiceId(recommendationData);

    productCarouselView.updateAnalytics({
      pageID,
      recommendationModel: ChoiceIdParser.getControlGroupId(choiceId),
      eventID: ChoiceIdParser.getEventId(choiceId),
      zone,
      ...this.options.analytics,
    });
    productCarouselView.addProductIds(_.pluck(recommendations, 'productId'));

    let fetchPromise;

    if (get(this, 'options.panelConfig.lazyLoadProducts')) {
      fetchPromise = productCarouselView.fetchProducts();
    } else {
      fetchPromise = productCarouselView.fetch();
    }

    fetchPromise.then((response = {}) => {
      const { strategyMessage } = recommendationData;

      productCarouselView.setTitle(strategyMessage);

      if (!get(this, 'options.panelConfig.lazyLoadProducts')) {
        productCarouselView.render();
      }

      this.updateAnalyticsUrls(productCarouselView, response.validProducts);

      this.trigger(events.productsRendered, _.clone(productCarouselView.model.get('products')));
      this.listenToProductCarousel(productCarouselView);

      // Coremetrics
      this.firePageViewTag(pageID, this);

      // Adobe Analytics
      this.firePROSLoadLinkTag(zone, recommendationData);

      // EventsWar Pixel Tracking
      this.triggerEventsWarPixel(productCarouselView.visibleProducts(), true);
    });
  },

  triggerEventsWarPixel(visibleProducts, isPresented) {
    if (!this.eventsWarPixelManager) {
      return;
    }

    this.eventsWarPixelManager.fireTrackingPixel(visibleProducts, this, isPresented);
  },

  listenToProductCarousel(carouselView) {
    const eventCallbackMap = {
      [ProductCarouselView.getEventNames().afterPageChange]: 'onAfterPageChange',
      [ProductCarouselView.getEventNames().carouselResize]: 'onCarouselResize',
    };

    _.each(ProductCarouselView.getEventNames(), (eventName) => {
      this.listenTo(carouselView, eventName, (...args) => {
        const callbackMethod = eventCallbackMap[eventName];

        if (typeof this[callbackMethod] === 'function') {
          this[callbackMethod](carouselView, ...args);
        }

        this.trigger(eventName, ...args);
      });
    });
  },

  onAfterPageChange(carouselView, event, slickData, fetchedProducts) {
    this.triggerEventsWarPixel(carouselView.visibleProducts());

    if (get(this, 'options.panelConfig.lazyLoadProducts')) {
      this.updateAnalyticsUrls(carouselView, fetchedProducts.validProducts);
    }
  },

  onCarouselResize(carouselView, fetchedProducts) {
    this.triggerEventsWarPixel(carouselView.visibleProducts());

    if (get(this, 'options.panelConfig.lazyLoadProducts')) {
      this.updateAnalyticsUrls(carouselView, fetchedProducts.validProducts);
    }
  },

  updateAnalyticsUrls(carouselView, productModels = []) {
    if (!this.recommendationData) {
      return;
    }

    let startingIndex = 0;
    let products;

    if (get(this, 'options.panelConfig.lazyLoadProducts')) {
      products = productModels.map(model => model.toJSON());

      startingIndex = (carouselView.getProductCount() - products.length);
    } else {
      products = carouselView.model.get('products') || [];
    }

    products.forEach((productData, i) => {
      const url = getAnalyticsProductURL(
        productData,
        this.recommendationData.recommendedItems,
        this.analyticsZone,
        startingIndex + i,
      );

      carouselView.updateAnalyticsProductUrl(productData.id, url);
    });
  },

  onDestroy() {
    _.each(this.productCarousels, (carouselView) => {
      if (typeof carouselView.destroy === 'function') {
        carouselView.destroy();
      }
    });
  },
});

// Use this class method to select different pageType and placementId combinations
PROsView.getRecommendationContexts = getRecommendationContexts;

PROsView.getEventNames = () => _.extend(
  {},
  ProductCarouselView.getEventNames(),
  events,
);

PROsView.getAnalyticZones = getAnalyticZones;

export default PROsView;
