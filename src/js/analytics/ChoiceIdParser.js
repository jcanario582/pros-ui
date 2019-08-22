function getChoiceId(recommendationData = {}) {
  const recommendations = recommendationData.recommendedItems;

  if (!Array.isArray(recommendations)) {
    return '';
  }

  const firstRecommendation = recommendations[0] || {};

  return firstRecommendation.choiceId || '';
}

function getEventId(choiceId) {
  if (typeof choiceId !== 'string') {
    return '';
  }

  const eventId = choiceId.match((/-([\w\d-]+)/));

  return (eventId && eventId[1]) ? eventId[1] : '';
}

function getControlGroupId(choiceId) {
  if (typeof choiceId !== 'string') {
    return '';
  }

  const [controlGroupId] = choiceId.split('-');

  return controlGroupId.substring(3, 9);
}

function getHeaderId(choiceId) {
  if (typeof choiceId !== 'string') {
    return '';
  }

  const hId = choiceId.match(/@(H.+?)@/);

  return (hId && hId[1]) ? hId[1] : '';
}

export {
  getChoiceId,
  getEventId,
  getControlGroupId,
  getHeaderId,
};
