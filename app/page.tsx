'use client'

import { api } from "@/convex/_generated/api";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Unauthenticated, Authenticated, useMutation, useQuery } from "convex/react";

export default function Home() {

  const papers = useQuery(api.papers.getPapers)
  const createPaper = useMutation(api.papers.createPaper);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">      
    <Unauthenticated>
      <SignInButton />
    </Unauthenticated>
    <Authenticated>
      <UserButton />
      <button onClick= {() => {createPaper({title: 'hello world'})

      }}> ClickMe </button>

      {papers?.map((doc) => (
        <div key={doc._id}>{doc.title}</div>
      ))}
    </Authenticated>
    </main>
  );
}
