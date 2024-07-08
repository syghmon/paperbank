import { MutationCtx, QueryCtx, action, internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import {ConvexError, v} from "convex/values";
import {api, internal} from "./_generated/api";
import OpenAI from 'openai';
import { Id } from "./_generated/dataModel";
import { access } from "fs";
import { embed } from "./notes";

const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
});


export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  });


  export async function hasAccessToPaper(
    ctx: MutationCtx | QueryCtx, 
    paperId: Id<"papers">
){
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

    if(!userId) {

        return null;
    }

    const paper = await ctx.db.get(paperId)

    if(!paper) {
        return null;
    }

    if (paper.tokenIdentifier !== userId) {
        return null;
    }
    return {paper, userId};
}


export const hasAccessToPaperQuery = internalQuery({
    args: {
        paperId: v.id("papers"),
    },
    async handler(ctx, args) {
        return await hasAccessToPaper(ctx, args.paperId)
    }
});

export const getPapers = query({
    async handler(ctx) {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if (!userId) {
            return undefined;
        }
        return await ctx.db.query('papers')
        .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier',
            userId
        )).collect()
    },
})



export const getPaper = query({
    args: {
        paperId: v.id('papers'),
    },
    async handler(ctx,args) {

        const accessObject = await hasAccessToPaper(ctx, args.paperId)
    
        if(!accessObject) {
            return null;
        }

        return {...accessObject.paper, 
            paperUrl: await ctx.storage.getUrl(accessObject.paper.fileId)}
    },
})


export const createPaper = mutation({
    args: {
        title: v.string(),
        fileId: v.id("_storage"),
    },

    async handler(ctx, args) {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier
        console.log('userId', userId)

        if (!userId) {
            throw new ConvexError('unauthorized')
        }
        const paperId = await ctx.db.insert('papers', {
            title: args.title,
            tokenIdentifier: userId,
            fileId: args.fileId,
            description: "",
        })

        await ctx.scheduler.runAfter(0, internal.papers.fillInDescription, {
            fileId: args.fileId,
            paperId,
        }
        )
    },

})




export const askQuestion = action({
    args: {
        question: v.string(),
        paperId: v.id("papers"),
    },

    async handler(ctx, args) {

        const accessObject = await ctx.runQuery(internal.papers.hasAccessToPaperQuery, {paperId: args.paperId})
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if (!accessObject) {
            throw new ConvexError('you do not have access to this paper')
        }

        const file = await ctx.storage.get(accessObject.paper.fileId);

        if (!file) {
            throw new ConvexError('file not found')
        }

        const text = await file.text()

        const chatCompletion: OpenAI.Chat.Completions.ChatCompletion = await openai.chat.completions.create({
            messages: [
                {
                role: 'system', 
                content: `Here is a research paper: ${text}`,
                 },
                 { 
                role: 'user',
                content: `Please help answer the following question: ${args.question}`},
            ],
            model: 'gpt-3.5-turbo',
        });

        await ctx.runMutation(internal.chats.createChatRecord, {
            paperId: args.paperId,
            text: args.question,
            isHuman: true,
            tokenIdentifier: accessObject.userId,
        });

        const response = chatCompletion.choices[0].message.content ?? 'Could not generate response';

        await ctx.runMutation(internal.chats.createChatRecord, {
            paperId: args.paperId,
            text: response,
            isHuman: false,
            tokenIdentifier: accessObject.userId,
        });
        
        return response;
    },
})


export const fillInDescription = internalAction({
    args: {
        fileId: v.id("_storage"),
        paperId: v.id("papers"),
    },

    async handler(ctx, args) {
        const file = await ctx.storage.get(args.fileId);

        if (!file) {
            throw new ConvexError('file not found')
        }

        const text = await file.text()

        const chatCompletion: OpenAI.Chat.Completions.ChatCompletion = await openai.chat.completions.create({
            messages: [
                {
                role: 'system', 
                content: `Here is a research paper: ${text}`,
                 },
                 { 
                role: 'user',
                content: `Please generate a one sentence description for this document.`},
            ],
            model: 'gpt-3.5-turbo',
        });

        const description = chatCompletion.choices[0].message.content ?? 'Could not figure out description';

        const embedding = await embed(description);

        await ctx.runMutation(internal.papers.updatePaperDescription, {
            paperId: args.paperId,
            description: description,
            embedding
        });


    },
})

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
        })
    }
})


export const removePaper = mutation({
    args: {
        paperId: v.id("papers"),
    },

    async handler(ctx, args) {
        const accessObject = await hasAccessToPaper(ctx, args.paperId)

        if (!accessObject) {
            throw new ConvexError('you do not have access to this paper')
        }
          
        await ctx.storage.delete(accessObject.paper.fileId)
        await ctx.db.delete(args.paperId)
    }
})