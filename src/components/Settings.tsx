
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    autoSave: true,
    notifications: true,
    darkMode: false,
    analyticsTracking: true,
    emailUpdates: false,
    defaultTone: 'professional',
    maxContentLength: 1000
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Customize your SEO Scientist experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Profile Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <Input placeholder="Your name" defaultValue="SEO Expert" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input placeholder="your@email.com" type="email" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company/Website
              </label>
              <Input placeholder="yourcompany.com" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <SettingsIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Content Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Content Tone
              </label>
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={settings.defaultTone}
                onChange={(e) => updateSetting('defaultTone', e.target.value)}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="authoritative">Authoritative</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Content Length (words)
              </label>
              <Input 
                type="number" 
                value={settings.maxContentLength}
                onChange={(e) => updateSetting('maxContentLength', parseInt(e.target.value))}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-600">Get notified about content updates</p>
              </div>
              <Switch 
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSetting('notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Updates</p>
                <p className="text-sm text-gray-600">Receive weekly performance reports</p>
              </div>
              <Switch 
                checked={settings.emailUpdates}
                onCheckedChange={(checked) => updateSetting('emailUpdates', checked)}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Appearance & Privacy</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-save Content</p>
                <p className="text-sm text-gray-600">Automatically save your work</p>
              </div>
              <Switch 
                checked={settings.autoSave}
                onCheckedChange={(checked) => updateSetting('autoSave', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Analytics Tracking</p>
                <p className="text-sm text-gray-600">Help us improve the product</p>
              </div>
              <Switch 
                checked={settings.analyticsTracking}
                onCheckedChange={(checked) => updateSetting('analyticsTracking', checked)}
              />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">API & Security</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Usage
            </label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Current usage: 1,247 tokens this month</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full">
            Reset API Key
          </Button>
        </div>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
