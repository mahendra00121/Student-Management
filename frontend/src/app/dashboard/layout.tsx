"use client";

import { Sidebar } from "../../components/layout/sidebar";
import { Header } from "../../components/layout/header";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={cn(
            "grid h-screen w-full transition-all duration-500 ease-in-out overflow-hidden bg-slate-50",
            isCollapsed
                ? "md:grid-cols-[80px_1fr] lg:grid-cols-[80px_1fr]"
                : "md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]"
        )}>
            <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            <div className="flex flex-col h-screen overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6 no-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
