import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Users,
    GraduationCap,
    School,
    CreditCard,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    Activity,
    Users2,
    Landmark,
    Target
} from "lucide-react";

const stats = [
    {
        title: "Total Students",
        value: "1,234",
        desc: "Active enrollments",
        trend: "+20.1%",
        trendUp: true,
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-600/10",
        accent: "bg-blue-600",
        path: "M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5z"
    },
    {
        title: "Total Teachers",
        value: "145",
        desc: "Faculty staff",
        trend: "+3 new",
        trendUp: true,
        icon: GraduationCap,
        color: "text-purple-600",
        bg: "bg-purple-600/10",
        accent: "bg-purple-600",
    },
    {
        title: "Total Classes",
        value: "32",
        desc: "Primary & Secondary",
        trend: "Stable",
        trendUp: true,
        icon: School,
        color: "text-indigo-600",
        bg: "bg-indigo-600/10",
        accent: "bg-indigo-600",
    },
    {
        title: "Collected Fees",
        value: "₹45.2k",
        desc: "Current month",
        trend: "+12.5%",
        trendUp: true,
        icon: CreditCard,
        color: "text-emerald-600",
        bg: "bg-emerald-600/10",
        accent: "bg-emerald-600",
    },
];

export function StatsCards() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <Card key={i} className="group relative overflow-hidden border-none shadow-xl shadow-primary/5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 rounded-[2rem] bg-gradient-to-br from-white to-muted/20">
                    <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-3xl -mr-16 -mt-16 opacity-50 transition-transform group-hover:scale-150 duration-700`} />

                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 border border-white/50 backdrop-blur-sm shadow-sm`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div className={`h-1.5 w-12 rounded-full ${stat.accent}/20 overflow-hidden`}>
                            <div className={`h-full ${stat.accent} transition-all duration-1000 w-[70%] group-hover:w-[90%]`} />
                        </div>
                    </CardHeader>

                    <CardContent className="relative z-10">
                        <div className="flex flex-col gap-1">
                            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">{stat.title}</CardDescription>
                            <div className="flex items-baseline justify-between mt-1">
                                <span className="text-4xl font-black tracking-tight tracking-tighter">{stat.value}</span>
                                <div className={`flex items-center text-[10px] font-black px-2 py-1 rounded-lg border shadow-sm ${stat.trendUp ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50' : 'bg-rose-50 text-rose-700 border-rose-100/50'}`}>
                                    {stat.trendUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                    {stat.trend}
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-4 font-bold flex items-center justify-between group-hover:text-primary transition-colors">
                            {stat.desc}
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="h-5 w-5 rounded-full border-2 border-white bg-muted flex items-center justify-center overflow-hidden scale-75 group-hover:scale-100 transition-transform duration-500">
                                        <div className={`w-full h-full ${stat.bg} opacity-50`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
