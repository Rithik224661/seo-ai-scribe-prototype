
import React, { useState } from 'react';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import KeywordResearch from '@/components/KeywordResearch';
import TitleGeneration from '@/components/TitleGeneration';
import TopicSelection from '@/components/TopicSelection';
import ContentGeneration from '@/components/ContentGeneration';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const steps = [
    'Keyword Research',
    'Title Generation',
    'Topic Selection',
    'Content Creation'
  ];

  const canProceedToNext = () => {
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <KeywordResearch 
            onKeywordSelect={setSelectedKeyword}
            selectedKeyword={selectedKeyword}
          />
        );
      case 2:
        return (
          <TitleGeneration 
            keyword={selectedKeyword}
            onTitleSelect={setSelectedTitle}
            selectedTitle={selectedTitle}
          />
        );
      case 3:
        return (
          <TopicSelection 
            title={selectedTitle}
            keyword={selectedKeyword}
            onTopicSelect={setSelectedTopic}
            selectedTopic={selectedTopic}
          />
        );
      case 4:
        return (
          <ContentGeneration 
            keyword={selectedKeyword}
            title={selectedTitle}
            topic={selectedTopic}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <StepIndicator currentStep={currentStep} steps={steps} />
          
          <div className="mb-8">
            {renderCurrentStep()}
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
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            SEO Scientist AI Content Writer - Prototype v1.0
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
