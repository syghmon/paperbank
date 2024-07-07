'use client'

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import ChatPanel from "./chat-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { btnIconStyles, btnStyles } from "@/styles/styles";
import { RemovePaperButton } from "./remove-paper-button";

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
    return (

        
        <main className="p-24 space-y-8">  


            {!paper && (
                <div className="space-y-4">
                <div className="space-y-8">
                    <div>
                        <Skeleton className="h-[40px] w-[500px]"/>
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-[40px] w-[80px]"/>
                        <Skeleton className="h-[40px] w-[80px]"/>
                    </div>
                    
                 </div>
                    <div>
                        <Skeleton className="h-[500px]"/>
                        </div>
                 </div>
               
            )}
            {paper && (<><div className = "flex justify-between items-center">
                <h1 className = "text-4xl font-bold">{paper.title}</h1>
                    <RemovePaperButton paperId={paper._id}/>
                
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
              

            </div></>)}
            
        </main>
  );
}
