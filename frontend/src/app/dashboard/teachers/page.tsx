"use client"

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    MoreHorizontal,
    ArrowUpDown,
    Plus,
    UserPlus,
    Phone,
    BookOpen,
    CheckCircle2,
    XCircle,
    Copy,
    Edit3,
    Eye,
    Trash2,
    Users,
    GraduationCap,
    School
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
import { useTeachers, Teacher } from "@/context/teacher-context"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function TeachersPage() {
    const { teachers, deleteTeacher, loading } = useTeachers();

    if (loading) {
        return (
            <div className="flex flex-col gap-6 animate-pulse">
                <div className="h-20 bg-muted rounded-xl" />
                <div className="h-[400px] bg-muted rounded-2xl" />
            </div>
        );
    }

    const columns: ColumnDef<Teacher>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="hover:bg-transparent p-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Teacher Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const teacher = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                            <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${teacher.name}`} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{teacher.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm tracking-tight">{teacher.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mt-0.5">EMP ID: {teacher.employeeId}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "subjects",
            header: "Subjects",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {(row.getValue("subjects") as string[]).map(subject => (
                        <Badge key={subject} variant="outline" className="text-[10px] font-bold px-1.5 py-0 border-primary/20 bg-primary/5">
                            {subject}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "classes",
            header: "Assigned Classes",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <School className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium">{(row.getValue("classes") as string[]).join(", ")}</span>
                </div>
            ),
        },
        {
            accessorKey: "phone",
            header: "Contact",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span className="text-xs font-medium">{row.getValue("phone")}</span>
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
                const teacher = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>Teacher Management</DropdownMenuLabel>
                            <DropdownMenuItem
                                className="gap-2"
                                onClick={() => {
                                    navigator.clipboard.writeText(teacher.employeeId);
                                }}
                            >
                                <Copy className="h-4 w-4" /> Copy Emp ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Link href={`/dashboard/teachers/${teacher.id}`}>
                                <DropdownMenuItem className="gap-2">
                                    <Eye className="h-4 w-4" /> View Portfolio
                                </DropdownMenuItem>
                            </Link>
                            <Link href={`/dashboard/teachers/${teacher.id}/edit`}>
                                <DropdownMenuItem className="gap-2">
                                    <Edit3 className="h-4 w-4" /> Update Record
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 gap-2 focus:text-red-600 cursor-pointer"
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this teacher?")) {
                                        deleteTeacher(teacher.id);
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
        <div className="flex flex-col gap-3">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                <div>
                    <h1 className="text-lg font-bold tracking-tight uppercase">Faculty Management</h1>
                    <p className="text-muted-foreground text-[10px] font-bold opacity-70">Coordinate and manage institutional teaching staff and their assignments.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="hidden sm:flex gap-2 font-bold rounded-xl border-2">
                        <Users className="h-4 w-4" /> Team View
                    </Button>
                    <Button asChild className="gap-2 font-bold rounded-xl shadow-lg shadow-primary/20 bg-primary">
                        <Link href="/dashboard/teachers/new">
                            <Plus className="h-4 w-4" /> Add Teacher
                        </Link>
                    </Button>
                </div>
            </header>


            <Card className="border shadow-xl shadow-muted/50 rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    <DataTable columns={columns} data={teachers} searchKey="name" />
                </CardContent>
            </Card>
        </div>
    )
}
