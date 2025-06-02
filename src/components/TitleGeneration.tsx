
import React, { useState } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AIService from '@/services/aiService';

interface TitleGenerationProps {
  keyword: string;
  onTitleSelect: (title: string) => void;
  selectedTitle: string;
  aiService: AIService;
}

const TitleGeneration: React.FC<TitleGenerationProps> = ({ keyword, onTitleSelect, selectedTitle, aiService }) => {
  const [titles, setTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateTitles = async () => {
    if (!keyword) return;
    
    setIsLoading(true);
    try {
      const generatedTitles = await aiService.generateTitles(keyword);
      setTitles(generatedTitles);
      console.log('Generated titles:', generatedTitles);
    } catch (error) {
      console.error('Error generating titles:', error);
      toast({
        title: "Error",
        description: "Failed to generate titles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Title Generation</h2>
        <p className="text-gray-600">Generate SEO-optimized titles for your selected keyword</p>
        <div className="mt-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Keyword: {keyword}
          </span>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <Button 
            onClick={generateTitles}
            disabled={isLoading || !keyword}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lightbulb className="w-4 h-4 mr-2" />}
            {isLoading ? 'Generating Titles...' : 'Generate SEO Titles'}
          </Button>

          {titles.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">AI-Generated Titles:</h3>
              <div className="grid gap-3">
                {titles.map((title, index) => (
                  <button
                    key={index}
                    onClick={() => onTitleSelect(title)}
                    className={`
                      p-4 text-left rounded-lg border-2 transition-all hover:shadow-md
                      ${selectedTitle === title 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="font-medium">{title}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Length: {title.length} chars | Click to select
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TitleGeneration;
