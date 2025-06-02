interface AIServiceConfig {
  apiKey: string;
}

class AIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';
  private maxContentLength: number = 1000;

  constructor(config: AIServiceConfig) {
    this.apiKey = config.apiKey;
    // Load max content length from settings
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.maxContentLength = settings.maxContentLength || 1000;
    }
  }

  setMaxContentLength(length: number) {
    this.maxContentLength = length;
  }

  private async makeRequest(messages: { role: string; content: string }[], maxTokens: number = 1000) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async generateKeywords(seedKeyword: string): Promise<string[]> {
    const prompt = `Generate 5 SEO-focused keyword suggestions related to "${seedKeyword}". Focus on keywords that would be valuable for content marketing and have good search potential. Consider:
    - Long-tail keywords
    - Question-based keywords  
    - Commercial intent keywords
    - Related semantic keywords
    
    Return only the keywords as a simple list, one per line, without numbers or bullets.`;
    
    const response = await this.makeRequest([
      { role: 'system', content: 'You are an SEO expert specializing in keyword research with deep understanding of search intent and semantic SEO.' },
      { role: 'user', content: prompt }
    ]);

    return response.split('\n').filter((keyword: string) => keyword.trim()).slice(0, 5);
  }

  async generateTitles(keyword: string): Promise<string[]> {
    const prompt = `Create 3 SEO-optimized, engaging blog post titles for the keyword "${keyword}". The titles should be:
    - Between 50-60 characters for optimal SEO
    - Compelling and click-worthy with emotional triggers
    - Professional tone but engaging
    - Include the main keyword naturally
    - Consider different content angles (how-to, listicle, guide)
    
    Return only the titles, one per line.`;
    
    const response = await this.makeRequest([
      { role: 'system', content: 'You are an expert content strategist and SEO copywriter with expertise in creating high-converting headlines.' },
      { role: 'user', content: prompt }
    ]);

    return response.split('\n').filter((title: string) => title.trim()).slice(0, 3);
  }

  async generateTopics(title: string, keyword: string): Promise<any[]> {
    const prompt = `Based on the title "${title}" and keyword "${keyword}", create 2 comprehensive content outlines with different approaches. Each outline should include:
    - A clear topic approach/angle
    - 6-8 main section headings that flow logically
    - Consider user search intent and journey stage
    - Include actionable sections and takeaways
    
    Format as JSON with this structure:
    [
      {
        "title": "Comprehensive Approach Name",
        "outline": ["Introduction to ${keyword}", "Section 2", "Section 3", etc]
      }
    ]`;
    
    const response = await this.makeRequest([
      { role: 'system', content: 'You are a content strategist who creates detailed article outlines optimized for user engagement and SEO. Always respond with valid JSON.' },
      { role: 'user', content: prompt }
    ]);

    try {
      return JSON.parse(response);
    } catch (error) {
      // Enhanced fallback with better structure
      return [
        {
          title: "Comprehensive Guide Approach",
          outline: [
            `Introduction to ${keyword}`,
            `Why ${keyword} matters in 2024`,
            `Essential ${keyword} strategies`,
            `Step-by-step implementation guide`,
            `Common ${keyword} mistakes to avoid`,
            `Advanced ${keyword} techniques`,
            `Measuring ${keyword} success`,
            `Conclusion and next steps`
          ]
        },
        {
          title: "Practical How-To Approach", 
          outline: [
            `Getting started with ${keyword}`,
            `${keyword} fundamentals explained`,
            `Tools and resources needed`,
            `Best practices for ${keyword}`,
            `Real-world ${keyword} examples`,
            `Troubleshooting common issues`,
            `Taking ${keyword} to the next level`
          ]
        }
      ];
    }
  }

  async generateContent(keyword: string, title: string, topic: any): Promise<string> {
    const prompt = `Write a comprehensive, SEO-optimized article based on:
    - Title: "${title}"
    - Main keyword: "${keyword}"
    - Topic approach: ${topic.title}
    - Outline: ${topic.outline.join(', ')}
    
    Requirements:
    - Write approximately ${this.maxContentLength} words
    - Natural keyword integration (1-2% density, avoid keyword stuffing)
    - Engaging introduction with hook and clear value proposition
    - Use headers (##) for main sections based on the outline
    - Include practical tips, actionable advice, and examples
    - Professional, informative tone that builds authority
    - Strong conclusion with clear next steps
    - SEO-friendly structure with proper heading hierarchy
    - Include relevant LSI keywords naturally
    
    Focus on providing real value to readers while maintaining SEO best practices.`;
    
    const response = await this.makeRequest([
      { role: 'system', content: 'You are an expert content writer specializing in SEO-optimized blog posts and articles that rank well and provide genuine value to readers.' },
      { role: 'user', content: prompt }
    ], Math.min(3000, Math.max(1000, this.maxContentLength * 2)));

    return response;
  }

  calculateSEOScore(content: string, keyword: string): number {
    const contentLower = content.toLowerCase();
    const keywordLower = keyword.toLowerCase();
    
    // Enhanced SEO scoring factors
    const wordCount = content.split(/\s+/).length;
    const keywordCount = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
    const hasTitle = content.includes('#');
    const hasSubheadings = content.includes('##');
    const keywordDensity = (keywordCount / wordCount) * 100;
    const hasIntroduction = content.toLowerCase().includes('introduction') || content.toLowerCase().includes('overview');
    const hasConclusion = content.toLowerCase().includes('conclusion') || content.toLowerCase().includes('summary');
    const sentenceCount = content.split(/[.!?]+/).length;
    const avgSentenceLength = wordCount / sentenceCount;
    
    let score = 50; // Base score
    
    // Word count scoring (optimal 1000-1500 words)
    if (wordCount >= 1000 && wordCount <= 1500) score += 20;
    else if (wordCount >= 800 && wordCount < 1000) score += 15;
    else if (wordCount >= 500 && wordCount < 800) score += 10;
    else if (wordCount < 300) score -= 10;
    
    // Keyword density scoring (optimal 1-2%)
    if (keywordDensity >= 1 && keywordDensity <= 2) score += 15;
    else if (keywordDensity >= 0.5 && keywordDensity < 1) score += 10;
    else if (keywordDensity > 3) score -= 10; // Keyword stuffing penalty
    else if (keywordDensity === 0) score -= 20;
    
    // Structure scoring
    if (hasTitle) score += 5;
    if (hasSubheadings) score += 10;
    if (hasIntroduction) score += 5;
    if (hasConclusion) score += 5;
    
    // Readability scoring
    if (avgSentenceLength >= 15 && avgSentenceLength <= 25) score += 5;
    
    return Math.min(100, Math.max(0, score));
  }

  // New advanced features
  async analyzeSentiment(content: string): Promise<string> {
    const prompt = `Analyze the sentiment and tone of this content: "${content.substring(0, 500)}..."
    
    Provide a brief analysis of:
    - Overall sentiment (positive/neutral/negative)
    - Tone (professional/casual/authoritative/friendly)
    - Emotional appeal level
    
    Keep response concise (2-3 sentences).`;
    
    const response = await this.makeRequest([
      { role: 'system', content: 'You are a content analysis expert specializing in sentiment and tone analysis.' },
      { role: 'user', content: prompt }
    ], 200);

    return response;
  }

  async suggestImprovements(content: string, keyword: string): Promise<string[]> {
    const seoScore = this.calculateSEOScore(content, keyword);
    const suggestions: string[] = [];
    
    const wordCount = content.split(/\s+/).length;
    const keywordCount = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    const keywordDensity = (keywordCount / wordCount) * 100;
    
    if (wordCount < 800) {
      suggestions.push('Consider expanding content to 800+ words for better SEO performance');
    }
    
    if (keywordDensity < 0.5) {
      suggestions.push(`Include the keyword "${keyword}" more naturally throughout the content`);
    } else if (keywordDensity > 3) {
      suggestions.push('Reduce keyword density to avoid over-optimization');
    }
    
    if (!content.includes('##')) {
      suggestions.push('Add more subheadings (H2) to improve content structure');
    }
    
    if (seoScore < 70) {
      suggestions.push('Consider adding more relevant examples and actionable advice');
    }
    
    return suggestions;
  }
}

export default AIService;
