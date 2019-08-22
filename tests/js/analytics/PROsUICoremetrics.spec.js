import UserStatus from '@component/common/src/util/UserStatus';
import ClientSideStorage from '@component/common/src/util/ClientSideStorage';
import * as ExpSdkJs from '@component/experiment';
import * as PROsUICoremetrics from '../../../src/js/analytics/PROsUICoremetrics';

describe('PROsUICoremetrics', () => {
  describe('parseAttributes function', () => {
    it('should return an array', () => {
      expect(Array.isArray(PROsUICoremetrics.parseAttributes())).toBe(true);
    });
  });

  describe('getAttr38 function', () => {
    it('should', () => {
      PROsUICoremetrics.getAttr38(false, 'choiceId', '123');
    });
  });

  describe('firePageViewTag function', () => {
    it('should', () => {
      const prosView = {
        options: {
          recommendationContext: 'pdpZoneA',
        },
      };
      spyOn(ExpSdkJs, 'getAllSelectedRecipes').and.returnValue(Promise.resolve());

      PROsUICoremetrics.firePageViewTag('', prosView, {});
      PROsUICoremetrics.firePageViewTag('', prosView, {});
      spyOn(UserStatus, 'isSignedIn').and.returnValue(true);
      spyOn(ClientSideStorage, 'isStorageAvailable').and.returnValue(false);
      spyOn(UserStatus, 'isSoftSignedIn').and.returnValue(true);
      PROsUICoremetrics.firePageViewTag('', prosView, {});
    });
  });

  describe('getPageID function', () => {
    it('should', () => {
      const prosView = {
        options: {
          recommendationContext: 'pdpZoneA',
        },
      };
      PROsUICoremetrics.getPageID(prosView);
      prosView.options.productName = 'product name';
      PROsUICoremetrics.getPageID(prosView);
      prosView.options.recommendationContext = 'emptyWishListPage';
      PROsUICoremetrics.getPageID(prosView);
      prosView.options.recommendationContext = 'regZeroSearchResults';
      PROsUICoremetrics.getPageID(prosView);
      prosView.options.recommendationContext = 'orderConfirmation';
      PROsUICoremetrics.getPageID(prosView);
      prosView.options.recommendationContext = 'catSplash';
      PROsUICoremetrics.getPageID(prosView);
      prosView.options.recommendationContext = 'homePageContextA';
      PROsUICoremetrics.getPageID(prosView);
      prosView.options.recommendationContext = 'bagZoneA';
      PROsUICoremetrics.getPageID(prosView);
      PROsUICoremetrics.getPageID({});

      prosView.options.analytics = { pageID: 'page id' };
      PROsUICoremetrics.getPageID(prosView);
    });
  });
});
