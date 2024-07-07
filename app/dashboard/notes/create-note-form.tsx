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
import { Id } from "@/convex/_generated/dataModel"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  text: z.string().min(2).max(2500),
})


export default function CreateNoteForm(
  {onNoteAdd}: {onNoteAdd: () => void}) {

  const createNote = useMutation(api.notes.createNote);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createNote({ 
      text: values.text,});
    onNoteAdd();
  }

  return <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Textarea rows={8} placeholder="Your Note" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton isLoading={form.formState.isSubmitting} loadingText="Creating...">
          Create
        </LoadingButton>
      </form>
    </Form>
}