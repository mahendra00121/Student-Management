"use client"

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    MoreHorizontal,
    ArrowUpDown,
    Plus,
    Users,
    UserCheck,
    Layers,
    LayoutGrid,
    Eye,
    Edit3,
    Trash2,
    CheckCircle2
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useClasses, ClassItem } from "@/context/class-context"
import { useStudents } from "@/context/student-context"
import { useTeachers } from "@/context/teacher-context"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ClassesPage() {
    const { classes, deleteClass } = useClasses();
    const { students } = useStudents();
    const { teachers } = useTeachers();

    const getStudentCount = (className: string) => {
        return students.filter(s => s.class === className).length;
    };

    const columns: ColumnDef<ClassItem>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="hover:bg-transparent p-0 font-bold text-foreground"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Academic Class
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg border border-primary/20">
                        {row.getValue("name")}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">Grade {row.getValue("name")}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mt-0.5">Academic Unit</span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "sections",
            header: "Divisions / Sections",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1.5">
                    {(row.getValue("sections") as string[]).map(sec => (
                        <Badge key={sec} variant="outline" className="font-bold border-2 px-2 py-0 bg-background">
                            Sec {sec}
                        </Badge>
                    ))}
                </div>
            )
        },
        {
            id: "totalStudents",
            header: "Students Capacity",
            cell: ({ row }) => {
                const count = getStudentCount(row.getValue("name"));
                return (
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono font-bold text-sm">{count}</span>
                    </div>
                );
            }
        },
        {
            accessorKey: "classTeacherName",
            header: "Assigned Coordinator",
            cell: ({ row }) => {
                const teacherId = row.original.classTeacherId;
                const teacher = teachers.find(t => t.id === teacherId);
                const name = teacher ? teacher.name : (row.original.classTeacherName || "Not Assigned");

                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7 border shadow-sm">
                            <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`} />
                            <AvatarFallback className="text-[10px] font-bold">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className={`text-xs font-bold ${name === 'Not Assigned' ? 'text-rose-500 italic' : 'text-foreground'}`}>
                            {name}
                        </span>
                    </div>
                );
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const classItem = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>Class Controls</DropdownMenuLabel>
                            <Link href={`/dashboard/classes/${classItem.id}`}>
                                <DropdownMenuItem className="gap-2">
                                    <Eye className="h-4 w-4" /> View Overview
                                </DropdownMenuItem>
                            </Link>
                            <Link href={`/dashboard/classes/${classItem.id}/edit`}>
                                <DropdownMenuItem className="gap-2">
                                    <Edit3 className="h-4 w-4" /> Modify Config
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 gap-2 focus:text-red-600 cursor-pointer"
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this class?")) {
                                        deleteClass(classItem.id);
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4" /> Remove Class
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return (
        <div className="flex flex-col gap-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">Class Inventory</h1>
                    <p className="text-muted-foreground text-sm font-medium">Configure and manage all academic grades and their respective sections.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="hidden sm:flex gap-2 font-bold rounded-xl border-2">
                        <LayoutGrid className="h-4 w-4" /> Grid View
                    </Button>
                    <Button asChild className="gap-2 font-bold rounded-xl shadow-lg shadow-primary/20 bg-primary">
                        <Link href="/dashboard/classes/new">
                            <Plus className="h-4 w-4" /> New Class
                        </Link>
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <Card className="bg-orange-500/5 border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-orange-600/70">Academic Grades</CardDescription>
                        <CardTitle className="text-2xl font-black">{classes.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-sky-500/5 border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-sky-600/70">Total Sections</CardDescription>
                        <CardTitle className="text-2xl font-black">{classes.reduce((acc, curr) => acc + curr.sections.length, 0)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-emerald-500/5 border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-emerald-600/70">Coordinatored Classes</CardDescription>
                        <CardTitle className="text-2xl font-black">{classes.filter(c => c.classTeacherId).length}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card className="border shadow-xl shadow-muted/50 rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    <DataTable columns={columns} data={classes} searchKey="name" />
                </CardContent>
            </Card>
        </div>
    )
}
