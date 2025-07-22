import { analyticsConfig } from '../config';
import { logger } from '../middleware/logger';
import { cache } from './cache';

// Interface for analytics event
interface AnalyticsEvent {
  eventType: string;
  userId?: string;
  epkId?: string;
  timestamp: number;
  metadata: Record<string, any>;
}

// Interface for page view data
interface PageViewData {
  url: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp: number;
}

// Interface for user interaction data
interface InteractionData {
  type: 'click' | 'scroll' | 'play' | 'pause' | 'download';
  elementId?: string;
  position?: number;
  duration?: number;
  timestamp: number;
}

// Analytics service
export const analytics = {
  // Track page view
  trackPageView: async (epkId: string, data: PageViewData): Promise<void> => {
    try {
      if (!analyticsConfig.enabled) return;

      const event: AnalyticsEvent = {
        eventType: 'page_view',
        epkId,
        timestamp: Date.now(),
        metadata: data
      };

      // Store event in cache for batch processing
      await cache.hset('analytics_events', `${event.timestamp}_${epkId}`, event);

      // Increment page view counter
      await cache.incr(`page_views_${epkId}`);

      // Update unique visitors (using IP address)
      if (data.ipAddress) {
        const uniqueKey = `unique_visitors_${epkId}_${data.ipAddress}`;
        const isNewVisitor = !(await cache.exists(uniqueKey));
        if (isNewVisitor) {
          await cache.set(uniqueKey, '1', 86400); // 24 hours TTL
          await cache.incr(`unique_visitors_${epkId}`);
        }
      }
    } catch (error) {
      logger.error('Error tracking page view:', error);
    }
  },

  // Track user interaction
  trackInteraction: async (epkId: string, data: InteractionData): Promise<void> => {
    try {
      if (!analyticsConfig.enabled) return;

      const event: AnalyticsEvent = {
        eventType: 'interaction',
        epkId,
        timestamp: Date.now(),
        metadata: data
      };

      await cache.hset('analytics_events', `${event.timestamp}_${epkId}`, event);

      // Update interaction counters
      await cache.incr(`interaction_${data.type}_${epkId}`);
    } catch (error) {
      logger.error('Error tracking interaction:', error);
    }
  },

  // Get EPK analytics
  getEpkAnalytics: async (epkId: string): Promise<any> => {
    try {
      const pageViews = parseInt(await cache.get(`page_views_${epkId}`) || '0');
      const uniqueVisitors = parseInt(await cache.get(`unique_visitors_${epkId}`) || '0');

      // Get interaction counts
      const interactions = {
        clicks: parseInt(await cache.get(`interaction_click_${epkId}`) || '0'),
        scrolls: parseInt(await cache.get(`interaction_scroll_${epkId}`) || '0'),
        plays: parseInt(await cache.get(`interaction_play_${epkId}`) || '0'),
        pauses: parseInt(await cache.get(`interaction_pause_${epkId}`) || '0'),
        downloads: parseInt(await cache.get(`interaction_download_${epkId}`) || '0')
      };

      return {
        pageViews,
        uniqueVisitors,
        interactions,
        engagementRate: pageViews > 0 ? (Object.values(interactions).reduce((a, b) => a + b, 0) / pageViews) : 0
      };
    } catch (error) {
      logger.error('Error getting EPK analytics:', error);
      return null;
    }
  },

  // Process analytics events (to be run periodically)
  processEvents: async (): Promise<void> => {
    try {
      const events = await cache.hgetall<AnalyticsEvent>('analytics_events');
      if (!events) return;

      // Process events (e.g., store in database, send to external analytics service)
      for (const [key, event] of Object.entries(events)) {
        // Process event based on type
        switch (event.eventType) {
          case 'page_view':
            // Process page view event
            break;
          case 'interaction':
            // Process interaction event
            break;
          default:
            logger.warn(`Unknown event type: ${event.eventType}`);
        }

        // Remove processed event
        await cache.hdel('analytics_events', key);
      }
    } catch (error) {
      logger.error('Error processing analytics events:', error);
    }
  },

  // Clear analytics data
  clearAnalytics: async (epkId: string): Promise<void> => {
    try {
      const keys = [
        `page_views_${epkId}`,
        `unique_visitors_${epkId}`,
        `interaction_click_${epkId}`,
        `interaction_scroll_${epkId}`,
        `interaction_play_${epkId}`,
        `interaction_pause_${epkId}`,
        `interaction_download_${epkId}`
      ];

      for (const key of keys) {
        await cache.del(key);
      }

      // Clear events for this EPK
      const events = await cache.hgetall<AnalyticsEvent>('analytics_events');
      if (events) {
        for (const [key, event] of Object.entries(events)) {
          if (event.epkId === epkId) {
            await cache.hdel('analytics_events', key);
          }
        }
      }
    } catch (error) {
      logger.error('Error clearing analytics:', error);
    }
  }
};