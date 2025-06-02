
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Copy, Download, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface HistoryItem {
  id: string;
  type: 'keyword' | 'title' | 'content';
  title: string;
  content: string;
  keyword: string;
  seoScore?: number;
  createdAt: Date;
}

const ContentHistory: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('content_history');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setHistory(parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      })));
    }
  }, []);

  const filteredHistory = history.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Content Copied!",
      description: "The content has been copied to your clipboard.",
    });
  };

  const downloadContent = (item: HistoryItem) => {
    const blob = new Blob([item.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.substring(0, 30)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Content Downloaded!",
      description: "The content has been saved to your device.",
    });
  };

  const exportAllContent = () => {
    if (history.length === 0) {
      toast({
        title: "No Content",
        description: "There is no content to export.",
        variant: "destructive",
      });
      return;
    }

    let exportContent = "SEO Scientist - Content History Export\n";
    exportContent += "=====================================\n\n";
    
    history.forEach((item, index) => {
      exportContent += `${index + 1}. ${item.title}\n`;
      exportContent += `Type: ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}\n`;
      exportContent += `Keyword: ${item.keyword}\n`;
      if (item.seoScore) {
        exportContent += `SEO Score: ${item.seoScore}%\n`;
      }
      exportContent += `Created: ${item.createdAt.toLocaleDateString()} at ${item.createdAt.toLocaleTimeString()}\n`;
      exportContent += `Content:\n${item.content}\n`;
      exportContent += "\n" + "=".repeat(50) + "\n\n";
    });

    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-scientist-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete!",
      description: `${history.length} content items have been exported.`,
    });
  };

  const deleteItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('content_history', JSON.stringify(updatedHistory));
    toast({
      title: "Item Deleted",
      description: "The content has been removed from your history.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Content History</h2>
        <p className="text-gray-600">Access and manage your previously generated content</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search your content history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={exportAllContent}>
          <History className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {filteredHistory.length === 0 ? (
        <Card className="p-12 text-center">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Content History</h3>
          <p className="text-gray-500">Start creating content to see your history here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'content' ? 'bg-green-100 text-green-800' :
                      item.type === 'title' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                    {item.seoScore && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.seoScore >= 80 ? 'bg-green-100 text-green-800' :
                        item.seoScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        SEO: {item.seoScore}%
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">Keyword: {item.keyword}</p>
                  <p className="text-sm text-gray-500">
                    {item.createdAt.toLocaleDateString()} at {item.createdAt.toLocaleTimeString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyContent(item.content)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadContent(item)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700 line-clamp-3">{item.content}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentHistory;
