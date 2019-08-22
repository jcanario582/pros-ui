import _ from 'underscore';
import Backbone from 'backbone';
import * as CarouselConstuctorContainer from '@feature/product-carousel-ui';
import Logger from '@component/common/src/util/Logger';
import PROsView from '../../../src/js/views/PROsView';

const CarouselConstuctor = CarouselConstuctorContainer.default;

describe('The PROs view', () => {
  const carouselEventNameList = ['event1', 'event2'];
  const carouselEvents = {};

  carouselEventNameList.forEach((eventName) => {
    carouselEvents[eventName] = eventName;
  });

  let prosView;

  beforeEach(() => {
    prosView = new PROsView();

    spyOn(CarouselConstuctor, 'getEventNames').and.returnValue(carouselEvents);
  });

  afterEach(() => {
    prosView.destroy();
  });

  describe('on instantiation', () => {
    it('should create a recommendationsObject', () => {
      expect(prosView.recommendationsObject).toBeDefined();
    });

    it('should', () => {
      const instance = new PROsView();
      expect(instance);
      const instance2 = new PROsView({
        properties: {
          isRTOPROsEnabled: true,
        },
      });
      expect(instance2);
    });
  });

  describe('onRender method', () => {
    let promiseOutcome = Promise.resolve();

    beforeEach(() => {
      spyOn(prosView.recommendationsObject, 'fetchRecommendations').and.callFake(() => promiseOutcome);
      spyOn(Logger, 'error');
    });

    it('should call \'fetchRecommendations\' on the recommendationsObject', () => {
      prosView.render();

      expect(prosView.recommendationsObject.fetchRecommendations).toHaveBeenCalled();
    });

    it('should', () => {
      spyOn(prosView, 'initializeProductCarousel').and.returnValue({
        render: jasmine.createSpy('render spy'),
      });
      prosView.options.panelConfig = {
        lazyLoadProducts: true,
      };
      prosView.render();
      prosView.options.panelConfig.disableAutoRenderCarousel = true;
      prosView.render();
    });

    it('should log an error and not call \'onReceiveRecs\' when the recommendationsObject fetchRecommendations promise fails', (done) => {
      promiseOutcome = Promise.reject();
      prosView.render();

      _.defer(() => {
        expect(Logger.error).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('onAfterPageChange method', () => {
    const getCarousel = () => ({
      visibleProducts: () => {},
    });

    it('should call \'triggerEventsWarPixel\' method', () => {
      spyOn(prosView, 'triggerEventsWarPixel');

      prosView.onAfterPageChange(getCarousel());

      expect(prosView.triggerEventsWarPixel).toHaveBeenCalled();
    });

    it('should call \'updateAnalyticsUrls\' method if lazyLoadProducts is enabled', () => {
      spyOn(prosView, 'updateAnalyticsUrls');

      prosView.options.panelConfig = {
        lazyLoadProducts: true,
      };
      prosView.onAfterPageChange(getCarousel(), {}, {}, {});

      expect(prosView.updateAnalyticsUrls).toHaveBeenCalled();
    });
  });

  describe('onCarouselResize method', () => {
    const getCarousel = () => ({
      visibleProducts: () => {},
    });

    it('should call \'triggerEventsWarPixel\' method', () => {
      spyOn(prosView, 'triggerEventsWarPixel');

      prosView.onCarouselResize(getCarousel());

      expect(prosView.triggerEventsWarPixel).toHaveBeenCalled();
    });

    it('should call \'updateAnalyticsUrls\' method if lazyLoadProducts is enabled', () => {
      spyOn(prosView, 'updateAnalyticsUrls');

      prosView.options.panelConfig = {
        lazyLoadProducts: true,
      };
      prosView.onCarouselResize(getCarousel(), {});

      expect(prosView.updateAnalyticsUrls).toHaveBeenCalled();
    });
  });

  describe('updateAnalyticsUrls method', () => {
    const getCarousel = () => ({
      getProductCount: () => {},
      updateAnalyticsProductUrl: () => {},
      model: new Backbone.Model({
        products: [{}],
      }),
    });

    it('should', () => {
      prosView.updateAnalyticsUrls(getCarousel());
      prosView.recommendationData = {};
      prosView.updateAnalyticsUrls(getCarousel());
      prosView.options.panelConfig = {
        lazyLoadProducts: true,
      };
      prosView.updateAnalyticsUrls(getCarousel(), [new Backbone.Model()]);
    });
  });

  describe('triggerEventsWarPixel method', () => {
    it('should call the \'fireTrackingPixel\' method on the eventsWarPixelManager', () => {
      const fireTrackingPixelSpy = jasmine.createSpy('fire tracking spy');
      prosView.eventsWarPixelManager = {
        fireTrackingPixel: fireTrackingPixelSpy,
      };
      prosView.triggerEventsWarPixel();

      expect(fireTrackingPixelSpy).toHaveBeenCalled();
    });

    it('should error out if the propert \'eventsWarPixelManager\' doesn\'t exist', () => {
      let errorThrown = false;

      try {
        prosView.triggerEventsWarPixel();
      } catch (e) {
        errorThrown = true;
      }

      expect(errorThrown).toBe(false);
    });
  });

  describe('initializeProductCarousel method', () => {
    const spiedCarouselView = new CarouselConstuctor();

    beforeEach(() => {
      spyOn(prosView, 'listenToProductCarousel');
      spyOn(CarouselConstuctorContainer, 'default').and.callFake(() => {
        spyOn(spiedCarouselView, 'fetch').and.returnValue(Promise.resolve());
        spyOn(spiedCarouselView, 'render');

        return spiedCarouselView;
      });
    });

    it('should call fetch on its productCarouselView', () => {
      prosView.initializeProductCarousel({
        recs: [],
        displayMessage: 'display message',
      });
    });

    it('should', () => {
      prosView.initializeProductCarousel({
        recs: [],
        displayMessage: 'display message',
      }, { vertical: true });
    });

    it('should', () => {
      prosView.options.vertical = true;
      prosView.initializeProductCarousel({
        recommendedItems: [],
        displayMessage: 'display message',
      });
    });
  });

  describe('onDestroy', () => {
    it('should', () => {
      prosView.productCarousels.a = {};
    });
  });

  describe('listenToProductCarousel method', () => {
    const eventsListenedToMap = {};
    let listenToCalls;

    beforeEach(() => {
      listenToCalls = [];

      spyOn(prosView, 'trigger');
      spyOn(prosView, 'listenTo').and.callFake((...args) => {
        listenToCalls.push(args);
        eventsListenedToMap[args[1]] = true;
      });
    });

    it('should call listenTo on the supplied carousel argument as the first argument', () => {
      const carousel = {};

      prosView.listenToProductCarousel(carousel);

      const lastListenToCall = prosView.listenTo.calls.mostRecent();

      expect(lastListenToCall.args[0]).toBe(carousel);
    });

    it('should call listenTo on for each eventName returned from ProductCarouselView.getEventNames', () => {
      const carousel = {};

      prosView.listenToProductCarousel(carousel);

      const eventsListenedTo = _.keys(eventsListenedToMap);

      expect(_.uniq(eventsListenedTo).sort()).toEqual(carouselEventNameList.sort());
    });

    it('should trigger the same event on the prosView when the event occurs for the carouselView', () => {
      const carousel = {};

      prosView.listenToProductCarousel(carousel);

      listenToCalls.forEach((args) => {
        const eventName = args[1];
        const callback = args[2];

        callback();

        const triggerCallFirstArg = prosView.trigger.calls.mostRecent().args[0];

        expect(triggerCallFirstArg).toEqual(eventName);
      });
    });

    describe('getEventNames class method', () => {
      it('should include event names found in the ProductCarouselView class method of the same name', () => {
        const prosEvents = PROsView.getEventNames();

        carouselEventNameList.forEach((eventName) => {
          expect(prosEvents[eventName]).toBeTruthy();
        });
      });
    });
  });
});
