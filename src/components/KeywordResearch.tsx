
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface KeywordResearchProps {
  onKeywordSelect: (keyword: string) => void;
  selectedKeyword: string;
}

const KeywordResearch: React.FC<KeywordResearchProps> = ({ onKeywordSelect, selectedKeyword }) => {
  const [seedKeyword, setSeedKeyword] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock AI keyword generation for prototype
  const generateKeywords = async () => {
    if (!seedKeyword.trim()) return;
    
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock keyword suggestions based on seed keyword
    const mockKeywords = [
      `${seedKeyword} strategy`,
      `best ${seedKeyword} practices`,
      `${seedKeyword} optimization`,
      `${seedKeyword} tools`,
      `${seedKeyword} guide`
    ];
    
    setKeywords(mockKeywords);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Keyword Research</h2>
        <p className="text-gray-600">Enter a seed keyword to generate related keyword suggestions</p>
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
              <h3 className="font-medium text-gray-900">Suggested Keywords:</h3>
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
