
export function estimateGptTokens(text: string | string[]): number {
    // From https://platform.openai.com/tokenizer
    //  A helpful rule of thumb is that one token generally 
    //  corresponds to ~4 characters of text for common English text. 
    //  This translates to roughly ¾ of a word (so 100 tokens ~= 75 words).
    // We will estimate by finding the value in between these two methods

    if (Array.isArray(text)) {
        text = text.join(' ');
    }

    const charTokens = text.length / 4;
    const wordTokens = text.split(' ').filter((n) => n != '').length * (1 + (1 / 3));

    return Math.floor((charTokens + wordTokens) / 2);
}