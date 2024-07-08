import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  papers: defineTable({
    title: v.string() ,
    description: v.optional(v.string()),
    tokenIdentifier: v.string(),
    fileId: v.id("_storage"),
    embedding: v.optional(v.array(v.float64())),


  }).index('by_tokenIdentifier', ['tokenIdentifier']).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536,
    filterFields: ["tokenIdentifier"],
  }),


  notes: defineTable({
    text: v.string(),

    embedding: v.optional(v.array(v.float64())),
    tokenIdentifier: v.string(),
  }).index('by_tokenIdentifier', ['tokenIdentifier'])
  .vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536,
    filterFields: ["tokenIdentifier"],
  }),

  
  chats: defineTable({
    paperId: v.id("papers") ,
    tokenIdentifier: v.string(),
    isHuman: v.boolean(),
    text: v.string(),
  }).index('by_paperId_tokenIdentifier', ["paperId",'tokenIdentifier'])
});