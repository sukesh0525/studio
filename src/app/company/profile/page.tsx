"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

const companyProfileSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters."),
  location: z.string().min(3, "Location is required."),
  workType: z.enum(["On-site", "Hybrid", "Remote"]),
  description: z.string().min(20, "Please provide a detailed company description."),
});

export default function CompanyProfilePage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof companyProfileSchema>>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      companyName: "",
      location: "",
      workType: "Hybrid",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof companyProfileSchema>) {
    console.log(values);
    toast({
      title: "Company Profile Updated",
      description: "Your company information has been saved successfully.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Company Profile</CardTitle>
        <CardDescription>
          Provide your company details. This information will be visible to potential candidates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Ministry of Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headquarters Location</FormLabel>
                    <FormControl>
                      <Input placeholder="New Delhi, India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="workType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Work Model</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a work model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="On-site">On-site</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder="Describe your company's mission, vision, and the work you do..." {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your chance to attract top talent. Make it compelling.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit">Save Company Profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
