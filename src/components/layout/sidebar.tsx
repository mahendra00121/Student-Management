"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav-items";
import { School, Sparkles, ChevronRight, LogOut, User, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className={cn(
            "hidden border-r bg-white md:block relative group/sidebar transition-all duration-500 ease-in-out",
            isCollapsed ? "w-[80px]" : "w-full"
        )}>
            {/* Collapse Toggle Button - As per user's image */}
            <Button
                onClick={onToggle}
                variant="outline"
                size="icon"
                className={cn(
                    "absolute -right-4 top-10 z-50 h-8 w-8 rounded-full border border-slate-200 bg-white shadow-xl hover:bg-slate-50 transition-all duration-500",
                    isCollapsed ? "rotate-180" : "rotate-0"
                )}
            >
                <ChevronLeft className="h-4 w-4 text-slate-600" />
            </Button>

            {/* Background Decorative Gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(99,102,241,0.03)_0,transparent_50%)]" />

            <div className="flex h-full flex-col relative z-10">
                {/* Brand Header */}
                <div className={cn(
                    "flex h-20 items-center border-b border-slate-100 transition-all duration-500",
                    isCollapsed ? "px-4 justify-center" : "px-6"
                )}>
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 min-w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                            <School className="h-6 w-6 text-white" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
                                <span className="font-black text-slate-900 tracking-tighter text-lg leading-tight uppercase whitespace-nowrap">EduNexus</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Enterprise</span>
                                    <Badge className="h-4 px-1.5 text-[8px] bg-primary text-white border-none shadow-sm font-black uppercase">PRO</Badge>
                                </div>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-8 no-scrollbar scroll-smooth">
                    {!isCollapsed && (
                        <div className="px-4 mb-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-3">Main Console</span>
                        </div>
                    )}
                    <nav className={cn("grid gap-1 px-3")}>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center rounded-xl p-3 text-sm font-bold transition-all duration-300 relative overflow-hidden",
                                        isActive
                                            ? "text-primary bg-primary/5 shadow-sm border border-primary/10"
                                            : "text-slate-500 hover:text-primary hover:bg-slate-50",
                                        isCollapsed ? "justify-center" : "gap-3"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
                                    )}
                                    <Icon className={cn(
                                        "h-5 w-5 min-w-5 transition-transform duration-300 group-hover:scale-110",
                                        isActive ? "text-primary" : "text-slate-400"
                                    )} />
                                    {!isCollapsed && (
                                        <span className="tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">{item.title}</span>
                                    )}
                                    {!isCollapsed && isActive && (
                                        <ChevronRight className="ml-auto h-4 w-4 text-primary opacity-50" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {!isCollapsed && (
                        <>
                            <div className="mt-8 px-4 mb-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-3">Advanced Metrics</span>
                            </div>
                            <div className="px-6 space-y-4">
                                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 relative overflow-hidden group/card shadow-sm">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-xl -mr-8 -mt-8 transition-transform group-hover/card:scale-150" />
                                    <div className="flex items-center gap-2 mb-2 relative z-10">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">System Health</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden relative z-10">
                                        <div className="h-full w-[94%] bg-gradient-to-r from-indigo-500 to-primary" />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-500 mt-2 block uppercase tracking-tighter relative z-10">94% Efficiency Achieved</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar Footer User Section */}
                <div className={cn(
                    "p-4 border-t border-slate-100 bg-white transition-all duration-500",
                    isCollapsed ? "flex justify-center" : ""
                )}>
                    <div className={cn(
                        "flex items-center rounded-2xl transition-all hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100",
                        isCollapsed ? "p-1" : "gap-3 p-2"
                    )}>
                        <Avatar className="h-10 w-10 min-w-10 border-2 border-white shadow-md ring-1 ring-slate-100">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                            <AvatarFallback className="bg-primary/10 text-primary font-black">AD</AvatarFallback>
                        </Avatar>
                        {!isCollapsed && (
                            <div className="flex flex-col flex-1 min-w-0 animate-in fade-in slide-in-from-left-2">
                                <span className="text-sm font-black text-slate-900 truncate leading-none mb-1 uppercase tracking-tight">Institutional Admin</span>
                                <span className="text-[10px] font-bold text-slate-400 truncate tracking-tight underline underline-offset-4 decoration-slate-200">admin@edunexus.edu</span>
                            </div>
                        )}
                        {!isCollapsed && <LogOut className="h-4 w-4 text-slate-400 hover:text-rose-500 transition-colors shrink-0" />}
                    </div>
                </div>
            </div>
        </div>
    );
}
