"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useExams } from "@/context/exam-context";
import { useClasses } from "@/context/class-context";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    type: z.enum(["Unit", "Mid", "Final"]),
    classId: z.string().min(1, "Class is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    status: z.enum(["Upcoming", "Ongoing", "Completed"]),
});

export default function EditExamPage() {
    const router = useRouter();
    const { id } = useParams();
    const { getExam, updateExam } = useExams();
    const { classes } = useClasses();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "Unit",
            classId: "",
            startDate: "",
            endDate: "",
            status: "Upcoming",
        },
    });

    useEffect(() => {
        const exam = getExam(id as string);
        if (exam) {
            form.reset({
                name: exam.name,
                type: exam.type,
                classId: exam.classId,
                startDate: exam.startDate,
                endDate: exam.endDate,
                status: exam.status,
            });
        }
    }, [id, getExam, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        updateExam(id as string, values);
        router.push("/dashboard/exams");
    }

    if (!getExam(id as string)) {
        return <div>Exam not found</div>;
    }

    return (
        <div className="max-w-2xl mx-auto py-6">
            <div className="flex items-center gap-4 mb-6 no-print">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Edit Exam</CardTitle>
                    <CardDescription>Modify examination details and schedule</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Exam Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Mid-Term Exam" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Exam Type</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Unit">Unit Test</SelectItem>
                                                    <SelectItem value="Mid">Mid-Term</SelectItem>
                                                    <SelectItem value="Final">Final</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="classId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Class</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select class" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {classes.map((cls) => (
                                                        <SelectItem key={cls.id} value={cls.name}>
                                                            Class {cls.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Upcoming">Upcoming</SelectItem>
                                                <SelectItem value="Ongoing">Ongoing</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push("/dashboard/exams")}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">Update Exam</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
