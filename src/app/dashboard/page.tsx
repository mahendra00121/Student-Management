"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { RecentAdmissions } from "@/components/dashboard/recent-admissions";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CalendarDays, LayoutDashboard, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }));
    }, []);

    return (
        <div className="flex flex-col gap-10 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border-none shadow-sm capitalize">
                            <Sparkles className="h-3 w-3 mr-1" /> Executive Command
                        </Badge>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-foreground">
                        Institutional <span className="text-primary">Overview</span>
                    </h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" /> {currentDate}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Session Performance</span>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            <span className="text-lg font-black tracking-tight text-emerald-600">+12.4%</span>
                        </div>
                    </div>
                </div>
            </header>

            <StatsCards />

            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-2 border shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden bg-white/50 backdrop-blur-xl border-white/20">
                    <CardHeader className="p-8 border-b bg-muted/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black tracking-tight">Student Density</CardTitle>
                                <CardDescription className="font-medium">Population distribution across academic grades</CardDescription>
                            </div>
                            <Badge variant="outline" className="rounded-xl border-2 font-black">2026-27 Session</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <OverviewChart />
                    </CardContent>
                </Card>

                <Card className="border shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden bg-white/50 backdrop-blur-xl border-white/20">
                    <CardHeader className="p-8 border-b bg-muted/10">
                        <CardTitle className="text-2xl font-black tracking-tight">Active Presence</CardTitle>
                        <CardDescription className="font-medium">Monthly engagement intensity index</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <AttendanceChart />
                    </CardContent>
                </Card>
            </div>

            <RecentAdmissions />
        </div>
    );
}
