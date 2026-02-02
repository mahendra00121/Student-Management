"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Users,
  CalendarCheck,
  ClipboardList,
  FileText,
  CreditCard,
  BarChart3,
  Settings2,
  ArrowRight,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  School,
  GraduationCap,
  Sparkles,
  MousePointer2,
  Check
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "Student Intelligence",
      description: "Comprehensive behavioral analytics, enrollment heatmaps, and digital records with encrypted credentialing.",
      icon: Users,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Automated Attendance",
      description: "Neural-link QR biometric systems or manual logs with instant SMS triggers to guardian networks.",
      icon: CalendarCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Pedagogical Planning",
      description: "AI-assisted scheduling for dual-shift institutions and complex subject-teacher mapped matrices.",
      icon: ClipboardList,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Dynamic Evaluation",
      description: "Generative marksheets with percentile benchmarking and customizable grading logic for any curriculum.",
      icon: FileText,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      title: "Fiscal Governance",
      description: "Transparent ledger systems, micro-payment support, and automated reconciliation for complex fee structures.",
      icon: CreditCard,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Strategic Analytics",
      description: "Decision-ready dashboards visualizing financial churn, class performance, and operational efficiency.",
      icon: BarChart3,
      color: "text-sky-500",
      bg: "bg-sky-500/10",
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-950 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* --- PREMIUM AMBIENCE --- */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[600px] bg-indigo-500/5 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[500px] bg-sky-500/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-slate-950 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-indigo-600 transition-colors duration-500">
              <School className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none italic uppercase">EduNexus</span>
              <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Enterprise ERP</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-12">
            {['Platforms', 'Solutions', 'Global Network', 'Security'].map((item) => (
              <Link key={item} href="#" className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 transition-colors relative group/link">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover/link:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <Link href="/login" className="hidden sm:block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-950 transition-colors px-2">
              Log In
            </Link>
            <Button asChild className="bg-indigo-600 hover:bg-slate-950 text-white rounded-xl px-10 h-12 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-100 border-none transition-all hover:scale-[1.05] active:scale-95 group">
              <Link href="/login" className="flex items-center gap-2">
                Initialize System <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-fade-in">
              <Sparkles className="h-3 w-3 animate-pulse" /> The Standard in School ERM 2.0
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">
              Orchestrate <br />
              <span className="text-indigo-600 opacity-90 italic">Everything.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-slate-500 text-base md:text-xl mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 fill-mode-both">
              A hyper-integrated platform for visionary institutions. Manage students, academics, and finances through a single, stunning interface.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-14 duration-1000 delay-300 fill-mode-both">
              <Button size="lg" className="h-16 lg:h-20 px-10 lg:px-12 text-lg lg:text-xl font-black rounded-2xl bg-slate-950 hover:bg-slate-900 group shadow-2xl shadow-slate-200" asChild>
                <Link href="/login">
                  Launch Console <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
              <div className="flex items-center gap-6 p-1 bg-white border border-slate-100 rounded-[2rem] pr-8 shadow-sm">
                <div className="flex -space-x-3 pl-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-left py-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Global Trust</div>
                  <div className="text-sm font-black text-slate-800">1,200+ Systems Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* --- HERO SHOWCASE IMAGE --- */}
          <div className="max-w-5xl mx-auto mt-20 px-6 relative animate-in zoom-in-95 duration-1000 delay-500 fill-mode-both">
            <div className="relative rounded-[3rem] overflow-hidden border-[12px] border-white shadow-[0_32px_120px_-20px_rgba(0,0,0,0.15)] group">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000"
                alt="Dashboard Preview"
                className="w-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Floating Tags over image */}
            <div className="absolute top-20 -left-10 lg:-left-20 animate-float-slow hidden lg:block">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black"><Users className="h-5 w-5" /></div>
                  <div className="text-left">
                    <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none">CANDIDATES</div>
                    <div className="text-base font-black text-slate-800 tracking-tight">2,482 Enrolled</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CORE CAPABILITIES --- */}
        <section className="py-16 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {features.map((feature, idx) => (
                <div key={idx} className="group p-10 rounded-[3rem] border border-slate-50 hover:bg-slate-50/50 transition-all duration-500 hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.05)]">
                  <div className={`w-20 h-20 rounded-3xl ${feature.bg} ${feature.color} flex items-center justify-center mb-10 group-hover:-rotate-12 transition-transform duration-700`}>
                    <feature.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium text-base">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- ENTERPRISE STATUS --- */}
        <section className="py-24 bg-slate-950 text-white rounded-[3rem] lg:rounded-[4rem] mx-4 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 blur-[200px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="max-w-7xl mx-auto px-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <div className="space-y-12">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.2]">
                  Architected for <br />
                  <span className="text-indigo-500 italic">Visionaries.</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: "Institutional Security", desc: "Military-grade data encryption standards.", icon: ShieldCheck },
                    { label: "Neural Speed", desc: "Experience 12ms latency across global nodes.", icon: Zap }
                  ].map((item, i) => (
                    <div key={i} className="space-y-4 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 hover:bg-white/10 transition-colors">
                      <item.icon className="h-8 w-8 text-indigo-400" />
                      <div className="space-y-1">
                        <div className="text-xl font-bold">{item.label}</div>
                        <div className="text-sm text-slate-400 font-medium">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <div className="bg-indigo-600/20 absolute inset-0 blur-[120px] rounded-full group-hover:scale-110 transition-transform duration-1000" />
                <div className="relative bg-white/10 backdrop-blur-3xl border border-white/10 p-10 rounded-[4rem] shadow-2xl overflow-hidden scale-100 hover:scale-[1.02] transition-transform duration-700">
                  <div className="bg-white rounded-[2.5rem] p-12 text-slate-900 min-h-[500px] flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-indigo-50 border-4 border-white shadow-sm flex items-center justify-center text-indigo-600 text-xl font-black italic uppercase italic">EX</div>
                        <div className="text-left font-black">
                          <div className="text-lg tracking-tight uppercase italic">Anya Sharma</div>
                          <div className="text-[10px] text-indigo-500/60 uppercase tracking-[0.3em]">Grade 12-B • Senior Elite</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 flex-1 pt-10">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 font-bold uppercase">Performance Radar</span>
                        <div className="bg-emerald-500 px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest">Global Top 1%</div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">GPA AVG</div>
                          <div className="text-5xl font-black tracking-tighter text-indigo-600">4.92</div>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-bold uppercase tracking-[0.2em]">Attendance</div>
                          <div className="text-5xl font-black tracking-tighter text-slate-800">100%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- GLOBAL CALL --- */}
        <section className="py-24 text-center px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight">The Future is <br /><span className="text-indigo-600 italic">Enterprise.</span></h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <Button size="lg" className="h-20 px-12 text-xl font-black rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all hover:scale-105" asChild>
                <Link href="/login">Initialize Access</Link>
              </Button>
              <Button variant="outline" size="lg" className="h-20 px-12 text-xl font-black rounded-[2rem] border-2 border-slate-200 hover:bg-slate-50 transition-all">Schedule Keynote</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-20 opacity-80">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <School className="h-6 w-6 text-indigo-600" />
              <span className="text-2xl font-black uppercase tracking-tighter italic">EduNexus</span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">Defining institutional excellence through precision engineering and advanced user experience.</p>
          </div>
          {['Product', 'Intelligence', 'Corporate', 'Governance'].map((col) => (
            <div key={col} className="space-y-8">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">{col}</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-400 uppercase tracking-widest text-[11px]">
                {['Registry', 'Ledger', 'Security', 'Compliance'].map(link => (
                  <li key={link}><Link href="#" className="hover:text-indigo-600 transition-colors uppercase italic">{link}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, className }: { children: ReactNode, variant?: string, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600 ${className}`}>
      {children}
    </span>
  );
}
