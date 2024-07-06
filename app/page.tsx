'use client'

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { PaperCard } from "./paper-card";
import CreatePaperButton from "./add-paper-button";

export default function Home() {

  const papers = useQuery(api.papers.getPapers)

  return (
    <main className="p-24 space-y-8">  
    <div className = "flex justify-between items-center">
    <h1 className = "text-4xl font-bold">My Papers</h1>

    <CreatePaperButton />
    </div>
      <div className="grid grid-cols-4 gap-4">
      {papers?.map((pap) => <PaperCard paper={pap}/>)}
      </div>

    </main>
  );
}
