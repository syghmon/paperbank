'use client';

import { useEffect, useState } from "react";
import { SearchForm } from "./search-form";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Protect, RedirectToSignIn } from "@clerk/nextjs";
import { useUser } from '@clerk/clerk-react';

function SearchResult({
  url,
  score,
  title,
  summary,
}: {
  url: string;
  score: number;
  title: string;
  summary: string;
}) {
  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <li className="space-y-4 dark:hover:bg-slate-700 dark:bg-slate-800 bg-slate-200 hover:bg-slate-300 rounded p-4 whitespace-pre-line">
        <div className="flex justify-between gap-2 text-xl items-center">
          <div className="flex gap-2 items-center">
            {title}
          </div>
          <div className="text-sm">Score: {score.toFixed(2)}</div>
        </div>
        <div>{summary.substring(0, 200) + "..."}</div>
      </li>
    </Link>
  );
}

export default function SearchPage() {
  const { isSignedIn } = useUser();
  const [results, setResults] = useState<typeof api.search.searchAction._returnType>(null);

  useEffect(() => {
    const storedResults = localStorage.getItem("searchResults");
    if (!storedResults) return;
    setResults(JSON.parse(storedResults));
  }, []);

  return (
    <Protect 
      condition={() => isSignedIn || false} // Ensure the function always returns a boolean
      fallback={<RedirectToSignIn />}
    >
      <main className="w-full space-y-8 pb-44">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Search</h1>
        </div>

        <SearchForm
          setResults={(searchResults) => {
            setResults(searchResults);
            localStorage.setItem("searchResults", JSON.stringify(searchResults));
          }}
        />

        <ul className="flex flex-col gap-4">
          {results?.map((result) => {
            const paper = result?.paper;
            const url = paper?.url;
            const title = paper?.title;
            const summary = paper?.summary;

            if (!paper || !url || !title || !summary) return null;

            return (
              <SearchResult
                key={paper._id}
                url={url}
                score={result.score}
                title={title}
                summary={summary}
              />
            );
          })}
        </ul>
      </main>
    </Protect>
  );
}
