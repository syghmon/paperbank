import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  papers: defineTable({
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
    tokenIdentifier: v.string(),
    description: v.optional(v.string()),
    embedding: v.optional(v.array(v.float64())),
    note: v.string(),
  })
  .index('by_tokenIdentifier', ['tokenIdentifier'])
  .vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536,
    filterFields: ["tokenIdentifier"],
  }),
});
