import { MutationCtx, QueryCtx, action, internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { api, internal } from "./_generated/api";
import OpenAI from 'openai';
import { Id } from "./_generated/dataModel";

const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
});


export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export async function hasAccessToPaper(
    ctx: MutationCtx | QueryCtx, 
    paperId: Id<"papers">
) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
        return null;
    }

    const paper = await ctx.db.get(paperId);

    if (!paper) {
        return null;
    }

    if (paper.tokenIdentifier !== userId) {
        return null;
    }
    return { paper, userId };
}

export const hasAccessToPaperQuery = internalQuery({
    args: {
        paperId: v.id("papers"),
    },
    async handler(ctx, args) {
        return await hasAccessToPaper(ctx, args.paperId);
    }
});

export const getPapers = query({
    async handler(ctx) {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

        if (!userId) {
            return undefined;
        }
        return await ctx.db.query('papers')
            .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', userId))
            .collect();
    },
});

export const getPaper = query({
    args: {
        paperId: v.id('papers'),
    },
    async handler(ctx, args) {
        const accessObject = await hasAccessToPaper(ctx, args.paperId);
        if (!accessObject) {
            return null;
        }

        const paper= accessObject.paper;
        if (!paper) {
            throw new ConvexError('paper not found');
        }

        return paper;
    },
});

export async function embed(text: string) {
    const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text
    });

    return embedding.data[0].embedding;
}


export const createPaper = mutation({
    args: {
        title: v.string(),
        url: v.string(),
        published_date: v.string(),
        updated_date: v.string(),
        summary: v.string(),
        authors: v.array(v.string()),
        links: v.optional(v.array(v.string())),
        category: v.optional(v.string()),
        primary_category: v.optional(v.string()),
        comments: v.optional(v.string()),
        affiliations: v.optional(v.array(v.string())),
        journal_ref: v.optional(v.string()),
        doi: v.optional(v.string()),
        note: v.string(),
    },
    async handler(ctx, args) {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
        if (!userId) {
            throw new ConvexError('unauthorized');
        }
        const paperId = await ctx.db.insert('papers', {
            title: args.title,
            url: args.url,
            published_date: args.published_date,
            updated_date: args.updated_date,
            summary: args.summary,
            authors: args.authors,
            links: args.links,
            category: args.category,
            primary_category: args.primary_category,
            comments: args.comments,
            affiliations: args.affiliations,
            journal_ref: args.journal_ref,
            doi: args.doi,
            tokenIdentifier: userId,
            description: "",
            note: "",
        });

        await ctx.scheduler.runAfter(0, internal.papers.fillInDescription, {
            paperId,
            title: args.title,
            summary: args.summary,
        });
    },
});



export const fillInDescription = internalAction({
    args: {
        paperId: v.id("papers"),
        title: v.string(),
        summary: v.string(),
    },

    async handler(ctx, args) {

        const chatCompletion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `Here is a research paper with the title: ${args.title} and abstract: ${args.summary}`,
                },
                {
                    role: 'user',
                    content: `Please characterize the papers contents based on the summary in 5 words in a comma separated list. Example: "neural network architecture, efficient, attention mechanism, parallelizable, generalizes well"
                    Your Answer:`
                },
            ],
            model: 'gpt-3.5-turbo',
        });

        // Helper function to extract words and join them with commas
        function extractWordsAndJoin(text:string) {
            // Check if the text is comma-separated
            if (text.includes(',')) {
                return text.split(',').map(word => word.trim()).join(', ');
            }

            // Otherwise, assume the text is newline-separated with numbers
            const lines = text.split('\n');
            const words = lines.map(line => {
                const match = line.match(/^\d+\.\s*(.*)$/);
                return match ? match[1].trim() : '';
            }).filter(word => word !== '');

            return words.join(', ');
        }

        const rawDescription = chatCompletion.choices[0]?.message?.content ?? 'Could not figure out description';
        const description = extractWordsAndJoin(rawDescription);
        console.log('rawdescription', rawDescription)
        console.log('description', description)
        const embedding = await embed(args.title + ': ' + args.summary);

        await ctx.scheduler.runAfter(0, internal.papers.updatePaperDescription, {
            paperId: args.paperId,
            description: description,
            embedding
        });
    },
});


export const saveNote = action({
    args: {
        paperId: v.id("papers"),
        note: v.string(),
        title: v.string(),
        summary: v.string(),

    },
    async handler(ctx, args) {

        await ctx.runMutation(internal.papers.patchNote, {
            paperId: args.paperId,
            note: args.note,
        });

        await ctx.scheduler.runAfter(0, internal.papers.updatePaperEmbedding, {
            paperId: args.paperId,
            title: args.title,
            summary: args.summary,
            note: args.note,
        });
    }
});

export const patchNote = internalMutation({
    args: {
        paperId: v.id("papers"),
        note: v.string(),
    },
    async handler(ctx, args) {
        await ctx.db.patch(args.paperId, {
            note: args.note,
        });
    }
});

export const patchEmbedding = internalMutation({
    args: {
        paperId: v.id("papers"),
        embedding: v.array(v.float64()),
    },
    async handler(ctx, args) {
        await ctx.db.patch(args.paperId, {
            embedding: args.embedding,
        });
    }
});



export const updatePaperDescription = internalMutation({
    args: {
        paperId: v.id("papers"),
        description: v.string(),
        embedding: v.array(v.float64()),
    },
    async handler(ctx, args) {
        await ctx.db.patch(args.paperId, {
            description: args.description,
            embedding: args.embedding,
        });
    }
});

export const updatePaperEmbedding = internalAction({
    args: {
        paperId: v.id("papers"),
        title: v.string(),
        summary: v.string(),
        note: v.string(),
    },
    async handler(ctx, args) {

        const embedding = await embed(args.title + ': ' + args.summary + ' --- ' + args.note);
        await ctx.runMutation(internal.papers.patchEmbedding, {
            paperId: args.paperId,
            embedding,
        });
    }
});



export const removePaper = mutation({
    args: {
        paperId: v.id("papers"),
    },
    async handler(ctx, args) {
        const accessObject = await hasAccessToPaper(ctx, args.paperId);

        if (!accessObject) {
            throw new ConvexError('you do not have access to this paper');
        }
        await ctx.db.delete(args.paperId);
    }
});
