import {
  getPageTypes,
  getRecommendationContexts,
  getAnalyticZones,
} from '../../../src/js/richRelevance/RRConfig';

describe('RR config functions', () => {
  describe('getPageTypes function', () => {
    it('should return an object with key/value pairs', () => {
      expect(typeof getPageTypes()).toEqual('object');
      expect(getPageTypes()).toEqual({
        addToCartPage: 'add_to_cart_page',
        cartPage: 'cart_page',
        categorySplashPage: 'category_page',
        categoryUnavailable: 'category_page',
        homePage: 'home_page',
        itemPage: 'item_page',
        purchaseCompletePage: 'purchase_complete_page',
        registryZeroSearchResults: 'search_page',
        zeroSearchResults: 'search_page',
        unavailableItemPage: 'item_page',
        wishListPage: 'wish_list_page',
      });
    });
  });

  describe('getRecommendationContexts function', () => {
    it('should return an object with key/value pairs', () => {
      expect(typeof getRecommendationContexts()).toEqual('object');
      expect(getRecommendationContexts()).toEqual({
        atbOverlay: 'atbOverlay',
        atrOverlay: 'atrOverlay',
        bagZoneA: 'bagZoneA',
        homePageContextA: 'homePageContextA',
        homePageContextB: 'homePageContextB',
        homePageContextC: 'homePageContextC',
        pdpZoneA: 'pdpZoneA',
        pdpZoneB: 'pdpZoneB',
        orderConfirmation: 'orderConfirmation',
        unavailablePDPZoneA: 'unavailablePDPZoneA',
        catSplash: 'catSplash',
        categoryUnavailable: 'categoryUnavailable',
        emptyWishListPage: 'emptyWishListPage',
        zeroSearchResults: 'zeroSearchResults',
        regZeroSearchResults: 'regZeroSearchResults',
      });
    });
  });

  describe('getAnalyticZones function', () => {
    it('should return an object with key/value pairs', () => {
      expect(typeof getAnalyticZones()).toEqual('object');
      expect(getAnalyticZones()).toEqual({
        atbOverlay: 'prodrec_pdpzc',
        atrOverlay: 'prodrec_qvatrza',
        bagZoneA: 'prodrec_bagza',
        homePageContextA: 'prodrec_hpza',
        homePageContextB: 'prodrec_hpzb',
        homePageContextC: 'prodrec_hpzc',
        pdpZoneA: 'prodrec_pdpza',
        pdpZoneB: 'prodrec_pdpzb',
        catSplash: 'prodrec_catza',
        categoryUnavailable: 'prodrec_cat_unavail_za',
        emptyWishListPage: 'prodrec_listemptyza',
        orderConfirmation: 'prodrec_ocpza',
        unavailablePDPZoneA: 'prodrec_unavpdpza',
        zeroSearchResults: 'prodrec_zsrzb',
        regZeroSearchResults: 'prodrec_regzsrzb',
      });
    });
  });
});
