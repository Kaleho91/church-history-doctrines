import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import sourcesData from '@/content/sources.json';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper: Simple keyword-based retrieval (MVP without embeddings)
function retrieveRelevantSources(query: string, topK: number = 5) {
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(/\s+/).filter(w => w.length > 3);

    // Score each source by keyword overlap
    const scored = sourcesData
        .filter((source: any) => source.excerpt) // Only sources with excerpts
        .map((source: any) => {
            const text = `${source.notes || ''} ${source.excerpt || ''} ${source.significance || ''}`.toLowerCase();
            let score = 0;

            for (const keyword of keywords) {
                if (text.includes(keyword)) {
                    score += 1;
                }
            }

            // Boost for primary sources
            if (source.primary_or_secondary === 'Primary') {
                score += 0.5;
            }

            return { source, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);

    return scored.map(item => item.source);
}

// Helper: Parse citation from source
function parseAuthorAndWork(citation: string): { author: string; work: string } {
    // Try to extract author and work from Chicago citation
    const match = citation.match(/^([^.]+)\.\s*([^.]+)/);
    if (match) {
        return { author: match[1].trim(), work: match[2].trim() };
    }
    return { author: 'Unknown', work: citation.slice(0, 50) };
}

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();

        if (!query || typeof query !== 'string') {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        // Retrieve relevant sources
        const relevantSources = retrieveRelevantSources(query, 5);

        if (relevantSources.length === 0) {
            return NextResponse.json({
                answer: "I couldn't find any sources in my library that directly address this question. Try rephrasing or asking about baptism, the Trinity, or the Eucharist.",
                citations: [],
            });
        }

        // Build context for LLM
        const sourceContext = relevantSources.map((source: any, index: number) => {
            const { author, work } = parseAuthorAndWork(source.citation_chicago);
            return `[${index + 1}] ${author}, "${work}":\n"${source.excerpt}"\n${source.significance ? `Significance: ${source.significance}` : ''}`;
        }).join('\n\n');

        // System prompt for grounded generation
        const systemPrompt = `You are a historian of Early Christianity specializing in patristics and church history. 
The user has asked a question about what the early church believed or taught.

Below are excerpts from primary sources (Church Fathers, Councils, Confessions). 
Answer the question ONLY using the provided sources. 
- If the sources directly address the topic, synthesize them into a clear, scholarly answer.
- Always cite sources using [1], [2], etc.
- If the sources don't fully address the question, acknowledge the limits.
- Write in a warm, accessible scholarly tone.
- Keep your answer focused and around 2-3 paragraphs.`;

        const userPrompt = `Question: ${query}

Sources:
${sourceContext}

Please answer the question based on these sources.`;

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 800,
        });

        const answer = completion.choices[0]?.message?.content || 'Unable to generate response.';

        // Format citations for response
        const citations = relevantSources.map((source: any) => {
            const { author, work } = parseAuthorAndWork(source.citation_chicago);
            return {
                id: source.id,
                author,
                work,
                excerpt: source.excerpt?.slice(0, 300) + (source.excerpt?.length > 300 ? '...' : ''),
                url: source.url,
            };
        });

        return NextResponse.json({
            answer,
            citations,
        });

    } catch (error) {
        console.error('Ask API error:', error);
        return NextResponse.json(
            { error: 'Failed to process question' },
            { status: 500 }
        );
    }
}
