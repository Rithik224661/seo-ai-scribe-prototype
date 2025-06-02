import React, { useState } from 'react';
import { FileText, Loader2, Copy, Download, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import AIService from '@/services/aiService';
import historyService from '@/services/historyService';
import analyticsService from '@/services/analyticsService';

interface ContentGenerationProps {
  keyword: string;
  title: string;
  topic: any;
  aiService: AIService;
}

const ContentGeneration: React.FC<ContentGenerationProps> = ({ keyword, title, topic, aiService }) => {
  const [content, setContent] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateContent = async () => {
    if (!keyword || !title || !topic) return;
    
    setIsLoading(true);
    try {
      const generatedContent = await aiService.generateContent(keyword, title, topic);
      const score = aiService.calculateSEOScore(generatedContent, keyword);
      
      setContent(generatedContent);
      setSeoScore(score);
      
      // Save to history with SEO score
      historyService.saveToHistory({
        type: 'content',
        title: title,
        content: generatedContent,
        keyword: keyword,
        seoScore: score
      });

      // Update analytics with SEO score
      analyticsService.updateAnalytics(score, 10);
      
      console.log('Generated content:', generatedContent);
      console.log('SEO Score:', score);
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Content copied!",
      description: "The content has been copied to your clipboard.",
    });
  };

  const downloadContent = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.substring(0, 50)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Content downloaded!",
      description: "The content has been saved to your device.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Generation</h2>
        <p className="text-gray-600">Generate SEO-optimized content based on your selections</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Keyword: {keyword}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Topic: {topic?.title}
          </span>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Selected Title:</h3>
            {seoScore > 0 && (
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className={`font-medium ${
                  seoScore >= 80 ? 'text-green-600' :
                  seoScore >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  SEO Score: {seoScore}%
                </span>
              </div>
            )}
          </div>
          <p className="text-gray-700 font-medium">{title}</p>
          
          <Button 
            onClick={generateContent}
            disabled={isLoading || !keyword || !title || !topic}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
            {isLoading ? 'Generating Content...' : 'Generate SEO Content'}
          </Button>

          {content && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Generated Content</h3>
                <div className="flex items-center space-x-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    seoScore >= 80 ? 'bg-green-100 text-green-800' :
                    seoScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    SEO Score: {seoScore}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {content.split(/\s+/).length} words
                  </div>
                </div>
              </div>
              
              <Textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Generated content will appear here..."
              />
              
              <div className="flex space-x-3">
                <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button onClick={downloadContent} variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download as Text
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ContentGeneration;
