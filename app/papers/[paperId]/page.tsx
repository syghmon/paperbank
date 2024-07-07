'use client'

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import ChatPanel from "./chat-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PaperPage({
    params,
}:{
    params: {
        paperId: Id<"papers">;
    };

}) {
    

    
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
        <Tabs defaultValue="paper" className="w-full">
            <TabsList className="mb-2">
            <TabsTrigger value="paper">Paper</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="paper">
            <div className="bg-gray-900 p-4 rounded-xl flex-1 h-[500px]">
                    {paper.paperUrl && <iframe className="w-full h-full" src={paper.paperUrl} />}
            </div>
            </TabsContent>
            <TabsContent value="chat">
                <ChatPanel paperId={paper._id}/>
            </TabsContent>
        </Tabs>  
              

            </div>
        </main>
  );
}
