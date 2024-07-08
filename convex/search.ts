import { v } from "convex/values";
import { action } from "./_generated/server";
import { embed } from "./notes";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const searchAction = action({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }

    const embedding = await embed(args.search);
    const noteResults = await ctx.vectorSearch("notes", "by_embedding", {
      vector: embedding,
      limit: 5,
      filter: (q) => q.eq("tokenIdentifier", userId),
    });

    const paperResults = await ctx.vectorSearch("papers", "by_embedding", {
        vector: embedding,
        limit: 5,
        filter: (q) => q.eq("tokenIdentifier", userId),
      });


    const records: ({type: 'notes'; score: number; record: Doc<"notes">} | {type: 'papers'; score: number; record: Doc<"papers">}) [] = []
    await Promise.all(
        noteResults
            .map(async (result) => {
        const note = await ctx.runQuery(api.notes.getNote, {
            noteId: result._id});
        if (!note) { return;}
        records.push({type: 'notes', score: result._score, record: note});
        
        return {...note, type: 'note'};
        })

    );

    await Promise.all(
        paperResults
            .map(async (result) => {
        const paper = await ctx.runQuery(api.papers.getPaper, {
            paperId: result._id});
        if (!paper) { return;}
        records.push({type: 'papers', score: result._score, record: paper});
        
        return {...paper, type: 'papers'};
        })

    );

    records.sort((a,b) => b.score - a.score);
    return records;
  },
});