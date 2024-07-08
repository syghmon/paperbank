'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { askQuestion, generateUploadUrl } from "@/convex/papers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod"; 
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { LoadingButton } from "@/components/loading-button";

const formSchema = z.object({
    search: z.string().min(2).max(250),
})




export function SearchForm(
  {setResults}: {setResults: (notes: typeof api.search.searchAction._returnType) => void
}) {

    

    const searchAction = useAction(api.search.searchAction)



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          search: "",
        },
      })
    
      async function onSubmit(values: z.infer<typeof formSchema>) {
        await searchAction({ search: values.search }).then(setResults);
        form.reset();
      } 
    return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 gap-2">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className = "flex-1">
              <FormControl>
                <Input placeholder="Search over all your notes and papers" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton isLoading={form.formState.isSubmitting} loadingText="Searching...">
          Submit
        </LoadingButton>
      </form>
    </Form>
    )
}