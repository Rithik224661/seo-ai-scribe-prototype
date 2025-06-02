interface HistoryItem {
  id: string;
  type: 'keyword' | 'title' | 'content';
  title: string;
  content: string;
  keyword: string;
  seoScore?: number;
  createdAt: Date;
}

class HistoryService {
  private storageKey = 'content_history';
  private maxItems = 50;

  saveToHistory(item: Omit<HistoryItem, 'id' | 'createdAt'>): void {
    const history = this.getHistory();
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    history.unshift(newItem);
    
    // Keep only the latest items
    if (history.length > this.maxItems) {
      history.splice(this.maxItems);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(history));
    console.log('Saved to history:', newItem);
  }

  getHistory(): HistoryItem[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }));
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  clearHistory(): void {
    localStorage.removeItem(this.storageKey);
  }

  deleteItem(id: string): void {
    const history = this.getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }
}

export default new HistoryService();
