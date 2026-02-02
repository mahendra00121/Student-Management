import { LucideIcon } from "lucide-react";
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    CreditCard,
    GraduationCap,
    ClipboardList,
    Settings2,
    School,
    BookOpen,
    Trophy,
    FileBarChart,
    Activity,
    Banknote
} from "lucide-react";

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

export const navItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Students",
        href: "/dashboard/students",
        icon: Users,
    },
    {
        title: "Teachers",
        href: "/dashboard/teachers",
        icon: GraduationCap,
    },
    {
        title: "Classes",
        href: "/dashboard/classes",
        icon: School,
    },
    {
        title: "Subjects",
        href: "/dashboard/subjects",
        icon: BookOpen,
    },
    {
        title: "Attendance",
        href: "/dashboard/attendance",
        icon: Activity,
    },
    {
        title: "Fees & Finance",
        href: "/dashboard/fees",
        icon: Banknote,
    },
    {
        title: "Examinations",
        href: "/dashboard/exams",
        icon: ClipboardList,
    },
    {
        title: "Results",
        href: "/dashboard/results",
        icon: Trophy,
    },
    {
        title: "Reports",
        href: "/dashboard/reports",
        icon: FileBarChart,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings2,
    },
];
