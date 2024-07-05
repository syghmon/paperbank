import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  papers: defineTable({ title: v.string() }),
});