/**
 * AI Service for Ateker Music
 * 
 * This service provides AI-powered features for artists:
 * - Biography generation from keywords
 * - Content suggestions
 * - Profile enhancement recommendations
 * 
 * Currently uses Hugging Face Inference API (free tier)
 * Can be upgraded to premium APIs in the future
 */

// Hugging Face API configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models';
const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';

// Model endpoints
const MODELS = {
  textGeneration: 'mistralai/Mistral-7B-Instruct-v0.2',
  // Future: Image enhancement model
  imageEnhancement: 'stabilityai/stable-diffusion-xl-refiner-1.0',
};

/**
 * Generate artist biography from keywords
 * @param keywords - Artist keywords or brief description
 * @param artistName - Name of the artist
 * @param genre - Music genre
 * @returns Generated biography
 */
export async function generateBiography(
  keywords: string,
  artistName: string,
  genre?: string
): Promise<string> {
  try {
    const prompt = `Write a professional artist biography for ${artistName}, a ${genre || 'music'} artist from Eastern Uganda. 
    
Key points: ${keywords}

Write a compelling 2-3 paragraph biography that highlights their musical journey, style, and achievements. Make it engaging and professional.

Biography:`;

    const response = await fetch(`${HF_API_URL}/${MODELS.textGeneration}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate biography');
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.trim();
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('AI Biography Generation Error:', error);
    
    // Fallback: Return a template biography
    return generateFallbackBiography(artistName, keywords, genre);
  }
}

/**
 * Fallback biography generator (when AI is unavailable)
 */
function generateFallbackBiography(
  artistName: string,
  keywords: string,
  genre?: string
): string {
  return `${artistName} is a talented ${genre || 'music'} artist from Eastern Uganda. ${keywords}. Known for their unique style and authentic sound, ${artistName} continues to captivate audiences with their music. Their work reflects the rich cultural heritage of the region while embracing contemporary musical elements.`;
}

/**
 * Generate song description suggestions
 * @param songTitle - Title of the song
 * @param genre - Song genre
 * @param keywords - Brief keywords about the song
 * @returns Suggested description
 */
export async function generateSongDescription(
  songTitle: string,
  genre: string,
  keywords?: string
): Promise<string> {
  try {
    const prompt = `Write a compelling description for a song titled "${songTitle}" in the ${genre} genre. ${keywords ? `Additional context: ${keywords}` : ''}

Write 2-3 sentences that would engage listeners and describe the song's mood, theme, or style.

Description:`;

    const response = await fetch(`${HF_API_URL}/${MODELS.textGeneration}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate description');
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.trim();
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('AI Description Generation Error:', error);
    return `${songTitle} is a ${genre} track that showcases authentic Eastern Ugandan musical talent.`;
  }
}

/**
 * Get content suggestions for artists
 * @param artistProfile - Artist's profile information
 * @returns Array of content suggestions
 */
export function getContentSuggestions(artistProfile: {
  genre?: string;
  language?: string;
  district?: string;
}): string[] {
  const suggestions: string[] = [];

  // Genre-based suggestions
  if (artistProfile.genre) {
    suggestions.push(`Create more ${artistProfile.genre} tracks to build your signature sound`);
    suggestions.push(`Collaborate with other ${artistProfile.genre} artists in your region`);
  }

  // Language-based suggestions
  if (artistProfile.language) {
    suggestions.push(`Consider recording in ${artistProfile.language} to connect with local audiences`);
  }

  // Location-based suggestions
  if (artistProfile.district) {
    suggestions.push(`Highlight your ${artistProfile.district} roots in your music and biography`);
    suggestions.push(`Connect with fans and fellow artists from ${artistProfile.district}`);
  }

  // General suggestions
  suggestions.push('Upload high-quality cover art to make your songs stand out');
  suggestions.push('Add detailed lyrics to help fans connect with your music');
  suggestions.push('Share your songs on social media to grow your audience');
  suggestions.push('Engage with your listeners by responding to feedback');

  return suggestions;
}

/**
 * Check if AI features are available
 * @returns Boolean indicating if AI API key is configured
 */
export function isAIAvailable(): boolean {
  return HF_API_KEY.length > 0;
}

/**
 * Get AI feature status message
 * @returns Status message for users
 */
export function getAIStatusMessage(): string {
  if (isAIAvailable()) {
    return 'AI features are active and ready to help you!';
  }
  return 'AI features are currently in setup mode. Basic templates will be used.';
}

// Note: Profile picture enhancement will be added in future updates
// This requires image processing capabilities and may use:
// - Hugging Face image models
// - Cloudinary AI
// - Remove.bg API
// - Or similar services

/**
 * Future: Profile picture enhancement
 * This is a placeholder for future implementation
 */
export async function enhanceProfilePicture(imageFile: File): Promise<Blob> {
  // TODO: Implement with image enhancement API
  // For now, return the original file
  console.log('Profile picture enhancement coming soon!');
  return imageFile;
}

/**
 * Get AI usage guidelines
 */
export const AI_GUIDELINES = {
  biography: {
    title: 'AI Biography Generator',
    description: 'Provide keywords about yourself, and AI will create a professional biography.',
    tips: [
      'Include your musical style and influences',
      'Mention your achievements or notable performances',
      'Add personal touches that make you unique',
      'Keep keywords concise but descriptive',
    ],
  },
  profilePicture: {
    title: 'Profile Picture Enhancement (Coming Soon)',
    description: 'AI-powered tools to enhance and optimize your profile pictures.',
    tips: [
      'Use well-lit, high-quality photos',
      'Face should be clearly visible',
      'Professional or artistic presentation recommended',
      'Square format works best',
    ],
  },
  restrictions: [
    'AI cannot be used for audio manipulation or song creation',
    'All music must be original work by the artist',
    'AI is for profile enhancement and content writing only',
    'Generated content should be reviewed and personalized',
  ],
};
