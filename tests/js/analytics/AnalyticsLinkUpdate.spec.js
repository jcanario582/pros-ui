import _ from 'underscore';
import Logger from '@component/common/src/util/Logger';
import getAnalyticsProductURL from '../../../src/js/analytics/AnalyticsLinkUpdate';

describe('AnalyticsLinkUpdate', () => {
  let productData;
  let recs;
  let zoneData;

  const RECOMMENDATION_TYPE = 'sampleRecommendationContext';

  beforeEach(() => {
    productData =
      {
        id: '1798709',
        product: {
          identifier: {
            productUrl: 'url',
          },
        },
      };

    recs = [
      {
        id: '1798709',
        productId: '1798709',
        clickThruURL: 'clickThruURL',
      },
    ];

    zoneData = {
      recommendationContext: RECOMMENDATION_TYPE,
    };
  });

  describe('getAnalyticsProductURL function', () => {
    it('should update the productUrls', () => {
      getAnalyticsProductURL(productData, recs, zoneData);

      productData = [{}];
      getAnalyticsProductURL(productData, recs, zoneData);
    });

    it('should return early if the productDataList passed in is not an array', () => {
      spyOn(_, 'each');

      getAnalyticsProductURL({}, recs, zoneData);

      expect(_.each).not.toHaveBeenCalled();
    });

    it('should include the additional \'recProdZoneDesc\' parameters if a choiceId is provided', () => {
      recs[0].choiceId = 'choiceId';

      getAnalyticsProductURL(productData, recs, zoneData);
    });

    it('should', () => {
      recs[0].clickThruURL = '';

      getAnalyticsProductURL(productData, recs, zoneData);
      getAnalyticsProductURL(productData, {}, zoneData);
    });

    it('should log an error if one occurs during data parsing', () => {
      spyOn(Logger, 'error');

      productData.product = null;

      getAnalyticsProductURL(productData, recs, zoneData);

      expect(Logger.error).toHaveBeenCalled();
    });
  });
});

