'use client'

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { PaperCard } from "./paper-card";
import CreatePaperButton from "./add-paper-button";
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card";
import Image from 'next/image';

export default function Home() {

  const papers = useQuery(api.papers.getPapers)

  return (
    <main className="space-y-8">  
    <div className = "flex justify-between items-center">
    <h1 className = "text-4xl font-bold">My Papers</h1>

    <CreatePaperButton />
    </div>

      {!papers && (<div className="grid grid-cols-4 gap-4">
        {new Array(8).fill("").map((_,i)=>(
          <Card className="h-[200px] p-6 flex flex-col justify-between">
            <Skeleton className="h-[20px] rounded"/>
            <Skeleton className="h-[20px] rounded"/>
            <Skeleton className="h-[20px] rounded"/>
            <Skeleton className="w-[80px] h-[40px] rounded"/>
          </Card>
        ))}
        </div>)}
      
      {papers && papers.length === 0 && (
      <div className="py-16 flex flex-col items-center justify-center gap-8">
        <Image
          src="/undraw_documents_re_isxv.svg"
          width="200"
          height="200"
          alt="picture of a girl holding a documents" 
        />
        <h2 className="text-2xl">You have no papers</h2>
        <CreatePaperButton />
      </div>)}

      {papers && papers.length > 0 && (
      <div className="grid grid-cols-4 gap-4">
      {papers?.map((pap) => <PaperCard key={pap._id} paper={pap}/>)}
      </div>)}

    </main>
  );
}
