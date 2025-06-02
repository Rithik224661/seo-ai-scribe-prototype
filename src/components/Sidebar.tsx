
import React from 'react';
import { FileText, History, Settings, BookOpen, BarChart3, Download, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'content-writer', label: 'Content Writer', icon: FileText },
    { id: 'templates', label: 'Templates', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'export', label: 'Export Hub', icon: Download },
    { id: 'team', label: 'Team (Coming Soon)', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 p-4">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">SEO Scientist</h1>
            <p className="text-xs text-gray-500">AI Content Suite</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className={`w-full justify-start text-left ${
                activeSection === item.id 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => onSectionChange(item.id)}
              disabled={item.id === 'team'}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <Card className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="text-sm">
          <h3 className="font-medium text-blue-800 mb-2">Pro Features</h3>
          <p className="text-blue-600 text-xs mb-3">Upgrade for unlimited content generation</p>
          <Button size="sm" className="w-full text-xs">
            Upgrade Now
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Sidebar;
