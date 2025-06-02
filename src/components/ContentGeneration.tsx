
import React, { useState } from 'react';
import { FileText, Loader2, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ContentGenerationProps {
  keyword: string;
  title: string;
  topic: any;
}

const ContentGeneration: React.FC<ContentGenerationProps> = ({ keyword, title, topic }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [seoScore, setSeoScore] = useState(0);
  const { toast } = useToast();

  const generateContent = async () => {
    if (!keyword || !title || !topic) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock content generation
    const mockContent = `# ${title}

${keyword} has become increasingly important in today's digital landscape. This comprehensive guide will walk you through everything you need to know about ${keyword} and how to implement it effectively.

## Introduction

In the rapidly evolving world of digital marketing, ${keyword} stands out as a crucial element for success. Whether you're a beginner or looking to refine your approach, understanding ${keyword} can significantly impact your results.

## Why ${keyword} Matters

The importance of ${keyword} cannot be overstated. Here are key reasons why you should focus on ${keyword}:

- Improved visibility and reach
- Better engagement with your target audience
- Enhanced ROI on your marketing efforts
- Competitive advantage in your industry

## Best Practices for ${keyword}

To maximize the effectiveness of your ${keyword} strategy, consider these proven practices:

1. **Research and Planning**: Start with thorough research to understand your audience and competition.
2. **Quality over Quantity**: Focus on creating high-quality content rather than volume.
3. **Consistent Monitoring**: Regularly track and analyze your ${keyword} performance.
4. **Continuous Optimization**: Make data-driven improvements to your approach.

## Common Mistakes to Avoid

While implementing ${keyword} strategies, be aware of these common pitfalls:

- Neglecting audience research
- Overlooking mobile optimization
- Ignoring analytics and performance metrics
- Focusing solely on short-term results

## Conclusion

Mastering ${keyword} requires dedication, strategic thinking, and continuous learning. By following the guidelines outlined in this comprehensive guide, you'll be well-equipped to leverage ${keyword} for your business success.

Remember, ${keyword} is not just a trend—it's a fundamental aspect of modern digital strategy that will continue to evolve and shape the industry.`;
    
    setContent(mockContent);
    
    // Calculate basic SEO score
    const keywordCount = (mockContent.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    const score = Math.min(100, Math.max(60, keywordCount * 10 + Math.random() * 20));
    setSeoScore(Math.round(score));
    
    setIsLoading(false);
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
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div><strong>Keyword:</strong> {keyword}</div>
            <div><strong>Title:</strong> {title}</div>
            <div><strong>Topic:</strong> {topic?.title}</div>
          </div>

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
