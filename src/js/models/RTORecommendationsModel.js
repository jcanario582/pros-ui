import $ from 'jquery';
import Backbone from 'backbone';
import StringUtil from '@component/common/src/util/StringUtil';
import Logger from '@component/common/src/util/Logger';
import {
  RECOMMENDATION_CONTEXT_MAP,
  getPageTypes,
} from '../richRelevance/RRConfig';
import {
  getRequester,
  getSessionId,
  getRCS,
  getUserID,
  setRCSIfEmpty,
} from '../util/SessionUtil';

export default Backbone.Model.extend({

  requestData() {
    return {
      productId: -9,
      requester: getRequester(),
      customerId: getUserID(),
      visitorId: getSessionId(),
      rcs: getRCS(),
      timeout: 15000,
    };
  },

  initialize(options = {}) {
    this.options = options;

    this.clear();

    if (!RECOMMENDATION_CONTEXT_MAP[options.recommendationContext]) {
      Logger.error('Missing valid \'recommendationContext\'. Map one of the keys returned in \'getRecommendationContexts\' class method to \'recommendationContext\'');
    }
  },

  getRequiredDataParams(recommendationConfig = {}, recommendationContext, recommendationContextData) {
    if (!recommendationContextData) {
      return {};
    }

    const parameters = {};
    const { pageType } = recommendationContextData;

    let requiredParams = [];

    switch (pageType) {
      case getPageTypes().itemPage:
      case getPageTypes().unavailableItemPage:
      case getPageTypes().addToCartPage:
        requiredParams = ['productId', 'categoryId'];

        break;
      case getPageTypes().cartPage:
      case getPageTypes().purchaseCompletePage:
        if (Array.isArray(recommendationConfig.productIds)) {
          parameters.productIDs = recommendationConfig.productIds.join('|');
          parameters.productId = recommendationConfig.productIds.slice(-1)[0];
        }

        requiredParams = ['productId'];

        break;
      case getPageTypes().categorySplashPage:
        parameters.productId = recommendationConfig.categoryId;
        requiredParams = ['categoryId'];

        break;
      case getPageTypes().zeroSearchResults:
      case getPageTypes().registryZeroSearchResults:
        parameters.searchTerm = recommendationConfig.searchTerm || StringUtil.getURLParameter('keyword');
        requiredParams = ['searchTerm'];

        break;
      case getPageTypes().homePage:
        requiredParams = ['productId'];

        break;
      default:
    }

    requiredParams.forEach((requiredParam) => {
      if (!recommendationConfig[requiredParam] && !parameters[requiredParam]) {
        Logger.warn(`Required param: ${requiredParam} missing for recommendationContext: ${recommendationContext}. RTO call may not function properly.`);
        return;
      }

      parameters[requiredParam] = parameters[requiredParam] || recommendationConfig[requiredParam];
    });

    return parameters;
  },

  getOptionalDataParams(recommendationConfig = {}) {
    const {
      orderId,
      price,
      quantity,
    } = recommendationConfig;
    const priceFloat = Number(price);
    const priceNumber = !Number.isNaN(priceFloat) ? Number(priceFloat.toFixed(2)) : null;
    const priceInCents = priceNumber ? Math.floor(priceNumber * 100) : null;

    return {
      o: orderId,
      pp: priceNumber,
      ppc: priceInCents,
      q: quantity,
    };
  },

  url() {
    return '/sdp/rto/request/recommendations';
  },

  getBodyParameters(data) {
    const { recommendationContext } = data;
    const recommendationContextData = RECOMMENDATION_CONTEXT_MAP[recommendationContext];
    const context = recommendationContextData && (recommendationContextData.rtoContext || recommendationContextData.selectedPlacementId);
    const allParams = Object.assign(
      { context },
      this.requestData(),
      this.getRequiredDataParams(data.recommendationConfig, data.recommendationContext, recommendationContextData),
      this.getOptionalDataParams(data.recommendationConfig),
    );
    const finalParams = {};

    Object.entries(allParams).forEach(([key, value]) => {
      if (value) {
        finalParams[key] = value;
      }
    });

    // Set property to empty value if it does not exist
    // Special case scenario for RichRelevance
    // Translates to 'userId=' empty value as query parameter in RR call
    finalParams.customerId = finalParams.customerId;

    this.sanitizeChanelCatSplashIds(data, finalParams);

    return finalParams;
  },

  /**
   * This function was created as per BOX-934 to get rid of the "onsite_search_redirect-" prefixes.
   */
  sanitizeChanelCatSplashIds(data, params) {
    const isBcom = data.properties && data.properties.brand === 'BCOM';
    const isChanel = data.analytics && /chanel/i.test(data.analytics.pageID);
    const isCatSplash = data.recommendationContext === 'catSplash';

    if (isBcom && isChanel && isCatSplash) {
      const sanitize = id => id && id.replace && id.replace(/[^\d]/g, '');

      params.productId = sanitize(params.productId);
      params.categoryId = sanitize(params.categoryId);
    }
  },

  fetchRecommendations() {
    this.set(this.getBodyParameters(this.options));

    return new Promise((resolve, reject) => {
      this.save(null, {
        type: 'POST',
        data: $.param(this.toJSON()),
        contentType: 'application/x-www-form-urlencoded',
        success: (model, response) => {
          setRCSIfEmpty(response.rcs);
          resolve(response);
        },
        error: (model, response, options) => {
          Logger.error('Error retrieving RTO recommendations');
          reject(options);
        },
      });
    });
  },

});
