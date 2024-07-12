'use client';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoadingButton } from "@/components/loading-button";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  RowSelectionState,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  searchQuery: z.string().min(2).max(50).optional(),
  authors: z.string().optional(),
  id: z.string().optional(),
});

interface ArxivResult {
  id: string | null;
  title: string | null;
  summary: string | null;
  authors: string | null;
}

async function fetchArxivResults(query: string): Promise<ArxivResult[]> {
  const response = await fetch(`http://export.arxiv.org/api/query?${query}&sortBy=relevance&max_results=5`);
  const text = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");

  const entries = Array.from(xmlDoc.getElementsByTagName("entry")).map((entry) => ({
    id: entry.getElementsByTagName("id")[0]?.textContent || null,
    title: entry.getElementsByTagName("title")[0]?.textContent || null,
    summary: entry.getElementsByTagName("summary")[0]?.textContent || null,
    authors: Array.from(entry.getElementsByTagName("author")).map(author => author.getElementsByTagName("name")[0]?.textContent).join(", ") || null,
  }));

  return entries;
}

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const extractIdFromUrl = (url: string): string => {
  const parts = url.split('/');
  let extractedId = parts[parts.length - 1];
  const versionIndex = extractedId.indexOf('v');
  if (versionIndex !== -1) {
    extractedId = extractedId.substring(0, versionIndex);
  }
  return extractedId;
};

const columns: ColumnDef<ArxivResult>[] = [
  {
    accessorKey: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    accessorKey: "authors",
    header: "Authors",
    cell: ({ row }) => <div>{row.getValue("authors")}</div>,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{extractIdFromUrl(row.getValue("id")!)}</div>,
  },
];

export default function AddPaperButton({ onAdd }: { onAdd: (papers: ArxivResult[]) => void }) {
  const createPaper = useMutation(api.papers.createPaper);
  const [searchResults, setSearchResults] = useState<ArxivResult[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery: "",
      authors: "",
      id: "",
    },
  });

  const onSubmit = async () => {
    const selectedPapers = searchResults.filter((_, index) => rowSelection[index]);
    await Promise.all(selectedPapers.map(async (paper) => {
      await createPaper({
        title: paper.title!,
      });
    }));
    onAdd(selectedPapers); // Pass the selected papers to the callback
  };

  const buildQuery = (title: string, authors?: string, id?: string) => {
    let queryParts: string[] = [];
  
    if (title) {
      queryParts.push(`search_query=ti:${title}`);
    }
  
    if (authors) {
      queryParts.push(`au:${authors}`);
    }
  
    if (id) {
      if (id.startsWith('http://') || id.startsWith('https://')) {
        id = extractIdFromUrl(id);
      }
      queryParts.push(`id_list=${id}`);
    }
  
    if (queryParts.length === 0) {
      return `search_query=all`; // Fallback query if no parameters provided
    }
  
    return queryParts.join('&');
  };

  const onSearch = debounce(async (query: string, authors?: string, id?: string) => {
    const fullQuery = buildQuery(query, authors, id);
    const results = await fetchArxivResults(fullQuery);
    setSearchResults(results);
  }, 300);

  const table = useReactTable({
    data: searchResults,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="searchQuery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search for Papers</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter paper title or keywords"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    onSearch(e.target.value, form.getValues("authors"), form.getValues("id"));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="authors"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Authors</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter authors"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onSearch(form.getValues("searchQuery"), e.target.value, form.getValues("id"));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Link or ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter link to paper or ID"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onSearch(form.getValues("searchQuery"), form.getValues("authors"), e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {searchResults.length > 0 && (
          <FormItem>
            <FormLabel>Select Papers</FormLabel>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </FormItem>
        )}
        <LoadingButton
          isLoading={form.formState.isSubmitting}
          loadingText="Adding..."
          onClick={onSubmit} // Execute the onSubmit function when clicked
        >
          Add
        </LoadingButton>
      </form>
    </Form>
  );
}
