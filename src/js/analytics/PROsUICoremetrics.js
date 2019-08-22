import get from 'lodash.get';
import _ from 'underscore';
import Coremetrics from '@component/common/src/util/Coremetrics';
import ExpSdkJs from '@component/experiment';
import UserStatus from '@component/common/src/util/UserStatus';
import ClientSideStorage from '@component/common/src/util/ClientSideStorage';
import Logger from '@component/common/src/util/Logger';
import * as ChoiceIdParser from '../analytics/ChoiceIdParser';
import {
  RECOMMENDATION_CONTEXT_MAP,
  getAnalyticZones,
  getPageTypes,
} from '../richRelevance/RRConfig';

function getSignedInStatus() {
  const isSignedIn = UserStatus.isSignedIn() ? 'signed-in' : 'guest';
  const isClientSideStorage = ClientSideStorage.isStorageAvailable() ? 'Y' : 'N';
  const isSoftSignedIn = UserStatus.isSoftSignedIn() ? 'Soft sign in' : 'Not soft sign in';

  return `${isSignedIn}|${isClientSideStorage}|${isSoftSignedIn}`;
}

function parseAttributes(attributes) {
  const arrayAttributes = [];

  if (attributes && typeof attributes === 'object' && !Array.isArray(attributes)) {
    _.each(attributes, (val, key) => {
      const attributeNumber = parseInt(key, 10) - 1;

      arrayAttributes[attributeNumber] = val;
    });
  }

  return arrayAttributes;
}

function fetchAttr37() {
  return new Promise((resolve, reject) => {
    ExpSdkJs.getAllSelectedRecipes()
      .then((recipes) => {
        ExpSdkJs.getTags(recipes, 'M')
          .always((attributes = {}) => {
            const attr37 = typeof attributes.pageViewTags === 'string' ? attributes.pageViewTags : '';
            resolve(attr37);
          });
      })
      .fail((err) => {
        Logger.error(`Error retrieving attribute 37: ${err}`);
        reject();
      });
  });
}

function getAttr38(index, choiceId, categoryId) {
  let attr38 = 'NULL';

  if (!choiceId) {
    return attr38;
  }

  const indexNumber = parseInt(index, 10);
  const positionTag = Number.isNaN(indexNumber) ? 'NULL' : `Pos${indexNumber + 1}`;
  const categoryIdTag = categoryId || typeof categoryId === 'number' ? `${categoryId}` : 'NULL';

  attr38 = `${positionTag}` +
    `|${ChoiceIdParser.getControlGroupId(choiceId)}` +
    `|${ChoiceIdParser.getEventId(choiceId)}` +
    `|${ChoiceIdParser.getHeaderId(choiceId)}` +
    `|${categoryIdTag}`;

  return attr38;
}

function getAttr41(zone) {
  return `RR-CMIO-RT-POC|RR-CMIO|${zone}|RR`;
}

async function firePageViewTag(pageID, prosView) {
  const zone = getAnalyticZones()[prosView.options.recommendationContext];
  const attributes = parseAttributes({
    37: await fetchAttr37(),
    38: getAttr38(false, ChoiceIdParser.getChoiceId(prosView.recommendationData), false),
    41: getAttr41(zone),
    48: getSignedInStatus(),
  });

  Coremetrics.createPageViewTag({
    isBCOM: true,
    pageID: `RECPRESENT - ${pageID}`,
    categoryID: 'PROS',
    attributes,
  });
}

function getPageID(prosView) {
  const recommendationConfig = get(prosView, 'options.recommendationConfig', {});
  const data = prosView.options || {};

  if (data.analytics && data.analytics.pageID) {
    return data.analytics.pageID;
  }

  const { pageType } = RECOMMENDATION_CONTEXT_MAP[data.recommendationContext] || {};

  let pageID = '';

  switch (pageType) {
    case getPageTypes().itemPage:
    case getPageTypes().unavailableItemPage:
    case getPageTypes().addToCartPage:
      if (!recommendationConfig.productName) {
        Logger.warn('Missing productName attribute used to construct pageID for Coremetrics');
      }
      pageID = `PRODUCT: ${recommendationConfig.productName} (${recommendationConfig.productId})`;

      break;
    case getPageTypes().wishListPage:
      pageID = 'My Wish List';

      break;
    case getPageTypes().searchPage:
      pageID = 'search_results';

      break;
    case getPageTypes().cartPage:
      pageID = 'Shopping Cart (ba-xx-xx-xx.index_checkout2)';

      break;
    case getPageTypes().purchaseCompletePage:
      pageID = 'Signed In Order Confirmation';

      break;
    case getPageTypes().categorySplashPage:
      Logger.warn(`Missing pageID for Coremetrics for context: ${data.recommendationContext}. pageId must be passed as property for analytics object`);
      break;
    case getPageTypes().homePage:
      pageID = 'Homepage';

      break;
    default:
      Logger.warn('Missing pageID for Coremetrics due to invalid recommendationContext');
  }

  return pageID;
}

export {
  firePageViewTag,
  getAttr38,
  getAttr41,
  getPageID,
  parseAttributes,
};
