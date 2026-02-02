"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    CreditCard,
    Settings2,
    UserCircle2,
    ArrowRight,
    TrendingUp,
    Landmark,
    BadgeCent,
    ShieldCheck,
    Receipt,
    Wallet,
    PieChart,
    Banknote,
    Activity,
    ChevronLeft
} from "lucide-react";
import { useFees } from "@/context/fee-context";

export default function FeesDashboard() {
    const { studentFeeRecords } = useFees();

    const totalExpected = studentFeeRecords.reduce((acc, r) => acc + r.totalFee, 0);
    const totalCollected = studentFeeRecords.reduce((acc, r) => acc + r.paidAmount, 0);
    const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;

    const cards = [
        {
            title: "Fee Configuration",
            desc: "Architect the financial structure of grades, terms, and auxiliary costs.",
            href: "/dashboard/fees/structure",
            icon: Settings2,
            color: "text-blue-600",
            bgColor: "bg-blue-100/50",
            borderColor: "border-blue-200/50",
            gradient: "from-blue-50 to-blue-100/50",
            roles: ["admin"]
        },
        {
            title: "Institutional Collections",
            desc: "Comprehensive ledger for student payments, receivables, and real-time processing.",
            href: "/dashboard/fees/students",
            icon: BadgeCent,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100/50",
            borderColor: "border-emerald-200/50",
            gradient: "from-emerald-50 to-emerald-100/50",
            roles: ["admin"]
        },
        {
            title: "Personal Ledger",
            desc: "Isolated view of personal financial obligations and historical transactions.",
            href: "/dashboard/fees/view",
            icon: UserCircle2,
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
                                <Banknote className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Financial Operations</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-balance leading-none">Institutional Finance Management</h1>
                    </div>
                </div>
                <p className="text-muted-foreground font-medium max-w-2xl text-balance pl-14">
                    Orchestrate institutional revenue, monitor collection trajectories, and manage diverse fee protocols across the academy.
                </p>
            </header>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <Card key={card.href} className="group relative flex flex-col justify-between overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 rounded-3xl">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} blur-3xl -mr-16 -mt-16 group-hover:opacity-100 opacity-50 transition-opacity`} />

                        <CardHeader className="relative z-10">
                            <div className={`w-14 h-14 rounded-2xl ${card.bgColor} border border-muted/20 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                                <card.icon className={`h-7 w-7 ${card.color}`} />
                            </div>
                            <CardTitle className="text-xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">{card.title}</CardTitle>
                            <CardDescription className="text-sm font-medium leading-relaxed min-h-[48px]">{card.desc}</CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10 pt-4">
                            <Button asChild className="w-full h-12 font-bold rounded-2xl shadow-lg shadow-primary/10 transition-all active:scale-95 group-hover:bg-primary">
                                <Link href={card.href}>
                                    Open Terminal <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex items-center justify-center gap-4 py-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
                <div className="flex items-center gap-1">
                    <Receipt className="h-4 w-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Invoicing Active</span>
                </div>
                <div className="h-1 w-1 bg-muted-foreground rounded-full" />
                <div className="flex items-center gap-1">
                    <Activity className="h-4 w-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Live Audit</span>
                </div>
                <div className="h-1 w-1 bg-muted-foreground rounded-full" />
                <div className="flex items-center gap-1">
                    <PieChart className="h-4 w-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Fiscal Reporting</span>
                </div>
            </div>
        </div>
    );
}
