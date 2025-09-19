// Simple RFP scraper for real data
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedRFP {
  title: string;
  description: string;
  url: string;
  deadline?: string;
  budget?: string;
  agency?: string;
}

export class RFPScraper {
  
  async scrapeRFPFromURL(url: string): Promise<ScrapedRFP | null> {
    try {
      console.log(`🔍 Scraping RFP from: ${url}`);
      
      // Use a CORS proxy for demo purposes
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      
      const response = await axios.get(proxyUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Auto-RFP-Bot/1.0)'
        }
      });
      
      if (response.data && response.data.contents) {
        const $ = cheerio.load(response.data.contents);
        
        // Generic extraction - works for most RFP sites
        const title = this.extractTitle($);
        const description = this.extractDescription($);
        const deadline = this.extractDeadline($);
        const budget = this.extractBudget($);
        const agency = this.extractAgency($);
        
        const scrapedRFP: ScrapedRFP = {
          title: title || 'Extracted RFP Opportunity',
          description: description || 'RFP opportunity extracted from provided URL',
          url: url,
          deadline,
          budget,
          agency
        };
        
        console.log('✅ Successfully scraped RFP data:', scrapedRFP.title);
        return scrapedRFP;
      }
      
      return null;
    } catch (error) {
      console.warn('⚠️ RFP scraping failed:', error instanceof Error ? error.message : String(error));
      return null;
    }
  }
  
  private extractTitle($: cheerio.CheerioAPI): string {
    // Try common title selectors
    const selectors = [
      'h1',
      '.title',
      '#title',
      '[class*="title"]',
      'title',
      '.opportunity-title',
      '.rfp-title'
    ];
    
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        return element.text().trim();
      }
    }
    
    return '';
  }
  
  private extractDescription($: cheerio.CheerioAPI): string {
    // Try common description selectors
    const selectors = [
      '.description',
      '#description',
      '.summary',
      '.overview',
      '[class*="description"]',
      'meta[name="description"]'
    ];
    
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        const text = selector.includes('meta') 
          ? element.attr('content') 
          : element.text().trim();
        if (text && text.length > 50) {
          return text;
        }
      }
    }
    
    // Fallback: get first substantial paragraph
    const paragraphs = $('p');
    for (let i = 0; i < paragraphs.length; i++) {
      const text = $(paragraphs[i]).text().trim();
      if (text.length > 100) {
        return text;
      }
    }
    
    return '';
  }
  
  private extractDeadline($: cheerio.CheerioAPI): string | undefined {
    const selectors = [
      '[class*="deadline"]',
      '[class*="due"]',
      '[class*="date"]',
      '.deadline',
      '#deadline'
    ];
    
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        return element.text().trim();
      }
    }
    
    return undefined;
  }
  
  private extractBudget($: cheerio.CheerioAPI): string | undefined {
    const selectors = [
      '[class*="budget"]',
      '[class*="value"]',
      '[class*="amount"]',
      '.budget',
      '#budget'
    ];
    
    for (const selector of selectors) {
      const element = $(selector).first();
      const text = element.text().trim();
      if (text && (text.includes('$') || text.includes('USD') || text.includes('million'))) {
        return text;
      }
    }
    
    return undefined;
  }
  
  private extractAgency($: cheerio.CheerioAPI): string | undefined {
    const selectors = [
      '[class*="agency"]',
      '[class*="organization"]',
      '[class*="department"]',
      '.agency',
      '#agency'
    ];
    
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        return element.text().trim();
      }
    }
    
    return undefined;
  }
}
