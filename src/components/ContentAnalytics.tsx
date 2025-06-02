
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, Target, Clock } from 'lucide-react';
import analyticsService from '@/services/analyticsService';

const ContentAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    contentGenerated: 0,
    avgSeoScore: 0,
    timeSaved: 0,
    performance: 0
  });

  useEffect(() => {
    const data = analyticsService.getAnalytics();
    const avgSeoScore = analyticsService.getAverageSeoScore();
    
    setAnalytics({
      contentGenerated: data.contentGenerated,
      avgSeoScore: avgSeoScore,
      timeSaved: data.timeSaved,
      performance: avgSeoScore > 0 ? Math.min(100, avgSeoScore + 10) : 0
    });
  }, []);

  const stats = [
    { 
      label: 'Content Generated', 
      value: analytics.contentGenerated.toString(), 
      change: analytics.contentGenerated > 0 ? '+' + analytics.contentGenerated : '0%', 
      icon: BarChart3 
    },
    { 
      label: 'Avg SEO Score', 
      value: analytics.avgSeoScore > 0 ? `${analytics.avgSeoScore}%` : '0%', 
      change: analytics.avgSeoScore > 0 ? '+' + analytics.avgSeoScore + '%' : '0%', 
      icon: Target 
    },
    { 
      label: 'Time Saved', 
      value: `${analytics.timeSaved}h`, 
      change: analytics.timeSaved > 0 ? '+' + analytics.timeSaved + 'h' : '0h', 
      icon: Clock 
    },
    { 
      label: 'Performance', 
      value: `${analytics.performance}%`, 
      change: analytics.performance > 0 ? '+' + analytics.performance + '%' : '0%', 
      icon: TrendingUp 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Analytics</h2>
        <p className="text-gray-600">Track your content performance and SEO optimization metrics</p>
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
                  <p className={`text-sm ${analytics.contentGenerated > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                    {stat.change}
                  </p>
                </div>
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">SEO Score Analysis</h3>
        {analytics.contentGenerated > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average SEO Score</span>
              <span className="text-lg font-bold text-blue-600">{analytics.avgSeoScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${analytics.avgSeoScore}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="text-gray-500">Content Pieces</p>
                <p className="font-semibold">{analytics.contentGenerated}</p>
              </div>
              <div>
                <p className="text-gray-500">Time Saved</p>
                <p className="font-semibold">{analytics.timeSaved}h</p>
              </div>
              <div>
                <p className="text-gray-500">Avg Score</p>
                <p className="font-semibold">{analytics.avgSeoScore}%</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Start creating content to see analytics</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ContentAnalytics;
