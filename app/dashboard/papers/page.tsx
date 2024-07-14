'use client';

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { PaperCard } from "./paper-card";
import CreatePaperButton from "./add-paper-button";
import Image from 'next/image';
import { Loader2 } from "lucide-react";
import { Protect, RedirectToSignIn } from "@clerk/nextjs";
import { useUser } from '@clerk/clerk-react';

export default function Home() {
  const { isSignedIn } = useUser();

  const papers = useQuery(api.papers.getPapers);

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
    <Protect 
      condition={() => isSignedIn || false} // Ensure the function always returns a boolean
      fallback={<RedirectToSignIn />}
    >
      <main className="space-y-8 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">My Papers</h1>
          <CreatePaperButton />
        </div>

        {!papers && (
          <div className="flex justify-center items-center">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}

        {papers && papers.length === 0 && (
          <div className="py-16 flex flex-col items-center justify-center gap-8">
            <MyImage />
            <h2 className="text-2xl">You have no papers</h2>
            <CreatePaperButton />
          </div>
        )}

        {papers && papers.length > 0 && (
          <div className="grid grid-cols-4 gap-6">
            {papers?.map((pap) => <PaperCard key={pap._id} paper={pap} />)}
          </div>
        )}
      </main>
    </Protect>
  );
}
