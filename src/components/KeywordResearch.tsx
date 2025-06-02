
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AIService from '@/services/aiService';

interface KeywordResearchProps {
  onKeywordSelect: (keyword: string) => void;
  selectedKeyword: string;
  aiService: AIService;
}

const KeywordResearch: React.FC<KeywordResearchProps> = ({ onKeywordSelect, selectedKeyword, aiService }) => {
  const [seedKeyword, setSeedKeyword] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateKeywords = async () => {
    if (!seedKeyword.trim()) return;
    
    setIsLoading(true);
    try {
      const generatedKeywords = await aiService.generateKeywords(seedKeyword.trim());
      setKeywords(generatedKeywords);
      console.log('Generated keywords:', generatedKeywords);
    } catch (error) {
      console.error('Error generating keywords:', error);
      toast({
        title: "Error",
        description: "Failed to generate keywords. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Keyword Research</h2>
        <p className="text-gray-600">Enter a seed keyword to generate AI-powered keyword suggestions</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Input
              placeholder="Enter your seed keyword (e.g., digital marketing)"
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && generateKeywords()}
            />
            <Button 
              onClick={generateKeywords}
              disabled={isLoading || !seedKeyword.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              {isLoading ? 'Generating...' : 'Generate Keywords'}
            </Button>
          </div>

          {keywords.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">AI-Generated Keywords:</h3>
              <div className="grid gap-2">
                {keywords.map((keyword, index) => (
                  <button
                    key={index}
                    onClick={() => onKeywordSelect(keyword)}
                    className={`
                      p-3 text-left rounded-lg border-2 transition-all hover:shadow-md
                      ${selectedKeyword === keyword 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="font-medium">{keyword}</div>
                    <div className="text-sm text-gray-500">Click to select this keyword</div>
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

export default KeywordResearch;
