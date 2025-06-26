"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="border-primary/20 bg-secondary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="text-primary" />
          Weather Report
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-around text-center p-6">
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
  );
}
