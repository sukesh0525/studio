"use client";

import { generateResume } from "@/ai/flows/generate-resume";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

const resumeSchema = z.object({
  linkedInUrl: z.string().url("Please enter a valid LinkedIn URL.").optional().or(z.literal("")),
  prompt: z.string().min(20, "Prompt must be at least 20 characters long."),
  uploadedFiles: z.any().optional(),
});

type ResumeState = {
  resume: string | null;
  error: string | null;
};

export default function AiResumeMakerPage() {
  const [state, setState] = useState<ResumeState>({ resume: null, error: null });
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof resumeSchema>>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      linkedInUrl: "",
      prompt: "Generate a professional one-page resume for a recent computer science graduate applying for a software developer role. Emphasize skills in React, Node.js, and cloud technologies. Include a summary, education, projects, skills, and contact information.",
    },
  });

  async function onSubmit(values: z.infer<typeof resumeSchema>) {
    startTransition(async () => {
      setState({ resume: null, error: null });
      try {
        const result = await generateResume({
          linkedInUrl: values.linkedInUrl,
          prompt: values.prompt,
          // Mocking file content as data URIs
          uploadedFiles: values.uploadedFiles?.length ? ["mock-certificate.pdf", "mock-achievement.pdf"] : [],
        });
        setState({ resume: result.resume, error: null });
        toast({ title: "Resume Generated!", description: "Your new AI-powered resume is ready." });
      } catch (e) {
        console.error(e);
        const error = e instanceof Error ? e.message : "An unknown error occurred.";
        setState({ resume: null, error });
        toast({ title: "Error", description: error, variant: "destructive" });
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Sparkles className="text-accent" />
            AI Resume Maker
          </CardTitle>
          <CardDescription>
            Provide some information, and our AI will craft a professional resume for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="linkedInUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="uploadedFiles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Certificates or Past Resumes</FormLabel>
                    <FormControl>
                      <Input type="file" multiple {...field} />
                    </FormControl>
                    <FormDescription>This helps the AI understand your achievements better.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions for the AI</FormLabel>
                    <FormControl>
                      <Textarea rows={8} placeholder="e.g., Generate a resume for a data analyst position..." {...field} />
                    </FormControl>
                    <FormDescription>Be as specific as possible for the best results.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Resume"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Generated Resume</CardTitle>
          <CardDescription>Review your new resume below. You can copy the text and format it in your preferred editor.</CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p>Our AI is writing your resume...</p>
            </div>
          )}
          {state.error && (
            <div className="text-destructive-foreground bg-destructive p-4 rounded-md">
              <h4 className="font-bold">Generation Failed</h4>
              <p>{state.error}</p>
            </div>
          )}
          {state.resume && (
             <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md bg-muted/50 h-[600px] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-body">{state.resume}</pre>
            </div>
          )}
           {!isPending && !state.resume && !state.error && (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-2 p-8 border-2 border-dashed rounded-lg">
                <Sparkles className="h-12 w-12" />
                <p>Your generated resume will appear here.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
