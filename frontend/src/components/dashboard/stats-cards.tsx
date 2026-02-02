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
} from "lucide-react";
import { useStudents } from "@/context/student-context";
import { useTeachers } from "@/context/teacher-context";
import { useClasses } from "@/context/class-context";
import { useFees } from "@/context/fee-context";

export function StatsCards() {
    const { students } = useStudents();
    const { teachers } = useTeachers();
    const { classes } = useClasses();
    const { studentFeeRecords } = useFees();

    const totalCollected = studentFeeRecords.reduce((acc, r) => acc + r.paidAmount, 0);

    const stats = [
        {
            title: "Total Students",
            value: students.length.toString(),
            desc: "Active enrollments",
            trend: "+10.1%",
            trendUp: true,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-600/10",
            accent: "bg-blue-600",
        },
        {
            title: "Total Teachers",
            value: teachers.length.toString(),
            desc: "Faculty staff",
            trend: "+2.5%",
            trendUp: true,
            icon: GraduationCap,
            color: "text-purple-600",
            bg: "bg-purple-600/10",
            accent: "bg-purple-600",
        },
        {
            title: "Total Classes",
            value: classes.length.toString(),
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
            value: `₹${(totalCollected / 1000).toFixed(1)}k`,
            desc: "Cumulative total",
            trend: "+12.5%",
            trendUp: true,
            icon: CreditCard,
            color: "text-emerald-600",
            bg: "bg-emerald-600/10",
            accent: "bg-emerald-600",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <Card key={i} className="group relative overflow-hidden border-none shadow-xl shadow-primary/5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 rounded-3xl bg-gradient-to-br from-white to-muted/20">
                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-3xl -mr-12 -mt-12 opacity-50 transition-transform group-hover:scale-150 duration-700`} />

                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-5 relative z-10">
                        <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 border border-white/50 backdrop-blur-sm shadow-sm`}>
                            <stat.icon className="h-4 w-4" />
                        </div>
                        <div className={`h-1 w-10 rounded-full ${stat.accent}/20 overflow-hidden`}>
                            <div className={`h-full ${stat.accent} transition-all duration-1000 w-[70%] group-hover:w-[90%]`} />
                        </div>
                    </CardHeader>

                    <CardContent className="relative z-10 px-5 pb-4">
                        <div className="flex flex-col gap-0.5">
                            <CardDescription className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/80">{stat.title}</CardDescription>
                            <div className="flex items-center justify-between mt-0.5">
                                <span className="text-2xl font-black tracking-tighter">{stat.value}</span>
                                <div className={`flex items-center text-[8px] font-black px-1.5 py-0.5 rounded-md border shadow-sm ${stat.trendUp ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50' : 'bg-rose-50 text-rose-700 border-rose-100/50'}`}>
                                    {stat.trendUp ? <TrendingUp className="h-2.5 w-2.5 mr-1" /> : <TrendingDown className="h-2.5 w-2.5 mr-1" />}
                                    {stat.trend}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
