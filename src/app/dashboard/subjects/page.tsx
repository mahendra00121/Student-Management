"use client"

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    MoreHorizontal,
    ArrowUpDown,
    Plus,
    Book,
    GraduationCap,
    CheckCircle2,
    XCircle,
    Eye,
    Edit3,
    Trash2,
    BookOpen,
    Library
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
import { useSubjects, Subject } from "@/context/subject-context"
import { useTeachers } from "@/context/teacher-context"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SubjectsPage() {
    const { subjects, deleteSubject } = useSubjects();
    const { teachers } = useTeachers();

    const columns: ColumnDef<Subject>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="hover:bg-transparent p-0 font-bold text-foreground"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Subject Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
                        <Book className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">{row.getValue("name")}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mt-0.5">Curriculum Dept</span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "class",
            header: "Class Assignment",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-bold border-2 border-primary/20 bg-primary/5 text-primary">
                        Grade {row.original.class}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] font-bold">
                        Sec {row.original.section || "All"}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: "teacherName",
            header: "Faculty Advisor",
            cell: ({ row }) => {
                const teacherId = row.original.teacherId;
                const teacher = teachers.find(t => t.id === teacherId);
                const name = teacher ? teacher.name : (row.original.teacherName || "Not Assigned");

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
            accessorKey: "status",
            header: "Active Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge
                        variant={status === "Active" ? "default" : "destructive"}
                        className="rounded-full px-3 py-0 flex items-center gap-1 w-fit"
                    >
                        {status === "Active" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {status}
                    </Badge>
                )
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const subject = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>Subject Controls</DropdownMenuLabel>
                            <Link href={`/dashboard/subjects/${subject.id}`}>
                                <DropdownMenuItem className="gap-2">
                                    <Library className="h-4 w-4" /> Syllabus Details
                                </DropdownMenuItem>
                            </Link>
                            <Link href={`/dashboard/subjects/${subject.id}/edit`}>
                                <DropdownMenuItem className="gap-2">
                                    <Edit3 className="h-4 w-4" /> Academic Edit
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 gap-2 focus:text-red-600 cursor-pointer"
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this subject?")) {
                                        deleteSubject(subject.id);
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4" /> Retire Subject
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
                    <h1 className="text-3xl font-black tracking-tighter">Course Curriculum</h1>
                    <p className="text-muted-foreground text-sm font-medium">Manage institutional subjects, syllabuses, and teacher assignments.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="hidden sm:flex gap-2 font-bold rounded-xl border-2">
                        <BookOpen className="h-4 w-4" /> Syllabus Repository
                    </Button>
                    <Button asChild className="gap-2 font-bold rounded-xl shadow-lg shadow-primary/20 bg-primary">
                        <Link href="/dashboard/subjects/new">
                            <Plus className="h-4 w-4" /> New Subject
                        </Link>
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <Card className="bg-blue-500/5 border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-blue-600/70">Total Subjects</CardDescription>
                        <CardTitle className="text-2xl font-black">{subjects.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-emerald-500/5 border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-emerald-600/70">Active Courses</CardDescription>
                        <CardTitle className="text-2xl font-black">{subjects.filter(s => s.status === 'Active').length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-violet-500/5 border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-violet-600/70">Grades Covered</CardDescription>
                        <CardTitle className="text-2xl font-black">{Array.from(new Set(subjects.map(s => s.class))).length}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card className="border shadow-xl shadow-muted/50 rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    <DataTable columns={columns} data={subjects} searchKey="name" />
                </CardContent>
            </Card>
        </div>
    )
}
