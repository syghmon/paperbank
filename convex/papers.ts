import { mutation, query } from "./_generated/server";
import {ConvexError, v} from "convex/values";


export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
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
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if (!userId) {
            return null;
        }
        const paper = await ctx.db.get(args.paperId)
        
        if(!paper) {
            return null;
        }

        if (paper.tokenIdentifier !== userId) {
            return null;
        }

        return {...paper, 
            paperUrl: await ctx.storage.getUrl(paper.fileId)}
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
