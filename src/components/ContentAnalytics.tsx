
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, Target, Clock } from 'lucide-react';

const ContentAnalytics: React.FC = () => {
  const stats = [
    { label: 'Content Generated', value: '24', change: '+12%', icon: BarChart3 },
    { label: 'Avg SEO Score', value: '87%', change: '+5%', icon: Target },
    { label: 'Time Saved', value: '15h', change: '+8h', icon: Clock },
    { label: 'Performance', value: '92%', change: '+3%', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Analytics</h2>
        <p className="text-gray-600">Track your content performance and optimization metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Content Performance Trends</h3>
        <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart visualization coming soon</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContentAnalytics;
