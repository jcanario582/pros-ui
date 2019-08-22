import TrackingPixel from '@component/common/src/components/TrackingPixel';
import EventsWarPixelManager from '../../../src/js/analytics/EventsWarPixelManager';

describe('EventsWarPixelManager', () => {
  describe('on instantiation', () => {
    it('should add a property for the \'recommendationData\' passed in', () => {
      const recommendationData = {};
      const eventsWarPixelManager = new EventsWarPixelManager(recommendationData);

      expect(eventsWarPixelManager.recommendationData).toBe(recommendationData);
    });

    it('should add a property for \'trackedProducts\'', () => {
      const eventsWarPixelManager = new EventsWarPixelManager();

      expect(eventsWarPixelManager.trackedProducts).toBeDefined();
    });
  });

  describe('getEventData class method', () => {
    it('should return an object', () => {
      expect(typeof EventsWarPixelManager.getEventData([], { options: {} })).toEqual('object');
    });

    it('should set the propery \'rType\' to \'PixelPresented\' if the argument passed for isPresented is truthy', () => {
      const eventData = EventsWarPixelManager.getEventData([], { options: {} }, true);

      expect(eventData.rType).toEqual('PixelPresented');
    });

    it('should set the propery \'rType\' to \'scrolled\' if the argument passed for isPresented is falsy', () => {
      const eventData = EventsWarPixelManager.getEventData([], { options: {} }, false);

      expect(eventData.rType).toEqual('scrolled');
    });

    it('should', () => {
      EventsWarPixelManager.getEventData([
        {
          id: 3048,
          carouselPosition: 1,
        },
      ], { options: {} });
    });
  });

  describe('fireTrackingPixel method', () => {
    beforeEach(() => {
      spyOn(TrackingPixel, 'track');
      spyOn(EventsWarPixelManager, 'getEventData').and.returnValue({
        c: 'context',
        cId: '',
      });
    });

    it('should not call track on TrackingPixel if there are no products to track', () => {
      const eventsWarPixelManager = new EventsWarPixelManager();

      eventsWarPixelManager.fireTrackingPixel();

      expect(TrackingPixel.track).not.toHaveBeenCalled();
    });

    it('should call track on TrackingPixel if there are products to track', () => {
      const eventsWarPixelManager = new EventsWarPixelManager();

      eventsWarPixelManager.fireTrackingPixel([{ id: 3048 }]);

      expect(TrackingPixel.track).toHaveBeenCalled();
    });
  });
});
