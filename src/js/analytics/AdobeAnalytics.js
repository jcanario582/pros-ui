import TagManager from '@component/common/src/util/TagManagerUtil';
import * as ChoiceIdParser from '../analytics/ChoiceIdParser';

function firePROSLoadLinkTag(zone, recommendationData) {
  const choiceId = ChoiceIdParser.getChoiceId(recommendationData);
  const eventId = ChoiceIdParser.getEventId(choiceId);
  const controlGroupId = ChoiceIdParser.getControlGroupId(choiceId);

  TagManager.fireTag('link', {
    event_name: 'recommendation impression',
    recommendation_event: eventId,
    recommendation_model: controlGroupId || 'RR',
    recommendation_title: recommendationData.strategyMessage,
    recommendation_zone: zone,
  });
}

export default {
  firePROSLoadLinkTag,
};
