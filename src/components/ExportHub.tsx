
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Globe, Share2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ExportHub: React.FC = () => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    {
      id: 'docx',
      name: 'Microsoft Word',
      icon: FileText,
      description: 'Export as .docx file for editing',
      action: 'Export to Word'
    },
    {
      id: 'html',
      name: 'HTML',
      icon: Globe,
      description: 'Web-ready HTML format',
      action: 'Export as HTML'
    },
    {
      id: 'markdown',
      name: 'Markdown',
      icon: FileText,
      description: 'Markdown format for developers',
      action: 'Export as MD'
    },
    {
      id: 'email',
      name: 'Email Draft',
      icon: Mail,
      description: 'Send content via email',
      action: 'Send Email'
    }
  ];

  const integrations = [
    {
      id: 'wordpress',
      name: 'WordPress',
      description: 'Publish directly to your WordPress site',
      icon: Globe,
      status: 'coming-soon'
    },
    {
      id: 'medium',
      name: 'Medium',
      description: 'Share on Medium platform',
      icon: Share2,
      status: 'coming-soon'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Post to LinkedIn articles',
      icon: Share2,
      status: 'coming-soon'
    }
  ];

  const handleExport = async (format: string) => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export Complete!",
        description: `Your content has been exported as ${format.toUpperCase()}.`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Export Hub</h2>
        <p className="text-gray-600">Export and share your content across multiple platforms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Export Formats</h3>
          <div className="space-y-4">
            {exportFormats.map((format) => {
              const Icon = format.icon;
              return (
                <Card key={format.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-6 h-6 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{format.name}</h4>
                        <p className="text-sm text-gray-600">{format.description}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleExport(format.id)}
                      disabled={isExporting}
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {format.action}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Platform Integrations</h3>
          <div className="space-y-4">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <Card key={integration.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-6 h-6 text-blue-600" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{integration.name}</h4>
                          {integration.status === 'coming-soon' && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    <Button 
                      disabled={integration.status === 'coming-soon'}
                      size="sm"
                      variant="outline"
                    >
                      Connect
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Bulk Export</h3>
          <p className="text-blue-700 mb-4">Export all your content at once with advanced formatting options</p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Download className="w-4 h-4 mr-2" />
            Export All Content
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ExportHub;
