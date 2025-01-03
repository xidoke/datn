export const aiService = {
  async generateDescription(description: string): Promise<string> {
    if (!description) {
      throw new Error('Description is required');
    }

    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate description');
      }

      const data = await response.json();
      return data.generatedDescription;
    } catch (error) {
      console.error('Error generating description:', error);
      throw error;
    }
  },
};

