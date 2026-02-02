"use client";
import { ArrowLeft } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useRouter, useParams } from "next/navigation";
import { useSubjects, Subject } from "@/context/subject-context";
import { useTeachers } from "@/context/teacher-context";
import { useClasses } from "@/context/class-context";
import { useEffect } from "react";

const formSchema = z.object({
    name: z.string().min(2, "Subject Name is required"),
    class: z.string().min(1, "Class is required"),
    section: z.string().optional(),
    teacherId: z.string().optional(),
    status: z.boolean(),
});

export default function EditSubjectPage() {
    const router = useRouter();
    const params = useParams();
    const { updateSubject, subjects } = useSubjects(); // Changed getSubject to subjects
    const { teachers } = useTeachers();
    const { classes } = useClasses();
    const id = params.id as string;

    // Get unique class names for the dropdown
    const uniqueClasses = Array.from(new Set(classes.map(c => c.name))).sort((a, b) => parseInt(a) - parseInt(b));

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            class: "",
            section: "",
            teacherId: "",
            status: true,
        },
    });

    useEffect(() => {
        const subject = subjects.find(s => s.id === id); // Find locally
        if (subject) {
            console.log("Resetting form with:", subject); // Debug log
            form.reset({
                name: subject.name,
                class: subject.class,
                section: subject.section || "all",
                teacherId: subject.teacherId || "",
                status: subject.status === "Active",
            });
        }
    }, [id, subjects, form]);

    const selectedClass = form.watch("class");
    // Derive sections based on selected class
    const availableSections = selectedClass
        ? classes.filter(c => c.name === selectedClass).flatMap(c => c.sections)
        : [];
    // De-duplicate sections
    const uniqueSections = Array.from(new Set(availableSections)).sort();

    function onSubmit(values: z.infer<typeof formSchema>) {
        const selectedTeacher = teachers.find(t => t.id === values.teacherId);

        updateSubject(id, {
            name: values.name,
            class: values.class,
            section: values.section === "all" ? undefined : values.section,
            teacherId: values.teacherId,
            teacherName: selectedTeacher?.name,
            status: values.status ? "Active" : "Inactive"
        });

        router.push("/dashboard/subjects");
    }

    const subject = subjects.find(s => s.id === id);
    if (!subject) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4 no-print">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
            </div>
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Edit Subject</h2>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Subject Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Mathematics" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="class"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Class</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Class" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {uniqueClasses.map((cls) => (
                                                        <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="section"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Section (Optional)</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={!selectedClass}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Section" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="all">All Sections</SelectItem>
                                                    {uniqueSections.map((sec) => (
                                                        <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Leave empty to assign to all sections of this class.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="teacherId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Assign Teacher</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Teacher" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {teachers.map((teacher) => (
                                                        <SelectItem key={teacher.id} value={teacher.id}>
                                                            {teacher.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                                    Toggle to set subject as Active.
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
                            <div className="flex gap-4 justify-end">
                                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit">Update Subject</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
