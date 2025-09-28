import { GoogleGenAI, Type } from "@google/genai";
import type { WebsiteResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchWebsiteResults = async (query: string): Promise<WebsiteResult[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a research assistant for a YouTube content creator. Your task is to find 10 highly relevant web resources for the topic: "${query}". For each resource, provide the full URL, a concise title, and a 2-3 sentence summary explaining its relevance to the topic. Focus on providing diverse and useful sources from across the web, without any language or content restrictions.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            recipeName: {
                                type: Type.STRING,
                                description: 'The concise title of the website or article.',
                            },
                            url: {
                                type: Type.STRING,
                                description: 'The full URL of the resource.',
                            },
                            summary: {
                                type: Type.STRING,
                                description: 'A 2-3 sentence summary of its relevance.',
                            },
                        },
                        required: ["recipeName", "url", "summary"],
                    },
                },
            },
        });
        
        const jsonStr = response.text.trim();
        const results = JSON.parse(jsonStr);
        // The schema uses recipeName, let's map it to a more generic name if needed, but it works fine.
        return results as WebsiteResult[];
    } catch (error) {
        console.error("Error fetching website results:", error);
        throw new Error("Failed to fetch website data from Gemini API.");
    }
};

export const generateContentScript = async (query: string, sources: WebsiteResult[]): Promise<string> => {
    try {
        const sourceSummaries = sources.map((s, i) => `Sumber ${i + 1} (${s.recipeName}):\n${s.summary}`).join('\n\n');

        const prompt = `
Anda adalah penulis skrip YouTube ahli. Tugas Anda adalah mensintesis informasi dari ringkasan sumber web berikut menjadi satu narasi yang koheren dan mendetail untuk video YouTube. Topiknya adalah: "${query}".

Sumber Informasi:
${sourceSummaries}

Instruksi:
1. Tulis dalam Bahasa Indonesia.
2. Hasilnya harus berupa satu paragraf panjang yang mengalir, tanpa menggunakan markdown atau pemformatan khusus.
3. Jelaskan secara frontal dan to-the-point: apa yang terjadi, siapa karakter utamanya, dan di mana latar/arc ceritanya.
4. Berikan detail yang kaya berdasarkan sumber, tetapi hindari basa-basi atau pengantar yang tidak perlu. Langsung masuk ke inti pembahasan.
5. Pastikan panjang total teks antara 2900 dan 5000 karakter. Jika informasinya kurang, elaborasikan detail yang ada untuk mencapai panjang minimum.
6. Jangan sebutkan "berdasarkan sumber" atau "artikel menyatakan". Cukup sajikan informasinya seolah-olah Anda adalah ahlinya.
7. Pastikan outputnya adalah teks murni, tanpa pembungkus JSON atau markdown.

Mulai skrip Anda sekarang.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating content script:", error);
        throw new Error("Failed to generate content script from Gemini API.");
    }
};
