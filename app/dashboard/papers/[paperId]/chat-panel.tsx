'use client'

import { PaperCard } from "@/app/dashboard/papers/paper-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useAction, useQuery } from "convex/react";
import { QuestionForm } from "./question-form";

export default function ChatPanel({
    paperId
}: {
    paperId: Id<"papers">;
}
) {
    const chats = useQuery(api.chats.getChatsForPaper, {paperId});
    return <div className="bg-gray-900 flex flex-col gap-2 p-6 rounded-xl">

        <div  className = "h-[350px] overflow-y-auto space-y-3">
            <div className="bg-slate-950 rounded p-3">
                Ask any question using AI about this paper below
                </div>

            {chats?.map((chat) => 
                <div 
                    className={cn(
                    {
                        "bg-slate-800": chat.isHuman,
                        "bg-slate-950": !chat.isHuman,
                        'text-right': chat.isHuman,
                    },
                    "rounded p-4 whitespace-pre-line"
                )}>
                {chat.isHuman ? 'YOU' : 'AI'} : {chat.text}
                </div>
            )}
        </div>
        <div className="flex gap-1 mt-3">
        <QuestionForm paperId={paperId}/>
        </div>
    </div>


}
