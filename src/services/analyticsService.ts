
interface AnalyticsData {
  contentGenerated: number;
  totalSeoScore: number;
  contentCount: number;
  timeSaved: number;
  lastUpdated: Date;
}

class AnalyticsService {
  private storageKey = 'analytics_data';

  getAnalytics(): AnalyticsData {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return {
          contentGenerated: 0,
          totalSeoScore: 0,
          contentCount: 0,
          timeSaved: 0,
          lastUpdated: new Date()
        };
      }
      
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        lastUpdated: new Date(parsed.lastUpdated)
      };
    } catch (error) {
      console.error('Error loading analytics:', error);
      return {
        contentGenerated: 0,
        totalSeoScore: 0,
        contentCount: 0,
        timeSaved: 0,
        lastUpdated: new Date()
      };
    }
  }

  updateAnalytics(seoScore?: number, timeSaved: number = 5): void {
    const current = this.getAnalytics();
    
    const updated: AnalyticsData = {
      contentGenerated: current.contentGenerated + 1,
      totalSeoScore: seoScore ? current.totalSeoScore + seoScore : current.totalSeoScore,
      contentCount: seoScore ? current.contentCount + 1 : current.contentCount,
      timeSaved: current.timeSaved + timeSaved,
      lastUpdated: new Date()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    console.log('Analytics updated:', updated);
  }

  getAverageSeoScore(): number {
    const data = this.getAnalytics();
    return data.contentCount > 0 ? Math.round(data.totalSeoScore / data.contentCount) : 0;
  }

  clearAnalytics(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export default new AnalyticsService();
