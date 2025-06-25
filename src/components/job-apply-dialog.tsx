"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const COLORS = ["hsl(var(--chart-2))", "hsl(var(--muted))"];

export function JobApplyDialog({ companyName }: { companyName: string }) {
  const [matchPercentage, setMatchPercentage] = React.useState(0);

  React.useEffect(() => {
    // Generate random percentage on client mount to avoid hydration mismatch
    setMatchPercentage(Math.floor(Math.random() * (95 - 65 + 1)) + 65);
  }, []);

  const data = [
    { name: "Your Match", value: matchPercentage },
    { name: "Gap", value: 100 - matchPercentage },
  ];

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Apply</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Compatibility Analysis for {companyName}</AlertDialogTitle>
          <AlertDialogDescription>
            Based on your profile, here is your compatibility score for this position.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="w-full h-64">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Proceed to Application</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
