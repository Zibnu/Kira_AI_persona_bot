const { GoogleGenAI, Models } = require("@google/genai");
require("dotenv").config();

const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const interaction = async() => {
    const data = await gemini.interactions.create({
        model: "gemini-3.1-flash-lite",
        input: "Who is Prabowo in indonesia",
    });

    return data.output_text;
}

console.log(interaction())