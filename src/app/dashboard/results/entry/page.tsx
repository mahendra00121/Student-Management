"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useClasses } from "@/context/class-context";
import { useStudents } from "@/context/student-context";
import { useExams } from "@/context/exam-context";
import { useSubjects } from "@/context/subject-context";
import { useResults } from "@/context/result-context";
import { Save, Loader2, Landmark, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MarksEntryPage() {
    const router = useRouter();
    const { classes } = useClasses();
    const { students } = useStudents();
    const { exams } = useExams();
    const { subjects } = useSubjects();
    const { results, upsertResults } = useResults() as any; // Using any for extended provider hack

    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedSection, setSelectedSection] = useState<string>("");
    const [selectedExam, setSelectedExam] = useState<string>("");
    const [selectedSubject, setSelectedSubject] = useState<string>("");

    const [studentsList, setStudentsList] = useState<any[]>([]);
    const [marksData, setMarksData] = useState<Record<string, number>>({});
    const [maxMarks, setMaxMarks] = useState<number>(100);

    const handleLoadStudents = () => {
        if (!selectedClass || !selectedExam || !selectedSubject) {
            alert("Please select Class, Exam and Subject");
            return;
        }

        const filtered = students.filter(s =>
            s.class === selectedClass &&
            (selectedSection ? s.section === selectedSection : true)
        );

        setStudentsList(filtered);

        // Pre-fill existing marks if any
        const newData: Record<string, number> = {};
        filtered.forEach(student => {
            const existingResult = results.find((r: any) =>
                r.studentId === student.id && r.examId === selectedExam
            );
            const subMark = existingResult?.marks.find((m: any) => m.subjectId === selectedSubject);
            if (subMark) {
                newData[student.id] = subMark.marksObtained;
            } else {
                newData[student.id] = 0;
            }
        });
        setMarksData(newData);

        // Find max marks from exam schedule if available
        const examObj = exams.find(e => e.id === selectedExam);
        const examSub = examObj?.subjects.find(s => s.subjectId === selectedSubject);
        if (examSub) setMaxMarks(examSub.maxMarks);
    };

    const handleMarkChange = (studentId: string, value: string) => {
        const num = parseInt(value) || 0;
        if (num > maxMarks) return; // Basic validation
        setMarksData(prev => ({ ...prev, [studentId]: num }));
    };

    const handleSave = () => {
        const examObj = exams.find(e => e.id === selectedExam);
        const subjectObj = subjects.find(s => s.id === selectedSubject);

        if (!examObj || !subjectObj) return;

        const entries = studentsList.map(s => ({
            studentId: s.id,
            studentName: s.name,
            rollNumber: s.rollNumber || "N/A",
            classId: selectedClass,
            section: selectedSection,
            marksObtained: marksData[s.id] || 0
        }));

        upsertResults(
            selectedExam,
            examObj.name,
            selectedSubject,
            subjectObj.name,
            maxMarks,
            entries
        );

        alert("Marks saved successfully!");
    };

    const filteredSections = selectedClass
        ? classes.find(c => c.name === selectedClass)?.sections || []
        : [];

    const filteredExams = exams.filter(e => e.classId === selectedClass);
    const filteredSubjects = subjects.filter(s => s.class === selectedClass);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 no-print">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Marks Entry</h1>
                <p className="text-muted-foreground">Enter subject-wise marks for students</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Selection Filters</CardTitle>
                    <CardDescription>Select context to load students</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Class</label>
                            <Select onValueChange={setSelectedClass} value={selectedClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Section</label>
                            <Select onValueChange={setSelectedSection} value={selectedSection} disabled={!selectedClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Section" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredSections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Exam</label>
                            <Select onValueChange={setSelectedExam} value={selectedExam} disabled={!selectedClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Exam" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredExams.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subject</label>
                            <Select onValueChange={setSelectedSubject} value={selectedSubject} disabled={!selectedClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full" onClick={handleLoadStudents}>Load Students</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {studentsList.length > 0 && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Enter Marks: {subjects.find(s => s.id === selectedSubject)?.name}</CardTitle>
                            <CardDescription>Max Marks: {maxMarks}</CardDescription>
                        </div>
                        <Button onClick={handleSave}>
                            <Save className="mr-2 h-4 w-4" /> Save Marks
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Roll No</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="w-[150px]">Max Marks</TableHead>
                                    <TableHead className="w-[200px]">Marks Obtained</TableHead>
                                    <TableHead className="text-right">Grade (Live)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentsList.map(s => {
                                    const score = marksData[s.id] || 0;
                                    const pct = (score / maxMarks) * 100;
                                    let grade = "Fail";
                                    if (pct >= 90) grade = "A+";
                                    else if (pct >= 75) grade = "A";
                                    else if (pct >= 60) grade = "B";
                                    else if (pct >= 40) grade = "C";

                                    return (
                                        <TableRow key={s.id}>
                                            <TableCell className="font-medium">{s.rollNumber}</TableCell>
                                            <TableCell>{s.name}</TableCell>
                                            <TableCell>{maxMarks}</TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    max={maxMarks}
                                                    value={marksData[s.id] || ""}
                                                    onChange={(e) => handleMarkChange(s.id, e.target.value)}
                                                    className="w-24"
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className={`font-bold ${grade === 'Fail' ? 'text-red-500' : 'text-green-600'}`}>
                                                    {grade}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
