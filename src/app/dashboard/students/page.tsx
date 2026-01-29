"use client"

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    MoreHorizontal,
    ArrowUpDown,
    Plus,
    User,
    Phone,
    GraduationCap,
    CheckCircle2,
    XCircle,
    Copy,
    Edit3,
    Eye,
    Trash2
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStudents, Student } from "@/context/student-context"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function StudentsPage() {
    const { students, deleteStudent } = useStudents();

    const columns: ColumnDef<Student>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="hover:bg-transparent p-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Student Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const student = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{student.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm tracking-tight">{student.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mt-0.5">ID: {student.id.slice(0, 8)}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "rollNo",
            header: "Roll No",
            cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("rollNo")}</span>
        },
        {
            accessorKey: "class",
            header: "Class & Section",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-bold border-primary/20 text-primary">
                        {row.original.class}-{row.original.section}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: "phone",
            header: "Contact",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span className="text-xs">{row.getValue("phone")}</span>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
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
                const student = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                className="gap-2"
                                onClick={() => {
                                    navigator.clipboard.writeText(student.id);
                                }}
                            >
                                <Copy className="h-4 w-4" /> Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Link href={`/dashboard/students/${student.id}`}>
                                <DropdownMenuItem className="gap-2">
                                    <Eye className="h-4 w-4" /> View Profile
                                </DropdownMenuItem>
                            </Link>
                            <Link href={`/dashboard/students/${student.id}/edit`}>
                                <DropdownMenuItem className="gap-2">
                                    <Edit3 className="h-4 w-4" /> Edit Record
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 gap-2 focus:text-red-600 cursor-pointer"
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this student?")) {
                                        deleteStudent(student.id);
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4" /> Delete
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
                    <h1 className="text-3xl font-black tracking-tighter">Student Directory</h1>
                    <p className="text-muted-foreground text-sm font-medium">Manage and monitor all students registered in the academy.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="hidden sm:flex gap-2 font-bold rounded-xl border-2">
                        <GraduationCap className="h-4 w-4" /> Bulk Upload
                    </Button>
                    <Button asChild className="gap-2 font-bold rounded-xl shadow-lg shadow-primary/20 bg-primary">
                        <Link href="/dashboard/students/new">
                            <Plus className="h-4 w-4" /> Enrollment
                        </Link>
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <Card className="bg-primary/5 border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-primary/70">Total Strength</CardDescription>
                        <CardTitle className="text-2xl font-black">{students.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-green-500/5 border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-green-600/70">Active Students</CardDescription>
                        <CardTitle className="text-2xl font-black">{students.filter(s => s.status === 'Active').length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-orange-500/5 border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-orange-600/70">Inactive Students</CardDescription>
                        <CardTitle className="text-2xl font-black">{students.filter(s => s.status !== 'Active').length}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card className="border shadow-xl shadow-muted/50 rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    <DataTable columns={columns} data={students} searchKey="name" />
                </CardContent>
            </Card>
        </div>
    )
}
