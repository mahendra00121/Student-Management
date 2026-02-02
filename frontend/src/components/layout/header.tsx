"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Search,
    Menu,
    Bell,
    User,
    LogOut,
    School,
    Sparkles,
    ChevronRight,
    Settings2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { navItems, NavItem } from "../../lib/nav-items";
import { cn } from "@/lib/utils";

export function Header() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="flex h-12 shrink-0 items-center gap-4 border-b bg-muted/40 px-4 lg:h-14 lg:px-6">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-white border-2 rounded-xl shadow-sm">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0 w-80 border-r-0">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <SheetDescription className="sr-only">Access different modules of the EduNexus ERP system.</SheetDescription>

                    {/* Brand Header */}
                    <div className="flex h-20 items-center px-6 border-b border-slate-100 bg-white">
                        <Link href="/dashboard" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                <School className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-slate-900 tracking-tighter text-lg leading-tight uppercase">EduNexus</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Enterprise</span>
                                    <Badge className="h-4 px-1.5 text-[8px] bg-primary text-white border-none shadow-sm font-black uppercase">PRO</Badge>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto py-6 no-scrollbar">
                        <div className="px-4 mb-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-3">Main Console</span>
                        </div>
                        <nav className="grid gap-1 px-3">
                            {navItems.map((item: NavItem) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "group flex items-center rounded-xl p-3 text-sm font-bold transition-all relative overflow-hidden",
                                            isActive
                                                ? "text-primary bg-primary/5 shadow-sm border border-primary/10"
                                                : "text-slate-500 hover:text-primary hover:bg-slate-50",
                                            "gap-3"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                        )}
                                        <Icon className={cn(
                                            "h-5 w-5 min-w-5",
                                            isActive ? "text-primary" : "text-slate-400"
                                        )} />
                                        <span className="tracking-tight">{item.title}</span>
                                        {isActive && (
                                            <ChevronRight className="ml-auto h-4 w-4 text-primary opacity-50" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Efficiency Card in Mobile Menu */}
                        <div className="mt-8 px-4 mb-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-3">Advanced Metrics</span>
                        </div>
                        <div className="px-6 space-y-4">
                            <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 relative overflow-hidden group/card shadow-sm">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-xl -mr-8 -mt-8" />
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
                    </div>

                    {/* Mobile Footer User Section */}
                    <div className="p-4 border-t border-slate-100 bg-white">
                        <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50/50 border border-slate-100">
                            <Avatar className="h-10 w-10 min-w-10 border-2 border-white shadow-md ring-1 ring-slate-100">
                                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                                <AvatarFallback className="bg-primary/10 text-primary font-black">AD</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm font-black text-slate-900 truncate leading-none mb-1 uppercase tracking-tight">Institutional Admin</span>
                                <span className="text-[10px] font-bold text-slate-400 truncate tracking-tight underline underline-offset-4 decoration-slate-200">admin@edunexus.edu</span>
                            </div>
                            <LogOut className="h-4 w-4 text-slate-400 hover:text-rose-500 transition-colors" />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1 hidden sm:block">
                <form>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search records..."
                            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3 rounded-xl border-2"
                        />
                    </div>
                </form>
            </div>
            <div className="flex-1 sm:hidden">
                {/* Mobile Identity */}
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <School className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-black tracking-tighter uppercase text-sm italic">EduNexus</span>
                </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
                <Button variant="outline" size="icon" className="h-9 w-9 border-2 rounded-xl">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Toggle notifications</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-xl h-9 w-9 border-2 shadow-sm">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-2 w-48">
                        <DropdownMenuLabel className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">My Identity</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 font-bold"><User className="h-4 w-4" /> Portfolio</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 font-bold"><Settings2 className="h-4 w-4" /> Preferences</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Link href="/login" className="w-full">
                            <DropdownMenuItem className="text-destructive gap-2 font-black uppercase text-xs tracking-tighter">
                                <LogOut className="h-4 w-4" /> Secure Logout
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
