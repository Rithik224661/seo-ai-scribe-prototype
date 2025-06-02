
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import StepIndicator from '@/components/StepIndicator';
import KeywordResearch from '@/components/KeywordResearch';
import TitleGeneration from '@/components/TitleGeneration';
import TopicSelection from '@/components/TopicSelection';
import ContentGeneration from '@/components/ContentGeneration';
import ContentAnalytics from '@/components/ContentAnalytics';
import ContentTemplates from '@/components/ContentTemplates';
import ContentHistory from '@/components/ContentHistory';
import ExportHub from '@/components/ExportHub';
import Settings from '@/components/Settings';
import ApiKeyInput from '@/components/ApiKeyInput';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AIService from '@/services/aiService';
import historyService from '@/services/historyService';

const Index = () => {
  const [activeSection, setActiveSection] = useState('content-writer');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [aiService, setAiService] = useState<AIService | null>(null);

  const steps = [
    'Keyword Research',
    'Title Generation',
    'Topic Selection',
    'Content Creation'
  ];

  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setAiService(new AIService({ apiKey: storedKey }));
    }
  }, []);

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    if (key) {
      setAiService(new AIService({ apiKey: key }));
    } else {
      setAiService(null);
    }
  };

  const canProceedToNext = () => {
    if (!apiKey) return false;
    
    switch (currentStep) {
      case 1: return selectedKeyword;
      case 2: return selectedTitle;
      case 3: return selectedTopic;
      case 4: return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (canProceedToNext() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Enhanced handlers with history saving
  const handleKeywordSelect = (keyword: string) => {
    setSelectedKeyword(keyword);
    historyService.saveToHistory({
      type: 'keyword',
      title: `Keyword: ${keyword}`,
      content: keyword,
      keyword: keyword
    });
  };

  const handleTitleSelect = (title: string) => {
    setSelectedTitle(title);
    historyService.saveToHistory({
      type: 'title',
      title: title,
      content: title,
      keyword: selectedKeyword
    });
  };

  const renderContentWriter = () => {
    if (!aiService) {
      return <ApiKeyInput onApiKeySet={handleApiKeySet} apiKey={apiKey} />;
    }

    return (
      <>
        <StepIndicator currentStep={currentStep} steps={steps} />
        
        <div className="mb-8">
          {currentStep === 1 && (
            <KeywordResearch 
              onKeywordSelect={handleKeywordSelect}
              selectedKeyword={selectedKeyword}
              aiService={aiService}
            />
          )}
          {currentStep === 2 && (
            <TitleGeneration 
              keyword={selectedKeyword}
              onTitleSelect={handleTitleSelect}
              selectedTitle={selectedTitle}
              aiService={aiService}
            />
          )}
          {currentStep === 3 && (
            <TopicSelection 
              title={selectedTitle}
              keyword={selectedKeyword}
              onTopicSelect={setSelectedTopic}
              selectedTopic={selectedTopic}
              aiService={aiService}
            />
          )}
          {currentStep === 4 && (
            <ContentGeneration 
              keyword={selectedKeyword}
              title={selectedTitle}
              topic={selectedTopic}
              aiService={aiService}
            />
          )}
        </div>

        <div className="flex justify-between items-center">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>

          <Button
            onClick={nextStep}
            disabled={!canProceedToNext() || currentStep === 4}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'content-writer':
        return renderContentWriter();
      case 'templates':
        return <ContentTemplates />;
      case 'analytics':
        return <ContentAnalytics />;
      case 'history':
        return <ContentHistory />;
      case 'export':
        return <ExportHub />;
      case 'settings':
        return <Settings />;
      default:
        return renderContentWriter();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[calc(100vh-4rem)]">
            {activeSection === 'content-writer' && !apiKey && (
              <ApiKeyInput onApiKeySet={handleApiKeySet} apiKey={apiKey} />
            )}
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
