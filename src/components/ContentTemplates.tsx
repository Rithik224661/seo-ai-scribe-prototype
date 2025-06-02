
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Copy, Star, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  prompt: string;
  rating: number;
}

const ContentTemplates: React.FC = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates: Template[] = [
    {
      id: '1',
      name: 'Blog Post Introduction',
      description: 'Engaging introductions for blog posts',
      category: 'blog',
      prompt: 'Write an engaging introduction for a blog post about {topic}. Hook the reader and preview the main points.',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Product Description',
      description: 'Compelling product descriptions for e-commerce',
      category: 'ecommerce',
      prompt: 'Create a compelling product description for {product} highlighting key benefits and features.',
      rating: 4.9
    },
    {
      id: '3',
      name: 'Social Media Caption',
      description: 'Catchy captions for social media posts',
      category: 'social',
      prompt: 'Write a catchy social media caption for {platform} about {topic} with relevant hashtags.',
      rating: 4.7
    },
    {
      id: '4',
      name: 'Email Subject Line',
      description: 'High-converting email subject lines',
      category: 'email',
      prompt: 'Generate compelling email subject lines for {campaign_type} that increase open rates.',
      rating: 4.6
    },
    {
      id: '5',
      name: 'Meta Description',
      description: 'SEO-optimized meta descriptions',
      category: 'seo',
      prompt: 'Write an SEO-optimized meta description for {page_title} targeting {keyword}.',
      rating: 4.8
    },
    {
      id: '6',
      name: 'Landing Page Headline',
      description: 'Converting headlines for landing pages',
      category: 'landing',
      prompt: 'Create a high-converting headline for a landing page selling {product/service}.',
      rating: 4.9
    }
  ];

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'blog', label: 'Blog Posts' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'social', label: 'Social Media' },
    { id: 'email', label: 'Email Marketing' },
    { id: 'seo', label: 'SEO' },
    { id: 'landing', label: 'Landing Pages' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const useTemplate = (template: Template) => {
    navigator.clipboard.writeText(template.prompt);
    toast({
      title: "Template Copied!",
      description: `${template.name} has been copied to your clipboard.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Templates</h2>
        <p className="text-gray-600">Pre-built templates to accelerate your content creation</p>
      </div>

      <div className="flex items-center space-x-4 overflow-x-auto pb-2">
        <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="whitespace-nowrap"
          >
            {category.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{template.rating}</span>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
            
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-gray-700 font-mono">{template.prompt}</p>
            </div>
            
            <Button 
              onClick={() => useTemplate(template)}
              className="w-full"
              size="sm"
            >
              <Copy className="w-4 h-4 mr-2" />
              Use Template
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentTemplates;
