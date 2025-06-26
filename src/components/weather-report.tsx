"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CloudSun, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export function WeatherReport() {
  const [weatherData, setWeatherData] = useState({
    location: "New Delhi",
    temperature: "34°C",
    condition: "Partly Cloudy",
  });

  // Using useEffect to avoid hydration mismatch for potentially dynamic data
  useEffect(() => {
    // In a real app, you would fetch this data from an API
    // For now, we use static data initialized in state.
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 left-4 z-50 h-12 w-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
          aria-label="Show Weather Report"
        >
          <CloudSun className="h-6 w-6 text-accent" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="text-primary" />
            Weather Report
          </DialogTitle>
        </DialogHeader>
        <Card className="border-none shadow-none">
          <CardContent className="flex items-center justify-around text-center p-6 pt-2">
            <div className="flex flex-col items-center gap-2">
              <h3 className="font-bold text-2xl">{weatherData.location}</h3>
              <CloudSun className="w-16 h-16 text-accent" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-5xl font-bold">{weatherData.temperature}</p>
              <p className="text-muted-foreground">{weatherData.condition}</p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
