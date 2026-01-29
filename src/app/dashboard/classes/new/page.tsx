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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useClasses, ClassItem } from "@/context/class-context";
import { useTeachers } from "@/context/teacher-context";

// Simple multi-input for sections using comma separated string for MVP
const formSchema = z.object({
    name: z.string().min(1, "Class Name is required"),
    sections: z.string().min(1, "At least one section is required (e.g. A, B)"),
    classTeacherId: z.string().optional(),
});

export default function AddClassPage() {
    const router = useRouter();
    const { addClass } = useClasses();
    const { teachers } = useTeachers();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            sections: "",
            classTeacherId: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const sectionArray = values.sections.split(",").map(s => s.trim()).filter(Boolean);
        const selectedTeacher = teachers.find(t => t.id === values.classTeacherId);

        const newClass: ClassItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: values.name,
            sections: sectionArray,
            classTeacherId: values.classTeacherId,
            classTeacherName: selectedTeacher?.name
        };
        addClass(newClass);
        router.push("/dashboard/classes");
    }

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4 no-print">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
            </div>
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Add Class</h2>
            </div>
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Class Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. 10" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the standard/grade (e.g., 1, 5, 10, 12).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sections"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sections</FormLabel>
                                        <FormControl>
                                            <Input placeholder="A, B, C" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter sections separated by commas.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="classTeacherId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class Teacher (Optional)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a teacher" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {teachers.map((teacher) => (
                                                    <SelectItem key={teacher.id} value={teacher.id}>
                                                        {teacher.name} ({teacher.employeeId})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-4 justify-end">
                                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit">Save Class</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
