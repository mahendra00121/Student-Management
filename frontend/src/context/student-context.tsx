"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Student = {
    id: string;
    name: string;
    rollNo: string;
    rollNumber?: string;
    class: string;
    section: string;
    phone: string;
    status: "Active" | "Inactive";
    email?: string;
    gender?: string;
    dob?: string;
    parentName?: string;
    address?: string;
};

interface StudentContextType {
    students: Student[];
    loading: boolean;
    addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
    updateStudent: (id: string, updatedStudent: Partial<Student>) => Promise<void>;
    deleteStudent: (id: string) => Promise<void>;
    getStudent: (id: string) => Student | undefined;
    refreshStudents: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const API_URL = "http://localhost:5174/api/student";

export function StudentProvider({ children }: { children: React.ReactNode }) {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStudents = async () => {
        setLoading(true);
        console.log("Fetching students from:", API_URL);
        try {
            const response = await fetch(API_URL);
            console.log("Fetch Status:", response.status);
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            console.log("Students data received:", data.length);

            // Map backend to frontend
            const mappedData: Student[] = data.map((s: any) => ({
                id: s.id,
                name: s.name,
                rollNo: s.rollNumber,
                rollNumber: s.rollNumber,
                class: s.className,
                section: s.section,
                phone: s.phone,
                email: s.email,
                status: s.status as "Active" | "Inactive"
            }));
            setStudents(mappedData);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const addStudent = async (student: Omit<Student, 'id'>) => {
        try {
            console.log("Adding student, payload:", student);
            // Map frontend to backend
            const payload = {
                name: student.name,
                rollNumber: student.rollNo || student.rollNumber,
                className: student.class,
                section: student.section,
                phone: student.phone,
                email: student.email || null,
                status: student.status
            };
            console.log("Mapped payload for API:", payload);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            console.log("Add Student Response Status:", response.status);
            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorMessage = "Failed to add student";

                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    console.error("Validation Errors:", JSON.stringify(errorData.errors || errorData, null, 2));
                    errorMessage = errorData.title || JSON.stringify(errorData);
                } else {
                    errorMessage = await response.text();
                    console.error("Server Error:", errorMessage);
                }

                throw new Error(errorMessage);
            }
            await fetchStudents();
        } catch (error) {
            console.error("Error adding student:", error);
            throw error;
        }
    };

    const updateStudent = async (id: string, updatedStudent: Partial<Student>) => {
        try {
            const existing = students.find(s => s.id === id);
            if (!existing) return;

            const payload = {
                id: id,
                name: updatedStudent.name || existing.name,
                rollNumber: updatedStudent.rollNo || updatedStudent.rollNumber || existing.rollNo,
                className: updatedStudent.class || existing.class,
                section: updatedStudent.section || existing.section,
                phone: updatedStudent.phone || existing.phone,
                email: updatedStudent.email || existing.email || null,
                status: updatedStudent.status || existing.status
            };

            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to update student");
            await fetchStudents();
        } catch (error) {
            console.error("Error updating student:", error);
            throw error;
        }
    };

    const deleteStudent = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Failed to delete student");
            setStudents(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error("Error deleting student:", error);
            throw error;
        }
    };

    const getStudent = (id: string) => {
        return students.find((s) => s.id === id);
    };

    return (
        <StudentContext.Provider
            value={{
                students,
                loading,
                addStudent,
                updateStudent,
                deleteStudent,
                getStudent,
                refreshStudents: fetchStudents
            }}
        >
            {children}
        </StudentContext.Provider>
    );
}

export function useStudents() {
    const context = useContext(StudentContext);
    if (context === undefined) {
        throw new Error("useStudents must be used within a StudentProvider");
    }
    return context;
}
