"use client";

import { useStudents } from "@/context/student-context"; // Check this path - assumed correct
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, Phone, MapPin, BadgeCheck, FileText, CreditCard, ArrowLeft } from "lucide-react";

export default function StudentDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { getStudent } = useStudents();
    const id = params.id as string;

    // We get student from context synchronously since it is client side context
    const student = getStudent(id);

    if (!student) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <h1 className="text-2xl font-bold">Student Not Found</h1>
                <p>The student with ID {id} does not exist.</p>
                <Button onClick={() => router.push("/dashboard/students")}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 no-print">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to List
                </Button>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={`/avatars/${student.id}.png`} />
                        <AvatarFallback className="text-xl">{student.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
                        <p className="text-muted-foreground">Roll No: {student.rollNo} • Class {student.class}-{student.section}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/dashboard/students/${id}/edit`)}>Edit Profile</Button>
                </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="results">Exams & Results</TabsTrigger>
                    <TabsTrigger value="fees">Fees</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Detailed profile information of the student.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                                <p>{student.name}</p>
                            </div>
                            <div className="grid gap-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
                                {/* Handle Date object or string specifically */}
                                <p className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    {student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}
                                </p>
                            </div>
                            <div className="grid gap-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
                                <p className="capitalize">{student.gender || "N/A"}</p>
                            </div>
                            <div className="grid gap-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Contact Number</h3>
                                <p className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    {student.phone}
                                </p>
                            </div>
                            <div className="grid gap-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Parent Name</h3>
                                <p>{student.parentName || "N/A"}</p>
                            </div>
                            <div className="grid gap-1">
                                <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                                <p className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    {student.address || "N/A"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="attendance" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Record</CardTitle>
                            <CardDescription>Monthly attendance overview.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-48 text-muted-foreground">
                                <BadgeCheck className="mr-2 h-6 w-6" />
                                No attendance records found for this academic year.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="results" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Examination Results</CardTitle>
                            <CardDescription>Recent exam performance and grades.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-48 text-muted-foreground">
                                <FileText className="mr-2 h-6 w-6" />
                                No exam results published yet.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="fees" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fee Status</CardTitle>
                            <CardDescription>Tuition and other fee details.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-48 text-muted-foreground">
                                <CreditCard className="mr-2 h-6 w-6" />
                                No pending fees.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
