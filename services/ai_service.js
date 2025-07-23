import OpenAI from 'openai';

let openai = null;

const getOpenAIClient = () => {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
};

const REQUIRED_ANALYSIS_KEYS = {
  tone: "",
  skinType: "",
  conditions: [],
  skinAge: 0,
  skinHealth: "",
  poreVisibility: "",
  texture: "",
  oilLevel: "",
  precautions: [],
  overallScore: 0,
  skinSummary: "",
  quantitativeAnalysis: ""
};

function fillMissingAnalysisFields(analysis) {
  const result = { ...analysis };
  for (const key in REQUIRED_ANALYSIS_KEYS) {
    if (!(key in result)) {
      result[key] = REQUIRED_ANALYSIS_KEYS[key];
    }
  }
  return result;
}

/**
 * Analyze skin image
 * @param {string} imageUrl - URL of the uploaded image
 * @returns {Object} tone, type, conditions, overallScore, skinSummary, quantitativeAnalysis
 */
export const analyzeSkinImage = async (imageUrl) => {
  try {
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
              text: `Analyze the attached image of a person's skin. Provide a detailed analysis as a JSON object. You MUST include ALL of the following keys in the JSON: "tone" (e.g., "Fair", "Olive"), "skinType" (e.g., "Oily", "Dry", "Combination"), "conditions" (an array of strings for visible issues like "Acne", "Redness"), "skinAge" (an estimated age of the skin as a number), "skinHealth" (a quantitative score from 0-100 representing the overall skin health), "poreVisibility"), "poreVisibility" (e.g., "Low", "Medium", "High"), "texture" (e.g., "Smooth", "Slightly Rough"), "oilLevel" (e.g., "Low", "Balanced", "High"), "precautions" (an array of recommended precautions or care tips as strings), "overallScore" (a number from 0-100 representing the overall skin health score), "skinSummary" (a short summary of the skin's current state), and "quantitativeAnalysis" (a paragraph with quantitative details such as hydration %, elasticity %, etc.). Do not omit any of these keys, even if you have to provide a default or estimated value.`
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

    const aiResult = JSON.parse(response.choices[0].message.content);
    // Fallback: ensure all required analysis fields are present
    const analysis = fillMissingAnalysisFields(aiResult);
    return analysis;
  } catch (err) {
    console.error("Error calling OpenAI API:", err);
    throw new Error("Failed to analyze skin image.");
  }
};
