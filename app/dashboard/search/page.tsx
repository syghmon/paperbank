'use client'

import { useState } from "react";
import { SearchForm } from "./search-form";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function SearchPage() {

    const [results, setResults] = useState<typeof api.search.searchAction._returnType>(null);
    
    return <main className="space-y-8">  
    <div className = "flex justify-between items-center">
    <h1 className = "text-4xl font-bold">Search</h1>
    </div>
    <SearchForm setResults={setResults}/>
    
    <ul className="flex-col flex gap-4">

    {results?.map((result) => {if(result.type === "notes") 
    {return <Link href={`/dashboard/notes/${result.record._id}`}>
        <li className="hover:bg-slate-700 bg-slate-800 rounded p-4"> type: Note {result.score} {result.record.text.substring(0,500) + "..."} </li> </Link>}
    else {
        return <Link href={`/dashboard/papers/${result.record._id}`}><li className="hover:bg-slate-700 bg-slate-800 rounded p-4"> type: Paper {result.score} {result.record.title} {result.record.description} </li></Link>
    }})}
    
    </ul>
    </main>
    ;
}