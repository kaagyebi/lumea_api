import OpenAI from 'openai';

let openai = null;

const getOpenAIClient = () => {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required for skin analysis');
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
};

/**
 * Analyze skin image using OpenAI
 * @param {string} imageUrl - URL of the uploaded image
 * @returns {Object} tone, type, conditions
 */
export const analyzeSkinImage = async (imageUrl) => {
  try {
    console.log(`Analyzing image with OpenAI: ${imageUrl}`);
    
    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
      model: "gpt-4o", 
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze the attached image of a person's skin. Provide a detailed analysis as a JSON object. The object must include the following keys: "tone" (e.g., "Fair", "Olive"), "skinType" (e.g., "Oily", "Dry", "Combination"), "conditions" (an array of strings for visible issues like "Acne", "Redness"), "skinAge" (an estimated age of the skin as a number), "skinHealth" (a qualitative score like "Good", "Fair", "Needs Improvement"), "poreVisibility" (e.g., "Low", "Medium", "High"), "texture" (e.g., "Smooth", "Slightly Rough"), "oilLevel" (e.g., "Low", "Balanced", "High"), and "precautions" (an array of recommended precautions or care tips as strings).`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to analyze skin image.");
  }
};
