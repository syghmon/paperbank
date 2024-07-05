import { mutation, query } from "./_generated/server";
import {ConvexError, v} from "convex/values";


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


export const createPaper = mutation({
    args: {
        title: v.string(),
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
        })
    },

})
