
import React, { useState } from 'react';
import { Key, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  apiKey: string;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet, apiKey }) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      onApiKeySet(inputKey.trim());
      localStorage.setItem('openai_api_key', inputKey.trim());
    }
  };

  if (apiKey) {
    return (
      <Card className="p-4 mb-6 bg-green-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">OpenAI API Key Connected</span>
          </div>
          <Button 
            onClick={() => {
              onApiKeySet('');
              localStorage.removeItem('openai_api_key');
            }}
            variant="outline"
            size="sm"
          >
            Disconnect
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-6 border-amber-200 bg-amber-50">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <h3 className="font-medium text-amber-800">OpenAI API Key Required</h3>
        </div>
        
        <p className="text-sm text-amber-700">
          To use the AI features, please provide your OpenAI API key. Your key is stored locally and never sent to our servers.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              placeholder="sk-..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="pr-20"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
          
          <Button type="submit" disabled={!inputKey.trim()}>
            Connect API Key
          </Button>
        </form>
        
        <p className="text-xs text-amber-600">
          Don't have an API key? Get one at{' '}
          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">
            platform.openai.com
          </a>
        </p>
      </div>
    </Card>
  );
};

export default ApiKeyInput;
