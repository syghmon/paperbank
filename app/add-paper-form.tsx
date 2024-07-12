'use client';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoadingButton } from "@/components/loading-button";
import { embed } from "@/convex/notes";
import { Id } from "@/convex/_generated/dataModel";

const formSchema = z.object({
  searchQuery: z.string().min(2).max(50),
  selectedPaper: z.object({
    title: z.string(),
    id: z.string(),
  }).optional(),
});

interface ArxivResult {
  id: string | null;
  title: string | null;
  summary: string | null;
}

interface RankedResult {
  result: ArxivResult;
  similarity: number;
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

async function fetchArxivResults(query: string): Promise<ArxivResult[]> {
  const response = await fetch(
    `https://export.arxiv.org/api/query?search_query=all:${query}&sortBy=relevance&max_results=10`
  );
  const text = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");

  const entries = Array.from(xmlDoc.getElementsByTagName("entry")).map(
    (entry) => ({
      id: entry.getElementsByTagName("id")[0]?.textContent || null,
      title: entry.getElementsByTagName("title")[0]?.textContent || null,
      summary: entry.getElementsByTagName("summary")[0]?.textContent || null,
    })
  );

  return entries;
}

async function rankResults(query: string, results: ArxivResult[]): Promise<RankedResult[]> {
  const queryEmbedding = await embed(query);
  const rankedResults = await Promise.all(
    results.map(async (result) => {
      const text = `${result.title} ${result.summary}`;
      const resultEmbedding = await embed(text);
      const similarity = cosineSimilarity(queryEmbedding, resultEmbedding);
      return { result, similarity };
    })
  );
  return rankedResults.sort((a, b) => b.similarity - a.similarity);
}

async function searchAndRankArxiv(query: string): Promise<RankedResult[]> {
  const arxivResults = await fetchArxivResults(query);
  const rankedResults = await rankResults(query, arxivResults);
  return rankedResults;
}

export default function AddPaperButton({ onAdd }: { onAdd: () => void }) {
  const createPaper = useMutation(api.papers.createPaper);
  const [searchResults, setSearchResults] = useState<RankedResult[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<RankedResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedPaper) {
      await createPaper({
        title: selectedPaper.result.title!,
      });
      onAdd();
    }
  }

  async function onSearch(query: string) {
    const results = await searchAndRankArxiv(query);
    setSearchResults(results);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="searchQuery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search for a Paper</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter paper title or keywords"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    onSearch(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {searchResults.length > 0 && (
          <FormItem>
            <FormLabel>Select a Paper</FormLabel>
            <ul>
              {searchResults.map((paper, index) => (
                <li key={index}>
                  <input
                    type="radio"
                    id={paper.result.id!}
                    name="selectedPaper"
                    value={paper.result.id!}
                    onChange={() => setSelectedPaper(paper)}
                  />
                  <label htmlFor={paper.result.id!}>{paper.result.title}</label>
                </li>
              ))}
            </ul>
          </FormItem>
        )}

        <LoadingButton isLoading={form.formState.isSubmitting} loadingText="Adding...">
          Add
        </LoadingButton>
      </form>
    </Form>
  );
}
