"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Newspaper, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { generateNews } from "@/ai/flows/generate-news-flow";
import { useToast } from "@/hooks/use-toast";

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
        toast({
          title: "News Updated",
          description: "Here are the latest articles for you.",
        });
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
    <Card className="w-full h-full border-primary/20 bg-secondary/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="text-primary" />
          Latest Sector News
        </CardTitle>
        {newsItems.length > 0 && (
             <Button variant="ghost" size="icon" onClick={handleFetchNews} disabled={isPending}>
                {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCw className="h-4 w-4" />
                )}
                <span className="sr-only">Refresh News</span>
            </Button>
        )}
      </CardHeader>
      <CardContent className="grid gap-6">
        {newsItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-48 gap-4 p-4">
                {isPending ? (
                    <>
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Fetching the latest news...</p>
                    </>
                ) : (
                    <>
                        <h3 className="font-semibold text-lg">Stay Informed</h3>
                        <p className="text-muted-foreground">Get the latest news and updates from the public sector with one click.</p>
                        <Button onClick={handleFetchNews} disabled={isPending}>
                            Get Today's News
                        </Button>
                    </>
                )}
            </div>
        ) : (
            newsItems.map((item, index) => (
            <Link href={item.link} key={index} className="flex flex-col sm:flex-row gap-4 group">
                <div className="w-full sm:w-1/3">
                <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={400}
                    data-ai-hint={item.hint}
                    className="rounded-lg object-cover aspect-video group-hover:opacity-80 transition-opacity"
                />
                </div>
                <div className="w-full sm:w-2/3">
                <h3 className="font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
            </Link>
            ))
        )}
      </CardContent>
    </Card>
  );
}
