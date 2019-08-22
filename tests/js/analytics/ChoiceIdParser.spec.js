import * as ChoiceIdParser from '../../../src/js/analytics/ChoiceIdParser';

describe('ChoiceIdParser', () => {
  describe('getChoiceId function', () => {
    it('should return a string no matter what is passed in', () => {
      expect(typeof ChoiceIdParser.getChoiceId()).toEqual('string');
      expect(typeof ChoiceIdParser.getChoiceId({})).toEqual('string');
      expect(typeof ChoiceIdParser.getChoiceId([])).toEqual('string');
      expect(typeof ChoiceIdParser.getChoiceId(1)).toEqual('string');
      expect(typeof ChoiceIdParser.getChoiceId('fgufdhg')).toEqual('string');
      expect(typeof ChoiceIdParser.getChoiceId({ recommendedItems: [] })).toEqual('string');
    });

    it('should return the choiceId of the first recommendedItem', () => {
      const choiceId = 'choiceId';
      const returnedChoiceId = ChoiceIdParser.getChoiceId({
        recommendedItems: [{ choiceId }],
      });

      expect(returnedChoiceId).toEqual(choiceId);
    });
  });

  describe('getEventId function', () => {
    it('should return a string no matter what is passed in', () => {
      expect(typeof ChoiceIdParser.getEventId()).toEqual('string');
      expect(typeof ChoiceIdParser.getEventId({})).toEqual('string');
      expect(typeof ChoiceIdParser.getEventId([])).toEqual('string');
      expect(typeof ChoiceIdParser.getEventId(1)).toEqual('string');
      expect(typeof ChoiceIdParser.getEventId('fgufdhg')).toEqual('string');
    });

    it('should return the expected value from the passed in choiceId', () => {
      const choiceId = 'cidB05MGC-e8afbb15-935f-404e-9ca7-6cede384bee2@H50@recommended+for+you$3865$399242';

      expect(ChoiceIdParser.getEventId(choiceId)).toEqual('e8afbb15-935f-404e-9ca7-6cede384bee2');
    });
  });

  describe('getControlGroupId function', () => {
    it('should return a string no matter what is passed in', () => {
      expect(typeof ChoiceIdParser.getControlGroupId()).toEqual('string');
      expect(typeof ChoiceIdParser.getControlGroupId({})).toEqual('string');
      expect(typeof ChoiceIdParser.getControlGroupId([])).toEqual('string');
      expect(typeof ChoiceIdParser.getControlGroupId(1)).toEqual('string');
      expect(typeof ChoiceIdParser.getControlGroupId('fgufdhg')).toEqual('string');
    });

    it('should return the expected value from the passed in choiceId', () => {
      const choiceId = 'cidB05MGC-e8afbb15-935f-404e-9ca7-6cede384bee2@H50@recommended+for+you$3865$399242';

      expect(ChoiceIdParser.getControlGroupId(choiceId)).toEqual('B05MGC');
    });
  });
});
