"use client"

import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createPaper } from "@/convex/papers"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Loader2 } from "lucide-react"
import { LoadingButton } from "@/components/loading-button"

const formSchema = z.object({
  title: z.string().min(2).max(50),
})


export default function AddPaperButton(
  {onAdd,}: {onAdd: () => void}) {

  const createPaper = useMutation(api.papers.createPaper);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    //sleep 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await createPaper(values);
    onAdd();
  }

  return <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Yuh what" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton isLoading={form.formState.isSubmitting} loadingText="Adding...">
          Add
        </LoadingButton>
      </form>
    </Form>
}