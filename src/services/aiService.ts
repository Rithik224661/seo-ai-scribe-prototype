
interface AIServiceConfig {
  apiKey: string;
}

class AIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(config: AIServiceConfig) {
    this.apiKey = config.apiKey;
  }

  private async makeRequest(messages: { role: string; content: string }[]) {
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
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async generateKeywords(seedKeyword: string): Promise<string[]> {
    const prompt = `Generate 5 SEO-focused keyword suggestions related to "${seedKeyword}". Focus on keywords that would be valuable for content marketing and have good search potential. Return only the keywords as a simple list, one per line, without numbers or bullets.`;
    
    const response = await this.makeRequest([
      { role: 'system', content: 'You are an SEO expert specializing in keyword research.' },
      { role: 'user', content: prompt }
    ]);

    return response.split('\n').filter((keyword: string) => keyword.trim()).slice(0, 5);
  }

  async generateTitles(keyword: string): Promise<string[]> {
    const prompt = `Create 3 SEO-optimized, engaging blog post titles for the keyword "${keyword}". The titles should be:
    - Between 50-60 characters for optimal SEO
    - Compelling and click-worthy
    - Professional tone
    - Include the main keyword naturally
    
    Return only the titles, one per line.`;
    
    const response = await this.makeRequest([
      { role: 'system', content: 'You are an expert content strategist and SEO copywriter.' },
      { role: 'user', content: prompt }
    ]);

    return response.split('\n').filter((title: string) => title.trim()).slice(0, 3);
  }

  async generateTopics(title: string, keyword: string): Promise<any[]> {
    const prompt = `Based on the title "${title}" and keyword "${keyword}", create 2 comprehensive content outlines. Each outline should include:
    - A clear topic approach
    - 6-8 main section headings
    - Brief description of what each section would cover
    
    Format as JSON with this structure:
    [
      {
        "title": "Topic Approach Name",
        "outline": ["Section 1", "Section 2", etc]
      }
    ]`;
    
    const response = await this.makeRequest([
      { role: 'system', content: 'You are a content strategist who creates detailed article outlines. Always respond with valid JSON.' },
      { role: 'user', content: prompt }
    ]);

    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback if JSON parsing fails
      return [
        {
          title: "Comprehensive Guide Approach",
          outline: [
            `Introduction to ${keyword}`,
            `Why ${keyword} matters in 2024`,
            `Key benefits and strategies`,
            `Best practices implementation`,
            `Common mistakes to avoid`,
            `Conclusion and next steps`
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
    - 800-1200 words
    - Natural keyword integration (aim for 1-2% keyword density)
    - Engaging introduction and conclusion
    - Use headers (##) for main sections
    - Include practical tips and actionable advice
    - Professional, informative tone
    - SEO-friendly structure`;
    
    const response = await this.makeRequest([
      { role: 'system', content: 'You are an expert content writer specializing in SEO-optimized blog posts and articles.' },
      { role: 'user', content: prompt }
    ]);

    return response;
  }

  calculateSEOScore(content: string, keyword: string): number {
    const contentLower = content.toLowerCase();
    const keywordLower = keyword.toLowerCase();
    
    // Basic SEO scoring factors
    const wordCount = content.split(/\s+/).length;
    const keywordCount = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
    const hasTitle = content.includes('#');
    const hasSubheadings = content.includes('##');
    const keywordDensity = (keywordCount / wordCount) * 100;
    
    let score = 60; // Base score
    
    // Word count scoring
    if (wordCount >= 800 && wordCount <= 1500) score += 15;
    else if (wordCount >= 500) score += 10;
    
    // Keyword density scoring
    if (keywordDensity >= 1 && keywordDensity <= 3) score += 15;
    else if (keywordDensity > 0) score += 5;
    
    // Structure scoring
    if (hasTitle) score += 5;
    if (hasSubheadings) score += 5;
    
    return Math.min(100, Math.max(0, score));
  }
}

export default AIService;
