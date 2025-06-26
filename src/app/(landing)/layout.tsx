import { DailyNews } from "@/components/daily-news";
import { ScrollToTop } from "@/components/scroll-to-top";
import { WeatherReport } from "@/components/weather-report";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
      <WeatherReport />
      <DailyNews />
      <ScrollToTop />
    </div>
  );
}
