"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Users, School, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
    role: z.enum(["admin", "teacher", "student"]),
});

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            role: "admin",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Store role in localStorage for demo purposes
        localStorage.setItem("userRole", values.role);

        setIsLoading(false);
        router.push("/dashboard");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fafafa] selection:bg-indigo-500 selection:text-white relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            {/* Back Button */}
            <Link
                href="/"
                className="absolute top-8 left-8 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-all group py-2"
            >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Return to Network
            </Link>

            <Card className="w-full max-w-md border-white/20 bg-white/70 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] rounded-[2.5rem] overflow-hidden">
                <CardHeader className="space-y-4 text-center pt-12 pb-8">
                    <div className="flex justify-center">
                        <div className="bg-slate-950 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200">
                            <School className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-black tracking-tight italic uppercase">Access Console</CardTitle>
                        <CardDescription className="text-slate-400 font-medium uppercase tracking-[0.1em] text-[10px] mt-1">Institutional Authentication Protocol</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="px-10 pb-10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Registry Email</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                                <Input
                                                    placeholder="admin@edunexus.gov"
                                                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-indigo-600/20 font-medium"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px] uppercase font-bold" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secure Passkey</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className="pl-12 pr-12 h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-indigo-600/20"
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 px-0 hover:bg-slate-50 rounded-lg"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-slate-400" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-slate-400" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px] uppercase font-bold" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Tier</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="pl-12 h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus:ring-indigo-600/20 relative font-bold text-slate-700">
                                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                                    <SelectValue placeholder="Identify Role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                                <SelectItem value="admin" className="rounded-xl font-bold uppercase text-[10px] tracking-widest px-4 py-3">Executive Admin</SelectItem>
                                                <SelectItem value="teacher" className="rounded-xl font-bold uppercase text-[10px] tracking-widest px-4 py-3">Faculty Member</SelectItem>
                                                <SelectItem value="student" className="rounded-xl font-bold uppercase text-[10px] tracking-widest px-4 py-3">Candidate</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px] uppercase font-bold" />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-4">
                                <Button type="submit" className="w-full h-16 rounded-[1.5rem] bg-indigo-600 hover:bg-slate-950 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-100 border-none transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Sparkles className="h-4 w-4 animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Initialize Console <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 justify-center text-center pb-12 opacity-40">
                    <div className="h-px w-10 bg-slate-300" />
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Enterprise Core • Security Standard 2.0</p>
                </CardFooter>
            </Card>
        </div>
    );
}
