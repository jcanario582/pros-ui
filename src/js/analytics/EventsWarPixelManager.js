import _ from 'underscore';
import TrackingPixel from '@component/common/src/components/TrackingPixel';
import { RECOMMENDATION_CONTEXT_MAP } from '../richRelevance/RRConfig';
import * as SessionUtil from '../util/SessionUtil';
import * as ChoiceIdParser from '../analytics/ChoiceIdParser';

const PIXEL_PATH = '/EventsWar/events/pixel/customeraction';

const pixelHostToAppend = () => {
  const { protocol, host } = window.location;

  return `${protocol}//${host}`;
};

function getProductsToTrack(visibleProducts, trackedProducts) {
  if (!Array.isArray(visibleProducts)) {
    return [];
  }

  return visibleProducts.filter(({ id }) => !trackedProducts[id]);
}

class EventsWarPixelManager {
  constructor(recommendationData) {
    this.recommendationData = recommendationData;
    this.trackedProducts = {};
  }

  static getEventData(productsToTrack, prosUI, isPresented) {
    const pList = productsToTrack
      .map(({ carouselPosition, id }) => `${id}_Pos${parseInt(carouselPosition, 10) + 1}`)
      .join('|');

    const recommendationContextData = RECOMMENDATION_CONTEXT_MAP[prosUI.options.recommendationContext] || {};
    const context = recommendationContextData.selectedPlacementId;
    const choiceId = ChoiceIdParser.getChoiceId(prosUI.recommendationData);

    return {
      pList,
      r: SessionUtil.getRequester(),
      c: context,
      rType: isPresented ? 'PixelPresented' : 'scrolled',
      vId: SessionUtil.getSessionId(),
      cId: SessionUtil.getUserID(),
      cgId: ChoiceIdParser.getControlGroupId(choiceId),
      hId: ChoiceIdParser.getHeaderId(choiceId),
      dId: ChoiceIdParser.getEventId(choiceId),
      coreId: SessionUtil.getCoreId(),
    };
  }

  fireTrackingPixel(visibleProducts, prosUI, isPresented) {
    // Filter the visible product list down to the products that are not yet tracked for this context
    const productsToTrack = getProductsToTrack(visibleProducts, this.trackedProducts);

    if (!productsToTrack.length) {
      return;
    }

    const eventData = EventsWarPixelManager.getEventData(productsToTrack, prosUI, isPresented);
    const eventDataArray = [];

    _.each(eventData, (value, key) => {
      if (value) {
        eventDataArray.push(`${key}=${value}`);
      }
    });

    TrackingPixel.track(
      encodeURI(eventDataArray.join('&')),
      {
        pixelHost: pixelHostToAppend(),
        pathToPixel: PIXEL_PATH,
      },
    );

    // Save the products being tracked
    productsToTrack.forEach(({ id }) => {
      this.trackedProducts[id] = true;
    });
  }
}


export default EventsWarPixelManager;
