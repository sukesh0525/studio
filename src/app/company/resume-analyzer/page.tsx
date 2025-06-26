"use client";

import { verifyResume } from "@/ai/flows/verify-resume-flow";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileCheck2, ShieldCheck, ShieldAlert } from "lucide-react";

const resumeAnalyzerSchema = z.object({
  resumeText: z.string().min(50, "Resume text must be at least 50 characters long to analyze."),
});

type AnalyzerState = {
  result: {
    isGenuine: boolean;
    feedback: string;
  } | null;
  error: string | null;
};

export default function ResumeAnalyzerPage() {
  const [state, setState] = useState<AnalyzerState>({ result: null, error: null });
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof resumeAnalyzerSchema>>({
    resolver: zodResolver(resumeAnalyzerSchema),
    defaultValues: {
      resumeText: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resumeAnalyzerSchema>) {
    startTransition(async () => {
      setState({ result: null, error: null });
      try {
        const result = await verifyResume({
          resumeText: values.resumeText,
        });
        setState({ result, error: null });
        toast({ title: "Analysis Complete!", description: "The resume has been analyzed." });
      } catch (e) {
        console.error(e);
        const error = e instanceof Error ? e.message : "An unknown error occurred.";
        setState({ result: null, error });
        toast({ title: "Error", description: error, variant: "destructive" });
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck2 className="text-accent" />
            AI Resume Analyzer
          </CardTitle>
          <CardDescription>
            Paste a candidate's resume text below to check for common issues and verify its authenticity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="resumeText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paste Candidate's Resume Content</FormLabel>
                    <FormControl>
                      <Textarea rows={15} placeholder="Paste the full text of the candidate's resume here..." {...field} />
                    </FormControl>
                    <FormDescription>Our AI will analyze the content for authenticity and completeness.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Resume"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Analysis Result</CardTitle>
          <CardDescription>The AI's feedback on the resume will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p>Our AI is analyzing the resume...</p>
            </div>
          )}
          {state.error && (
            <div className="text-destructive-foreground bg-destructive p-4 rounded-md">
              <h4 className="font-bold">Analysis Failed</h4>
              <p>{state.error}</p>
            </div>
          )}
          {state.result && (
             <div className="space-y-4">
                <div className={`flex items-center gap-4 p-4 rounded-lg ${state.result.isGenuine ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                    {state.result.isGenuine ? <ShieldCheck className="h-8 w-8" /> : <ShieldAlert className="h-8 w-8" />}
                    <h3 className="text-xl font-bold">{state.result.isGenuine ? "Looks Genuine" : "Potential Issues Found"}</h3>
                </div>
                <div>
                    <h4 className="font-semibold mb-2 text-foreground">AI Feedback:</h4>
                    <p className="text-muted-foreground text-sm p-4 border bg-muted/50 rounded-md">{state.result.feedback}</p>
                </div>
             </div>
          )}
           {!isPending && !state.result && !state.error && (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-2 p-8 border-2 border-dashed rounded-lg">
                <FileCheck2 className="h-12 w-12" />
                <p>The resume analysis will appear here.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
