import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with your API key
const genAI = new GoogleGenerativeAI('AIzaSyCIYjygDygvsk6zB9H7b5oasqFvNy1fBhg');

export async function askMathematician(question, imageData = null) {
    try {
        // Use gemini-1.5-pro for both text and vision tasks
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        let prompt;
        if (imageData) {
            // For image analysis, we need to create a message with both text and image parts
            const parts = [];
            
            // Add the text prompt
            const textPrompt = question.trim() 
                ? `Please analyze this mathematical problem image and ${question}` 
                : "Please analyze this mathematical problem image and provide a detailed solution with step-by-step explanations.";
            parts.push({ text: textPrompt });

            // Add the image
            // Remove the data:image/[type];base64, prefix from the base64 string
            const base64Image = imageData.split(',')[1];
            parts.push({
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg"
                }
            });

            const result = await model.generateContent(parts);
            const response = await result.response;
            return response.text();
        } else {
            // Text-only query
            prompt = `As a brilliant mathematician, please solve this problem with clear step-by-step explanations: ${question}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
    } catch (error) {
        console.error('API Error Details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        throw new Error(`Error processing mathematical question: ${error.message}`);
    }
}