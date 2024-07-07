import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  papers: defineTable({
    title: v.string() ,
    tokenIdentifier: v.string(),
    fileId: v.id("_storage"),

  }).index('by_tokenIdentifier', ['tokenIdentifier']),
  
  chats: defineTable({
    paperId: v.id("papers") ,
    tokenIdentifier: v.string(),
    isHuman: v.boolean(),
    text: v.string(),
  }).index('by_paperId_tokenIdentifier', ["paperId",'tokenIdentifier'])
});