import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    CalendarCheck,
    FileText,
    CreditCard,
    BarChart,
    Settings,
    School,
    ClipboardList
} from "lucide-react";

export interface NavItem {
    title: string;
    href: string;
    icon: any;
    roles: string[];
}

export const navItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["admin", "teacher", "student"],
    },
    {
        title: "Students",
        href: "/dashboard/students",
        icon: Users,
        roles: ["admin", "teacher"],
    },
    {
        title: "Teachers",
        href: "/dashboard/teachers",
        icon: GraduationCap,
        roles: ["admin"],
    },
    {
        title: "Classes",
        href: "/dashboard/classes",
        icon: School,
        roles: ["admin", "teacher"],
    },
    {
        title: "Subjects",
        href: "/dashboard/subjects",
        icon: BookOpen,
        roles: ["admin"],
    },
    {
        title: "Attendance",
        href: "/dashboard/attendance",
        icon: CalendarCheck,
        roles: ["admin", "teacher", "student"],
    },
    {
        title: "Exams",
        href: "/dashboard/exams",
        icon: ClipboardList,
        roles: ["admin", "teacher"],
    },
    {
        title: "Results",
        href: "/dashboard/results",
        icon: FileText,
        roles: ["admin", "teacher", "student"],
    },
    {
        title: "Fees",
        href: "/dashboard/fees",
        icon: CreditCard,
        roles: ["admin", "student"],
    },
    {
        title: "Reports",
        href: "/dashboard/reports",
        icon: BarChart,
        roles: ["admin"],
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        roles: ["admin"],
    },
];
