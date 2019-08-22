import get from 'lodash.get';
import _ from 'underscore';
import Logger from '@component/common/src/util/Logger';
import {
  getAttr38,
  getAttr41,
} from '../analytics/PROsUICoremetrics';

function getRecProdZonePos(index) {
  return `prodrec-${index + 1}`;
}

function getAnalyticsURLParams(zone, index, productData, choiceId) {
  const categoryId = get(productData, 'product.relationships.taxonomy.defaultCategoryId', '');

  return `RecProdZonePos=${getRecProdZonePos(index)}&` +
      `LinkType=${zone}&` +
      `attr38=${getAttr38(index, choiceId, categoryId)}&` +
      `RecProdZoneDesc=${getAttr41(zone)}`;
}

const getAnalyticsProductURL = (productData, recommendations, zone, index) => {
  if (!Array.isArray(recommendations)) {
    return '';
  }

  try {
    // The product url for each thumbnail needs to be updated to include query params for analytics
    const recData = _.find(recommendations, currentRecData => `${currentRecData.productId}` === `${productData.id}`) || {};
    const clickThruURL = recData.clickThruURL || recData.clickTrackingURL;
    let rrLink = '';

    // clickThruURL will exist if the recommendations are coming from a third party (e.g. RichRelevance)
    if (typeof clickThruURL === 'string') {
      const RR_LINK_DIVIDER = '&ct=';
      rrLink = `${clickThruURL.split(RR_LINK_DIVIDER)[0]}${RR_LINK_DIVIDER}`;
    }

    const { identifier } = productData.product;
    const productLink = `${window.location.protocol}//${window.location.host}${identifier.productUrl}`;

    let productLinkWithAnalytics = `${productLink}&${getAnalyticsURLParams(zone, index, productData, recData.choiceId)}`;

    if (rrLink) {
      productLinkWithAnalytics = window.encodeURIComponent(productLinkWithAnalytics);
    }

    return `${rrLink}${productLinkWithAnalytics}`;
  } catch (e) {
    Logger.error('Error updating productUrls with analytics params for PROs product thumbnails:', e);
    return '';
  }
};

export default getAnalyticsProductURL;
