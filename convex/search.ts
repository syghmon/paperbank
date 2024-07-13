import { v } from "convex/values";
import { action } from "./_generated/server";
import { embed } from "./papers";
import { api } from "../convex/_generated/api";
import { Doc } from "./_generated/dataModel";

type Paper = Doc<'papers'>;

export const searchAction = action({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args): Promise<{ paper: Paper; score: number }[] | null> => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }

    const embedding = await embed(args.search);

    const paperResults = await ctx.vectorSearch("papers", "by_embedding", {
      vector: embedding,
      limit: 5,
      filter: (q) => q.eq("tokenIdentifier", userId),
    });

    const papers: { paper: Paper; score: number }[] = await Promise.all(
      paperResults.map(async (result) => {
        const paper = await ctx.runQuery(api.papers.getPaper, { paperId: result._id });
        return {
          paper: paper as Paper,
          score: result._score,
        };
      })
    );

    return papers;
  },
});
