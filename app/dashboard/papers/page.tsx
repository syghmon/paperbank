'use client'

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { PaperCard } from "./paper-card";
import CreatePaperButton from "./add-paper-button";
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card";
import Image from 'next/image';
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

export default function Home() {

  const papers = useQuery(api.papers.getPapers)
  const MyImage = () => {
      return (
        <picture>
          <source srcSet={"/reading_dark.svg"} media="(prefers-color-scheme: dark)" />
          <Image
              src={"/reading_light.svg"}
              alt="girl reading"
              width={300}
              height={300}
          />
        </picture>
    );
  };
  return (
    <main className="space-y-8 w-full">  
    <div className = "flex justify-between items-center">
    <h1 className = "text-4xl font-bold">My Papers</h1>

    <CreatePaperButton />
    </div>

      {/* {!papers && (<div className="grid grid-cols-4 gap-6">
        {new Array(8).fill("").map((_,i)=>(
          <Card key={"card" + i} className="h-[300px] p-6 flex flex-col justify-between">
            <Skeleton key={"skelli1" + i} className="h-[30px] rounded"/>
            <Skeleton key={"skelli2" + i} className="h-[30px] rounded"/>
            <Skeleton key={"skelli3" + i} className="h-[30px] rounded"/>
            <Skeleton key={"skelli4" + i} className="w-[120px] h-[60px] rounded"/>
          </Card>
        ))}
        </div>)} */}

        {!papers && (<div className="flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>)}

      
      {papers && papers.length === 0 && (
      <div className="py-16 flex flex-col items-center justify-center gap-8">
        <MyImage />
        <h2 className="text-2xl">You have no papers</h2>
        <CreatePaperButton />
      </div>)}

      {papers && papers.length > 0 && (
      <div className="grid grid-cols-4 gap-6">
      {papers?.map((pap) => <PaperCard key={pap._id} paper={pap}/>)}
      </div>)}
    </main>
  );
}
