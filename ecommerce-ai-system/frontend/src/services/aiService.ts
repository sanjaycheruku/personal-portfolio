import { pipeline, env } from '@xenova/transformers';

// Skip local check, download from the web
env.allowLocalModels = false;

let extractor: any = null;

export const initAI = async () => {
    if (!extractor) {
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return extractor;
};

export const getEmbedding = async (text: string) => {
    const model = await initAI();
    const output = await model(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
};

export const cosineSimilarity = (vecA: number[], vecB: number[]) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};
