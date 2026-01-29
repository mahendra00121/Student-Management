"use client";
import { ArrowLeft } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useTeachers, Teacher } from "@/context/teacher-context";

// We'll use a simple multi-select simulation or just comma separated string for MVP if complex UI component is missing
// Implementing a simple Checkbox list for subjects/classes could work well.

const SUBJECTS_LIST = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science"];
// Mock classes
const CLASSES_LIST = ["8-A", "8-B", "9-A", "9-B", "10-A", "10-B", "11-A", "11-B", "12-A", "12-B"];

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    employeeId: z.string().min(1, "Employee ID is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    subjects: z.array(z.string()).refine((value) => value.length > 0, {
        message: "You have to select at least one subject.",
    }),
    classes: z.array(z.string()).refine((value) => value.length > 0, {
        message: "You have to select at least one class.",
    }),
    status: z.boolean(),
});

export default function AddTeacherPage() {
    const router = useRouter();
    const { addTeacher } = useTeachers();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            employeeId: "",
            email: "",
            phone: "",
            subjects: [],
            classes: [],
            status: true,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const newTeacher: Teacher = {
            id: Math.random().toString(36).substr(2, 9),
            name: values.name,
            employeeId: values.employeeId,
            email: values.email,
            phone: values.phone,
            subjects: values.subjects,
            classes: values.classes,
            status: values.status ? "Active" : "Inactive"
        };
        addTeacher(newTeacher);
        router.push("/dashboard/teachers");
    }

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4 no-print">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
            </div>
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Add Teacher</h2>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Teacher Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Basic Info</h3>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Teacher Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Sarah Williams" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="employeeId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Employee ID</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="TCH001" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="sarah@school.com" type="email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="9876543210" type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Status</FormLabel>
                                                    <FormDescription>
                                                        Toggle to set teacher as Active or Inactive.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Professional Info */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Professional Info</h3>
                                    <FormField
                                        control={form.control}
                                        name="subjects"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subjects</FormLabel>
                                                <FormDescription>
                                                    Hold Ctrl (Windows) or Cmd (Mac) to select multiple.
                                                </FormDescription>
                                                <FormControl>
                                                    <select
                                                        multiple
                                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={field.value}
                                                        onChange={(e) => {
                                                            const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                                                            field.onChange(selected);
                                                        }}
                                                    >
                                                        {SUBJECTS_LIST.map(subject => (
                                                            <option key={subject} value={subject}>{subject}</option>
                                                        ))}
                                                    </select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="classes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Classes</FormLabel>
                                                <FormDescription>
                                                    Hold Ctrl (Windows) or Cmd (Mac) to select multiple.
                                                </FormDescription>
                                                <FormControl>
                                                    <select
                                                        multiple
                                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={field.value}
                                                        onChange={(e) => {
                                                            const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                                                            field.onChange(selected);
                                                        }}
                                                    >
                                                        {CLASSES_LIST.map(cls => (
                                                            <option key={cls} value={cls}>{cls}</option>
                                                        ))}
                                                    </select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 justify-end">
                                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit">Save Teacher</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
