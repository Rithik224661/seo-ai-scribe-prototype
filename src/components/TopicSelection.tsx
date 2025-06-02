
import React, { useState } from 'react';
import { BookText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AIService from '@/services/aiService';

interface TopicSelectionProps {
  title: string;
  keyword: string;
  onTopicSelect: (topic: any) => void;
  selectedTopic: any;
  aiService: AIService;
}

const TopicSelection: React.FC<TopicSelectionProps> = ({ title, keyword, onTopicSelect, selectedTopic, aiService }) => {
  const [topics, setTopics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateTopics = async () => {
    if (!title || !keyword) return;
    
    setIsLoading(true);
    try {
      const generatedTopics = await aiService.generateTopics(title, keyword);
      setTopics(generatedTopics);
      console.log('Generated topics:', generatedTopics);
    } catch (error) {
      console.error('Error generating topics:', error);
      toast({
        title: "Error",
        description: "Failed to generate topics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Topic Selection</h2>
        <p className="text-gray-600">Choose a topic structure for your content</p>
        <div className="mt-2 space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {keyword}
          </span>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Selected Title:</h3>
            <p className="text-gray-700">{title}</p>
          </div>

          <Button 
            onClick={generateTopics}
            disabled={isLoading || !title}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BookText className="w-4 h-4 mr-2" />}
            {isLoading ? 'Generating Topics...' : 'Generate Topic Outlines'}
          </Button>

          {topics.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">AI-Generated Topic Outlines:</h3>
              <div className="grid gap-4">
                {topics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => onTopicSelect(topic)}
                    className={`
                      p-4 text-left rounded-lg border-2 transition-all hover:shadow-md
                      ${selectedTopic?.title === topic.title 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="font-medium text-gray-900 mb-2">{topic.title}</div>
                    <div className="space-y-1">
                      {topic.outline.slice(0, 3).map((point: string, i: number) => (
                        <div key={i} className="text-sm text-gray-600">• {point}</div>
                      ))}
                      {topic.outline.length > 3 && (
                        <div className="text-sm text-gray-500">...and {topic.outline.length - 3} more sections</div>
                      )}
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

export default TopicSelection;
