import PROsUI from '../../pros-ui';

function getPROSProductData() {
  return {
    productId: '3048',
    categoryId: '3865',
    productName: 'French Garden Fleurence Creamer',
  };
}

function getPROSDemoConfig() {
  return {
    emptyWishListPage: {
      name: 'empty wish list',
      context: 'emptyWishListPage',
      constructor: () => new PROsUI({
        recommendationContext: PROsUI.getRecommendationContexts().emptyWishListPage,
        panelConfig: {
          el: document.getElementById('empty-wish-list-container'),
        },
      }),
    },
    bagZoneA: {
      name: 'bag',
      context: 'bagZoneA',
      constructor: () => new PROsUI({
        recommendationContext: PROsUI.getRecommendationContexts().bagZoneA,
        recommendationConfig: {
          productIds: [100601, 3048],
        },
        panelConfig: {
          el: document.getElementById('bag-container'),
        },
      }),
    },
    atbOverlay: {
      name: 'add to bag',
      context: 'atbOverlay',
      constructor: () => new PROsUI({
        recommendationContext: PROsUI.getRecommendationContexts().atbOverlay,
        recommendationConfig: getPROSProductData(),
        panelConfig: {
          el: document.getElementById('add-to-bag-container'),
          showRating: true,
        },
      }),
    },
    atrOverlay: {
      name: 'add to registry',
      context: 'atrOverlay',
      constructor: () => new PROsUI({
        recommendationContext: PROsUI.getRecommendationContexts().atrOverlay,
        recommendationConfig: getPROSProductData(),
        panelConfig: {
          el: document.getElementById('add-to-registry-container'),
        },
      }),
    },
    categoryUnavailable: {
      name: 'category unavailable',
      context: 'categoryUnavailable',
      constructor: () => new PROsUI({
        recommendationContext: PROsUI.getRecommendationContexts().categoryUnavailable,
        panelConfig: {
          el: document.getElementById('category-unavailable-container'),
        },
      }),
    },
    zeroSearchResults: {
      name: 'zero search results',
      context: 'zeroSearchResults',
      constructor: () => new PROsUI({
        recommendationContext: PROsUI.getRecommendationContexts().zeroSearchResults,
        panelConfig: {
          el: document.getElementById('zero-search-results-container'),
        },
      }),
    },
    regZeroSearchResults: {
      name: 'registry zero search results',
      context: 'regZeroSearchResults',
      constructor: () => new PROsUI({
        recommendationContext: PROsUI.getRecommendationContexts().regZeroSearchResults,
        panelConfig: {
          el: document.getElementById('registry-zero-search-results-container'),
        },
      }),
    },
    catSplash: {
      name: 'cat splash',
      context: 'catSplash',
      constructor: () => new PROsUI({
        recommendationContext: PROsUI.getRecommendationContexts().catSplash,
        recommendationConfig: {
          categoryId: '16958',
        },
        panelConfig: {
          el: document.getElementById('cat-splash-container'),
        },
      }),
    },
    orderConfirmation: {
      name: 'order confirmation',
      context: 'orderConfirmation',
      constructor: () => new PROsUI({
        recommendationContext: PROsUI.getRecommendationContexts().orderConfirmation,
        recommendationConfig: {
          productId: 3048,
          orderId: 132321,
          quantity: 1,
          price: '123.45',
        },
        panelConfig: {
          el: document.getElementById('order-confirmation-container'),
        },
      }),
    },
    homePageContextA: {
      name: 'home page a',
      context: 'homePageContextA',
      constructor: () => new PROsUI({
        recommendationContext: PROsUI.getRecommendationContexts().homePageContextA,
        recommendationConfig: {
          productId: 10,
        },
        panelConfig: {
          el: document.getElementById('home-page-a-container'),
        },
      }),
    },
    homePageContextB: {
      name: 'home page b',
      context: 'homePageContextB',
      constructor: () => new PROsUI({
        recommendationContext: PROsUI.getRecommendationContexts().homePageContextB,
        recommendationConfig: {
          productId: 20,
        },
        panelConfig: {
          el: document.getElementById('home-page-b-container'),
        },
      }),
    },
    homePageContextC: {
      name: 'home page c',
      context: 'homePageContextC',
      constructor: () => new PROsUI({
        recommendationContext: PROsUI.getRecommendationContexts().homePageContextC,
        recommendationConfig: {
          productId: 30,
        },
        panelConfig: {
          el: document.getElementById('home-page-c-container'),
        },
      }),
    },
    unavailablePDPZoneA: {
      name: 'unavailable pdp',
      context: 'unavailablePDPZoneA',
      constructor: () => new PROsUI({
        recommendationConfig: getPROSProductData(),
        recommendationContext: PROsUI.getRecommendationContexts().unavailablePDPZoneA,
        panelConfig: {
          el: document.getElementById('unavailable-pdp-container'),
        },
      }),
    },
  };
}

function renderPDPPROs() {
  // PDP Zone A
  const prosPDPZoneA = new PROsUI({
    recommendationContext: PROsUI.getRecommendationContexts().pdpZoneA,
    recommendationConfig: getPROSProductData(),
    panelConfig: {
      // Set to true if one set of recommendations need to be rendered in multiple locations on the page
      disableAutoRenderCarousel: true,
      respondTo: 'window',
    },
    properties: {
      isRTOPROsEnabled: true,
    },
  });

  const zoneAPanels = [
    prosPDPZoneA.initializeProductCarousel({
      el: document.getElementById('pros-pdp-zone-a-vertical-container'),
      vertical: true,
    }),
    prosPDPZoneA.initializeProductCarousel({
      el: document.getElementById('pros-pdp-zone-a-horizontal-container'),
    }),
  ];

  zoneAPanels.forEach(panel => panel.render.call(panel));

  prosPDPZoneA.fetchRecommendations()
    .then((recommendationData) => {
      zoneAPanels.forEach((panel) => {
        prosPDPZoneA.fetchProductData.call(prosPDPZoneA, recommendationData, panel);
      });
    });

  // PDP Zone B
  const prosViewB = new PROsUI({
    recommendationContext: PROsUI.getRecommendationContexts().pdpZoneB,
    recommendationConfig: getPROSProductData(),
    panelConfig: {
      el: document.getElementById('pros-pdp-zone-b-container'),
    },
    properties: {
      isRTOPROsEnabled: true,
    },
  });

  prosViewB.render();
}

export {
  getPROSProductData,
  getPROSDemoConfig,
  renderPDPPROs,
};
