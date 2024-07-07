import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";


export const getChatsForPaper = query({
    args: {
        paperId: v.id("papers"),
    },


    async handler(ctx, args) {

        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if (!userId) {
            return [];
        }

        return await ctx.db
        .query('chats')
        .withIndex('by_paperId_tokenIdentifier', (q) => 
            q.eq('paperId', args.paperId).eq('tokenIdentifier', userId))
        .collect();
    },
});
    

export const createChatRecord = internalMutation({
    args: {
        paperId: v.id("papers"),
        text: v.string(),
        isHuman: v.boolean(),
        tokenIdentifier: v.string(),
    },
    async handler(ctx, args) {
        await ctx.db.insert('chats',{
            paperId: args.paperId,
            text: args.text,
            isHuman: args.isHuman,
            tokenIdentifier: args.tokenIdentifier,
        })
    },
});