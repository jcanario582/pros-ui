import _ from 'underscore';

export const getPageTypes = () => ({
  addToCartPage: 'add_to_cart_page',
  cartPage: 'cart_page',
  categorySplashPage: 'category_page',
  categoryUnavailable: 'category_page',
  homePage: 'home_page',
  itemPage: 'item_page',
  purchaseCompletePage: 'purchase_complete_page',
  registryZeroSearchResults: 'search_page',
  unavailableItemPage: 'item_page',
  wishListPage: 'wish_list_page',
  zeroSearchResults: 'search_page',
});

// The keys in this object are what will be passed publicly for selecting a pageType and placementId combination
export const RECOMMENDATION_CONTEXT_MAP = {
  atbOverlay: {
    pageType: getPageTypes().addToCartPage,
    selectedPlacementId: 'ATBPage_Overlay',
    analytics: 'prodrec_pdpzc',
  },
  atrOverlay: {
    pageType: getPageTypes().addToCartPage,
    selectedPlacementId: 'ATRPage_Overlay',
    analytics: 'prodrec_qvatrza',
    registrableOnly: true,
  },
  bagZoneA: {
    pageType: getPageTypes().cartPage,
    selectedPlacementId: 'SB_ZONE_A',
    analytics: 'prodrec_bagza',
  },
  catSplash: {
    pageType: getPageTypes().categorySplashPage,
    selectedPlacementId: 'CAT_ZONE_A',
    analytics: 'prodrec_catza',
  },
  categoryUnavailable: {
    pageType: getPageTypes().categoryUnavailable,
    selectedPlacementId: 'CAT_UNAVAIL_ZONE_A',
    analytics: 'prodrec_cat_unavail_za',
  },
  emptyWishListPage: {
    pageType: getPageTypes().wishListPage,
    selectedPlacementId: 'WISHLIST_EMPTY_ZONE_A',
    analytics: 'prodrec_listemptyza',
  },
  homePageContextA: {
    pageType: getPageTypes().homePage,
    selectedPlacementId: 'HP_ZONE_A',
    analytics: 'prodrec_hpza',
  },
  homePageContextB: {
    pageType: getPageTypes().homePage,
    selectedPlacementId: 'HP_ZONE_B',
    analytics: 'prodrec_hpzb',
  },
  homePageContextC: {
    pageType: getPageTypes().homePage,
    selectedPlacementId: 'HP_ZONE_C',
    analytics: 'prodrec_hpzc',
  },
  orderConfirmation: {
    pageType: getPageTypes().purchaseCompletePage,
    selectedPlacementId: 'OC_Zone_A',
    rtoContext: 'OCP_ZONE_A',
    analytics: 'prodrec_ocpza',
  },
  pdpZoneA: {
    pageType: getPageTypes().itemPage,
    selectedPlacementId: 'PDP_ZONE_A',
    analytics: 'prodrec_pdpza',
  },
  pdpZoneB: {
    pageType: getPageTypes().itemPage,
    selectedPlacementId: 'PDP_ZONE_B',
    analytics: 'prodrec_pdpzb',
  },
  unavailablePDPZoneA: {
    pageType: getPageTypes().unavailableItemPage,
    selectedPlacementId: 'PDP_UNAVAIL_ZONE_A',
    analytics: 'prodrec_unavpdpza',

  },
  regZeroSearchResults: {
    pageType: getPageTypes().registryZeroSearchResults,
    selectedPlacementId: 'REG_ZSR_ZONE_B',
    analytics: 'prodrec_regzsrzb',
    registrableOnly: true,
  },
  zeroSearchResults: {
    pageType: getPageTypes().zeroSearchResults,
    selectedPlacementId: 'ZSR_ZONE_B',
    analytics: 'prodrec_zsrzb',
  },
};

// The function for selecting the appropriate pageType and placementId combination
// Returned values from the keys of RECOMMENDATION_CONTEXT_MAP
export const getRecommendationContexts = () => {
  const recommendationContexts = {};

  _.keys(RECOMMENDATION_CONTEXT_MAP).forEach((recommendationContext) => {
    recommendationContexts[recommendationContext] = recommendationContext;
  });

  return recommendationContexts;
};

export const getAnalyticZones = () => {
  const keys = _.keys(RECOMMENDATION_CONTEXT_MAP);

  return _.object(
    keys,
    keys.map(key => RECOMMENDATION_CONTEXT_MAP[key].analytics),
  );
};
