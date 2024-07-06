'use client'

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export default function PaperPage({
    params,
}:{
    params: {
        paperId: Id<"papers">;
    };

}) {
    
    console.log(params.paperId)
    const paper = useQuery(api.papers.getPaper, {
        paperId: params.paperId
    })

    if (!paper) {
        return <div>You don't have access</div>
    }

    return (
        <main className="p-24 space-y-8">  
            <div className = "flex justify-between items-center">
                <h1 className = "text-4xl font-bold">{paper.title}</h1>

                
        </div>
        <div className="flex gap-12">
            <div className="bg-gray-900 p-4 rounded flex-1 h-[600px]">
                    {paper.paperUrl && <iframe className="w-full h-full" src={paper.paperUrl} />}
            </div>
              
            <div className="w-[300px] bg-gray-900"></div>
            </div>
        </main>
  );
}
