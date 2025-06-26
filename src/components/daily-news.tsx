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

const initialNewsItems: NewsItem[] = [
  {
    title: "Government Announces New Skill India Mission for Tech Graduates",
    description: "The initiative aims to upskill over 1 million young Indians in emerging technologies like AI, blockchain, and cybersecurity.",
    image: "https://placehold.co/600x400.png",
    hint: "technology students",
    link: "#"
  },
  {
    title: "Major Infrastructure Projects to Create 50,000 New Jobs",
    description: "The Ministry of Infrastructure has greenlit projects that will significantly boost employment opportunities in the construction and engineering sectors.",
    image: "https://placehold.co/600x400.png",
    hint: "infrastructure construction",
    link: "#"
  },
  {
    title: "Public Sector Banks on a Hiring Spree for Financial Analysts",
    description: "With the economy showing strong signs of recovery, PSBs are looking to strengthen their financial analysis and risk management teams.",
    image: "https://placehold.co/600x400.png",
    hint: "finance banking",
    link: "#"
  }
];

export function DailyNews() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNewsItems);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleRefreshNews = () => {
    startTransition(async () => {
      try {
        const result = await generateNews();
        const newItems = result.articles.map(article => ({
          ...article,
          image: "https://placehold.co/600x400.png",
          link: "#"
        }));
        setNewsItems(newItems);
      } catch (e) {
        console.error(e);
        toast({
          title: "Error Refreshing News",
          description: "Could not fetch the latest news. Please try again later.",
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
        <Button variant="ghost" size="icon" onClick={handleRefreshNews} disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="sr-only">Refresh News</span>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        {newsItems.map((item, index) => (
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
        ))}
      </CardContent>
    </Card>
  );
}
