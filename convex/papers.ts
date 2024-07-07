import { MutationCtx, QueryCtx, action, internalQuery, mutation, query } from "./_generated/server";
import {ConvexError, v} from "convex/values";
import {api, internal} from "./_generated/api";
import OpenAI from 'openai';
import { Id } from "./_generated/dataModel";
import { access } from "fs";

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


export const hasAccessToDocumentQuery = internalQuery({
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
            return [];
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
        await ctx.db.insert('papers', {
            title: args.title,
            tokenIdentifier: userId,
            fileId: args.fileId,
        })
    },

})


export const askQuestion = action({
    args: {
        question: v.string(),
        paperId: v.id("papers"),
    },

    async handler(ctx, args) {

        const accessObject = await ctx.runQuery(internal.papers.hasAccessToDocumentQuery, {paperId: args.paperId})
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