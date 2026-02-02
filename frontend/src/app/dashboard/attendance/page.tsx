"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    CalendarCheck,
    BarChart3,
    Users,
    ArrowRight,
    ShieldCheck,
    History,
    Activity,
    ChevronLeft
} from "lucide-react";

export default function AttendanceMainPage() {
    const modules = [
        {
            title: "Mark Attendance",
            description: "Daily attendance marking for classes and sections. Real-time presence tracking.",
            href: "/dashboard/attendance/mark",
            icon: CalendarCheck,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100/50",
            borderColor: "border-emerald-200/50",
            gradient: "from-emerald-50 to-emerald-100/50",
            roles: ["admin", "teacher"]
        },
        {
            title: "Attendance Intelligence",
            description: "Advanced analytics, monthly trends and automated deviation reporting.",
            href: "/dashboard/attendance/report",
            icon: BarChart3,
            color: "text-blue-600",
            bgColor: "bg-blue-100/50",
            borderColor: "border-blue-200/50",
            gradient: "from-blue-50 to-blue-100/50",
            roles: ["admin"]
        },
        {
            title: "Student Portal",
            description: "Personal attendance history and eligibility tracking for students.",
            href: "/dashboard/attendance/view",
            icon: History,
            color: "text-violet-600",
            bgColor: "bg-violet-100/50",
            borderColor: "border-violet-200/50",
            gradient: "from-violet-50 to-violet-100/50",
            roles: ["admin", "student"]
        }
    ];

    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild className="rounded-full shadow-sm">
                        <Link href="/dashboard">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-0">
                            <div className="p-1.5 bg-primary/10 rounded-lg">
                                <Activity className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Presence Monitoring</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter leading-none">Attendance Management</h1>
                    </div>
                </div>
                <p className="text-muted-foreground font-medium max-w-2xl text-balance pl-14">
                    Advanced ecosystem for managing institutional presence, automated reporting, and student eligibility tracking.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {modules.map((module) => (
                    <Card key={module.href} className={`group relative flex flex-col justify-between overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5`}>
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${module.gradient} blur-3xl -mr-16 -mt-16 group-hover:opacity-100 opacity-50 transition-opacity`} />

                        <CardHeader className="relative z-10">
                            <div className={`w-14 h-14 rounded-2xl ${module.bgColor} border ${module.borderColor} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                                <module.icon className={`h-7 w-7 ${module.color}`} />
                            </div>
                            <CardTitle className="text-xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">{module.title}</CardTitle>
                            <CardDescription className="text-sm font-medium leading-relaxed">{module.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10 pt-4">
                            <Button asChild className="w-full h-11 font-bold rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95 group-hover:bg-primary">
                                <Link href={module.href}>
                                    Initialize <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-muted/30 border-dashed border-2 rounded-3xl overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <CardContent className="p-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border">
                            <ShieldCheck className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Integrated Ecosystem</h4>
                            <p className="text-sm text-muted-foreground font-medium max-w-sm">
                                Presence data is cryptographically verified and automatically synced with Student Reports and Academic Results.
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" className="rounded-xl font-bold border-2">
                        View Documentation
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
