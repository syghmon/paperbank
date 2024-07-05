import { mutation, query } from "./_generated/server";
import {v} from "convex/values";


export const getPapers = query({
    async handler(ctx) {
        return await ctx.db.query('papers').collect()
    },
})


export const createPaper = mutation({
    args: {
        title: v.string(),
    },

    async handler(ctx, args) {
        await ctx.db.insert('papers', {
            title: args.title,
        })
    },

})
