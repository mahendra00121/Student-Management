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
import { useTeachers } from "@/context/teacher-context";
import { useClasses } from "@/context/class-context";
import { useSubjects } from "@/context/subject-context";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    employeeId: z.string().min(1, "Employee ID is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    subjects: z.array(z.string()).min(1, "Select at least one subject"),
    classes: z.array(z.string()).min(1, "Select at least one class"),
    status: z.boolean(),
});

export default function AddTeacherPage() {
    const router = useRouter();
    const { addTeacher } = useTeachers();
    const { classes } = useClasses();
    const { subjects: allSubjects } = useSubjects();

    const uniqueSubjects = Array.from(new Set(allSubjects.map(s => s.name))).sort();
    const availableClasses = classes.map(c => c.name).sort();

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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await addTeacher({
                name: values.name,
                employeeId: values.employeeId,
                email: values.email,
                phone: values.phone,
                subjects: values.subjects,
                classes: values.classes,
                status: values.status ? "Active" : "Inactive"
            });
            alert("Teacher added successfully!");
            router.push("/dashboard/teachers");
        } catch (error: any) {
            console.error("Failed to add teacher:", error);
            alert(`Error: ${error.message || "Something went wrong"}`);
        }
    }

    const toggleItem = (current: string[], item: string, onChange: (val: string[]) => void) => {
        if (current.includes(item)) {
            onChange(current.filter(i => i !== item));
        } else {
            onChange([...current, item]);
        }
    };

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
                                                    <Input placeholder="9876543210" {...field} />
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
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Subjects</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "w-full justify-between min-h-[40px] h-auto text-left font-normal",
                                                                    !field.value.length && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <div className="flex flex-wrap gap-1">
                                                                    {field.value.length > 0 ? (
                                                                        field.value.map((val: string) => (
                                                                            <Badge variant="secondary" key={val} className="text-[10px]">
                                                                                {val}
                                                                            </Badge>
                                                                        ))
                                                                    ) : (
                                                                        "Select subjects..."
                                                                    )}
                                                                </div>
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[300px] p-0" align="start">
                                                        <div className="max-h-[300px] overflow-y-auto p-2">
                                                            {uniqueSubjects.length > 0 ? (
                                                                <div className="space-y-1">
                                                                    {uniqueSubjects.map((item: string) => (
                                                                        <div
                                                                            key={item}
                                                                            className={cn(
                                                                                "flex items-center justify-between p-2 rounded-md cursor-pointer text-sm",
                                                                                field.value.includes(item) ? "bg-primary/10 text-primary" : "hover:bg-slate-100"
                                                                            )}
                                                                            onClick={() => toggleItem(field.value, item, field.onChange)}
                                                                        >
                                                                            {item}
                                                                            {field.value.includes(item) && <Check className="h-4 w-4" />}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="p-4 text-center text-sm text-muted-foreground">No subjects found</p>
                                                            )}
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="classes"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Classes</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "w-full justify-between min-h-[40px] h-auto text-left font-normal",
                                                                    !field.value.length && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <div className="flex flex-wrap gap-1">
                                                                    {field.value.length > 0 ? (
                                                                        field.value.map((val: string) => (
                                                                            <Badge variant="secondary" key={val} className="text-[10px]">
                                                                                {val}
                                                                            </Badge>
                                                                        ))
                                                                    ) : (
                                                                        "Select classes..."
                                                                    )}
                                                                </div>
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[300px] p-0" align="start">
                                                        <div className="max-h-[300px] overflow-y-auto p-2">
                                                            {availableClasses.length > 0 ? (
                                                                <div className="space-y-1">
                                                                    {availableClasses.map((item: string) => (
                                                                        <div
                                                                            key={item}
                                                                            className={cn(
                                                                                "flex items-center justify-between p-2 rounded-md cursor-pointer text-sm",
                                                                                field.value.includes(item) ? "bg-primary/10 text-primary" : "hover:bg-slate-100"
                                                                            )}
                                                                            onClick={() => toggleItem(field.value, item, field.onChange)}
                                                                        >
                                                                            {item}
                                                                            {field.value.includes(item) && <Check className="h-4 w-4" />}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="p-4 text-center text-sm text-muted-foreground">No classes found</p>
                                                            )}
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
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
