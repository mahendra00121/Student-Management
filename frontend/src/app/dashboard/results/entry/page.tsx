"use client";

import { useState, useEffect, useMemo } from "react";
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
    const { results, upsertResults } = useResults();

    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedSection, setSelectedSection] = useState<string>("");
    const [selectedExam, setSelectedExam] = useState<string>("");
    const [selectedSubject, setSelectedSubject] = useState<string>("");

    const [studentsList, setStudentsList] = useState<any[]>([]);
    const [marksData, setMarksData] = useState<Record<string, number>>({});
    const [maxMarks, setMaxMarks] = useState<number>(100);

    // Removed aggressive auto-reset to prevent clearing selection upon loading

    const handleLoadStudents = () => {
        if (!selectedClass || !selectedExam || !selectedSubject) {
            alert("Please select Class, Exam and Subject");
            return;
        }

        const sClassStr = String(selectedClass).toLowerCase().replace(/(th|st|nd|rd)/g, '').trim();

        const filtered = students.filter(s => {
            const studentClassStr = String(s.class).toLowerCase().replace(/(th|st|nd|rd)/g, '').trim();
            const classMatch = studentClassStr === sClassStr; // Use flexible matching
            const sectionMatch = selectedSection ? s.section === selectedSection : true;
            return classMatch && sectionMatch;
        });

        console.log(`Loading students for ${selectedClass} ${selectedSection}: Found ${filtered.length}`);
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

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        const examObj = exams.find(e => e.id === selectedExam);
        const subjectObj = subjects.find(s => s.id === selectedSubject);

        if (!examObj || !subjectObj) {
            alert("Could not find exam or subject details.");
            return;
        }

        setIsSaving(true);
        try {
            const entries = studentsList.map(s => ({
                studentId: s.id,
                studentName: s.name,
                rollNumber: s.rollNumber || "N/A",
                classId: selectedClass,
                section: selectedSection,
                marksObtained: marksData[s.id] || 0
            }));

            await upsertResults(
                selectedExam,
                examObj.name,
                selectedSubject,
                subjectObj.name,
                maxMarks,
                entries
            );

            alert("Marks saved successfully to database!");
            router.push("/dashboard/results");
        } catch (error: any) {
            console.error("Failed to save marks:", error);
            alert(`Failed to save marks: ${error.message || "Unknown error"}`);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredSections = useMemo(() => {
        if (!selectedClass) return [];
        const sClass = String(selectedClass).toLowerCase().replace(/(th|st|nd|rd)/g, '').trim();
        const found = classes.find(c => String(c.name).toLowerCase().replace(/(th|st|nd|rd)/g, '').trim() === sClass);
        return found?.sections || [];
    }, [selectedClass, classes]);

    useEffect(() => {
        console.log(`Current State: Class=${selectedClass}, Exam=${selectedExam}, Subject=${selectedSubject}`);
    }, [selectedClass, selectedExam, selectedSubject]);

    useEffect(() => {
        console.log("Context Data Counts:", {
            totalClasses: classes.length,
            totalExams: exams.length,
            totalSubjects: subjects.length
        });
    }, [classes, exams, subjects]);

    const handleSubjectChange = (val: string) => {
        console.log("User selected subject ID:", val);
        setSelectedSubject(val);
    };

    const filteredExams = exams.filter(e => {
        if (!selectedClass) return false;
        const eClass = String(e.classId).toLowerCase().replace(/(th|st|nd|rd)/g, '').trim();
        const sClass = String(selectedClass).toLowerCase().replace(/(th|st|nd|rd)/g, '').trim();
        return eClass === sClass;
    });

    const filteredSubjects = useMemo(() => {
        if (!selectedClass) return [];
        const sClass = String(selectedClass).toLowerCase().replace(/(th|st|nd|rd)/g, '').trim();

        let list: any[] = [];

        // 1. Exam schedule subjects
        if (selectedExam) {
            const exam = exams.find(e => e.id === selectedExam);
            if (exam && exam.subjects && exam.subjects.length > 0) {
                list = exam.subjects.map(es => ({
                    id: es.subjectId,
                    name: es.subjectName
                }));
            }
        }

        // 2. Global subjects fallback
        if (list.length === 0) {
            list = subjects.filter(s => {
                const subClass = String(s.class).toLowerCase().replace(/(th|st|nd|rd)/g, '').trim();
                return subClass === sClass;
            });
        }

        // 3. Last resort: if still empty but class is selected, show ALL active subjects
        // (Maybe they were added without a class)
        if (list.length === 0 && selectedClass) {
            console.warn("No matching subjects found, showing all active subjects as fallback");
            list = subjects.filter(s => s.status === 'Active');
        }

        return list;
    }, [selectedClass, selectedExam, exams, subjects]);

    console.log("Debug - Loadable Subjects:", filteredSubjects.length, "for class:", selectedClass);

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
                                    <SelectValue placeholder={selectedClass ? "Select Exam" : "Select Class first"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredExams.length > 0 ? (
                                        filteredExams.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)
                                    ) : (
                                        <SelectItem value="none" disabled>No exams found</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subject</label>
                            <Select onValueChange={handleSubjectChange} value={selectedSubject} disabled={!selectedClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder={selectedClass ? "Select Subject" : "Select Class first"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredSubjects.length > 0 ? (
                                        filteredSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)
                                    ) : (
                                        <SelectItem value="none" disabled>No subjects found</SelectItem>
                                    )}
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
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : (
                                <><Save className="mr-2 h-4 w-4" /> Save Marks</>
                            )}
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
