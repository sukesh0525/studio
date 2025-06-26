import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const newsItems = [
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
  return (
    <Card className="w-full h-full border-primary/20 bg-secondary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="text-primary" />
          Latest Sector News
        </CardTitle>
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
