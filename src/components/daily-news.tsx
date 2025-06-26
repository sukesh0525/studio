"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Newspaper, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { generateNews } from "@/ai/flows/generate-news-flow";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

type NewsItem = {
  title: string;
  description: string;
  image: string;
  hint: string;
  link: string;
};

export function DailyNews() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFetchNews = () => {
    startTransition(async () => {
      try {
        const result = await generateNews();
        const newItems = result.articles.map(article => ({
          ...article,
          image: "https://placehold.co/600x400.png",
          link: "#"
        }));
        setNewsItems(newItems);
        if (newsItems.length === 0) {
             toast({
                title: "News Updated",
                description: "Here are the latest articles for you.",
            });
        }
      } catch (e) {
        console.error(e);
        toast({
          title: "Error Fetching News",
          description: "Could not fetch the news. Please try again later.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog onOpenChange={(open) => {
        if(open && newsItems.length === 0) {
            handleFetchNews();
        }
    }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
          aria-label="Show Daily News"
        >
          <Newspaper className="h-6 w-6 text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
         <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between p-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                <Newspaper className="text-primary" />
                Latest Sector News
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={handleFetchNews} disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="sr-only">Refresh News</span>
                </Button>
            </CardHeader>
            <CardContent className="grid gap-6 p-4 max-h-[70vh] overflow-y-auto">
                {isPending && newsItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center h-48 gap-4 p-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Fetching the latest news...</p>
                    </div>
                ) : (
                    newsItems.map((item, index) => (
                    <Link href={item.link} key={index} className="flex flex-col sm:flex-row gap-4 group border-b pb-4 last:border-b-0">
                        <div className="w-full sm:w-1/4">
                        <Image
                            src={item.image}
                            alt={item.title}
                            width={600}
                            height={400}
                            data-ai-hint={item.hint}
                            className="rounded-lg object-cover aspect-video group-hover:opacity-80 transition-opacity"
                        />
                        </div>
                        <div className="w-full sm:w-3/4">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                    </Link>
                    ))
                )}
                 {!isPending && newsItems.length === 0 && (
                     <div className="flex flex-col items-center justify-center text-center h-48 gap-4 p-4">
                        <h3 className="font-semibold text-lg">No news available</h3>
                        <p className="text-muted-foreground">Click the refresh button to try again.</p>
                    </div>
                )}
            </CardContent>
            </Card>
      </DialogContent>
    </Dialog>
  );
}
