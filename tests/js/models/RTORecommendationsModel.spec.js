import _ from 'underscore';
import Logger from '@component/common/src/util/Logger';
import RTORecommendationsModel from '../../../src/js/models/RTORecommendationsModel';
import {
  getRecommendationContexts,
  RECOMMENDATION_CONTEXT_MAP,
} from '../../../src/js/richRelevance/RRConfig';


describe('RTORecommendationsModel', () => {
  function getNewInstance(options = {}) {
    _.defaults(options, {
      recommendationContext: 'pdpZoneA',
    });

    return new RTORecommendationsModel(options);
  }

  describe('on initialize', () => {
    it('should set a property for options equal to the argument passed in', () => {
      const options = {};
      const instance = getNewInstance(options);

      expect(instance.options).toBe(options);
    });

    it('Log an error if the recommendationContext passed in is invalid', () => {
      spyOn(Logger, 'error');

      getNewInstance({
        recommendationContext: 'invalid recommendation type',
      });

      expect(Logger.error).toHaveBeenCalled();
    });
  });

  describe('url method', () => {
    it('should return a string', () => {
      const instance = getNewInstance();

      expect(typeof instance.url()).toEqual('string');
    });
  });

  describe('requestData method', () => {
    it('should return an object', () => {
      const instance = getNewInstance();

      expect(typeof instance.requestData()).toEqual('object');
      expect(instance.requestData()).toBeTruthy();
    });
  });

  describe('getBodyParameters method', () => {
    describe('Sanitizing of product and category ids for Chanel cat-splash pages', () => {
      beforeEach(function () {
        this.happyPathData = {
          recommendationContext: 'catSplash',
          recommendationConfig: { categoryId: 'onsite_search_redirect-1000926' },
          analytics: { pageID: 'splash_beauty-products-cosmetics_featured-brands_chanel' },
          properties: { brand: 'BCOM' },
        };

        this.instance = getNewInstance();
      });

      it('Get rid of any prefix leaving only digits', function () {
        const params = this.instance.getBodyParameters(this.happyPathData);

        expect(params).toEqual(jasmine.objectContaining({
          productId: '1000926',
          categoryId: '1000926',
        }));
      });

      describe('Keeps the ids "as is" in case of', () => {
        it('A non-BCOM page', function () {
          const params = this.instance.getBodyParameters({
            ...this.happyPathData,
            properties: { brand: 'MCOM' },
          });

          expect(params).toEqual(jasmine.objectContaining({
            productId: 'onsite_search_redirect-1000926',
            categoryId: 'onsite_search_redirect-1000926',
          }));
        });

        it('A non-chanel page', function () {
          const params = this.instance.getBodyParameters({
            ...this.happyPathData,
            analytics: { pageID: 'foo-bar' },
          });

          expect(params).toEqual(jasmine.objectContaining({
            productId: 'onsite_search_redirect-1000926',
            categoryId: 'onsite_search_redirect-1000926',
          }));
        });

        it('A non-cat-splash context', function () {
          const params = this.instance.getBodyParameters({
            ...this.happyPathData,
            recommendationContext: 'fooBar',
          });

          expect(params).not.toEqual(jasmine.objectContaining({
            productId: '1000926',
            categoryId: '1000926',
          }));
        });
      });

      it('Short-circuit tests', function () {
        expect(() => {
          this.instance.getBodyParameters({});

          this.instance.getBodyParameters({
            recommendationContext: undefined,
            recommendationConfig: { categoryId: undefined },
            analytics: { pageID: undefined },
            properties: { brand: undefined },
          });
        }).not.toThrow();
      });
    });

    it('should return an object with the attribute \'context\'', () => {
      const instance = getNewInstance();

      spyOn(instance, 'requestData');
      spyOn(instance, 'getRequiredDataParams');

      const params = instance.getBodyParameters({ recommendationContext: 'pdpZoneA' });

      expect(params.context).toBeDefined();
    });

    it('should return an object with the attributes returned from requestData method', () => {
      const instance = getNewInstance();
      const requestData = 'requestData';

      spyOn(instance, 'requestData').and.returnValue({ requestData });
      spyOn(instance, 'getRequiredDataParams');

      const params = instance.getBodyParameters({ recommendationContext: 'pdpZoneA' });

      expect(params.requestData).toEqual(requestData);
    });

    it('should return an object with the attributes returned from getRequiredDataParams method', () => {
      const instance = getNewInstance();
      const requiredParams = 'requiredParams';

      spyOn(instance, 'requestData');
      spyOn(instance, 'getRequiredDataParams').and.returnValue({ requiredParams });

      const params = instance.getBodyParameters({ recommendationContext: 'pdpZoneA' });

      expect(params.requiredParams).toEqual(requiredParams);
    });
  });

  describe('getOptionalDataParams method', () => {
    it('should', () => {
      const instance = getNewInstance();

      instance.getOptionalDataParams({
        price: 123.54,
        quantity: 1,
      });
    });
  });

  describe('getRequiredDataParams method', () => {
    it('should return an object if an invalid recommendationContext is passed in', () => {
      const instance = getNewInstance();

      expect(instance.getRequiredDataParams({})).toEqual({});
    });

    it('should', () => {
      const instance = getNewInstance();
      let context;

      context = getRecommendationContexts().pdpZoneA;
      instance.getRequiredDataParams({}, context, RECOMMENDATION_CONTEXT_MAP[context]);
      instance.getRequiredDataParams({
        productId: 3048,
        categoryId: 3865,
      }, context, RECOMMENDATION_CONTEXT_MAP[context]);

      context = getRecommendationContexts().bagZoneA;
      instance.getRequiredDataParams(0, context, RECOMMENDATION_CONTEXT_MAP[context]);
      instance.getRequiredDataParams({}, context, RECOMMENDATION_CONTEXT_MAP[context]);
      context = getRecommendationContexts().zeroSearchResults;
      instance.getRequiredDataParams({}, context, RECOMMENDATION_CONTEXT_MAP[context]);
      context = getRecommendationContexts().emptyWishListPage;
      instance.getRequiredDataParams({}, context, RECOMMENDATION_CONTEXT_MAP[context]);
      context = getRecommendationContexts().catSplash;
      instance.getRequiredDataParams({}, context, RECOMMENDATION_CONTEXT_MAP[context]);
      context = getRecommendationContexts().orderConfirmation;
      instance.getRequiredDataParams({ productIds: [] }, context, RECOMMENDATION_CONTEXT_MAP[context]);
      context = getRecommendationContexts().homePage;
      instance.getRequiredDataParams({}, context, RECOMMENDATION_CONTEXT_MAP[context]);
    });
  });

  describe('fetchRecommendations method', () => {
    it('should call the method getBodyParameters with the options property', () => {
      const instance = getNewInstance();

      spyOn(instance, 'getBodyParameters');
      spyOn(instance, 'save');

      instance.fetchRecommendations();

      expect(instance.getBodyParameters).toHaveBeenCalledWith(instance.options);
    });

    it('should', (done) => {
      const instance = getNewInstance();
      spyOn(instance, 'getBodyParameters');
      spyOn(instance, 'save');

      instance.fetchRecommendations();
      window.setTimeout(() => {
        const { success } = instance.save.calls.mostRecent().args[1];
        success({}, {});
        done();
      }, 0);
    });

    it('should Log an error if the save call fails', (done) => {
      const instance = getNewInstance();
      spyOn(Logger, 'error');
      spyOn(instance, 'getBodyParameters');
      spyOn(instance, 'save');

      instance.fetchRecommendations();
      window.setTimeout(() => {
        const { error } = instance.save.calls.mostRecent().args[1];
        error();
        expect(Logger.error).toHaveBeenCalled();
        done();
      }, 0);
    });
  });
});
