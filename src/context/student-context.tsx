"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Student = {
    id: string;
    name: string;
    rollNo: string;
    rollNumber?: string; // Standardizing usage
    class: string;
    section: string;
    phone: string;
    status: "Active" | "Inactive";
    email?: string;
    gender?: string;
    dob?: Date;
    parentName?: string;
    address?: string;
};

interface StudentContextType {
    students: Student[];
    addStudent: (student: Student) => void;
    updateStudent: (id: string, updatedStudent: Partial<Student>) => void;
    deleteStudent: (id: string) => void;
    getStudent: (id: string) => Student | undefined;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

// Initial dummy data
const initialStudents: Student[] = [
    { id: "1", name: "John Doe", rollNo: "101", class: "10", section: "A", phone: "1234567890", status: "Active" },
    { id: "2", name: "Jane Smith", rollNo: "102", class: "10", section: "A", phone: "0987654321", status: "Active" },
    { id: "3", name: "Sam Wilson", rollNo: "103", class: "9", section: "B", phone: "1122334455", status: "Inactive" },
    { id: "4", name: "Alice Brown", rollNo: "104", class: "10", section: "B", phone: "2233445566", status: "Active" },
    { id: "5", name: "Michael Johnson", rollNo: "105", class: "11", section: "C", phone: "3344556677", status: "Active" },
];

export function StudentProvider({ children }: { children: React.ReactNode }) {
    const [students, setStudents] = useState<Student[]>([]);

    // Load from local storage or set initial
    useEffect(() => {
        const saved = localStorage.getItem("students");
        if (saved) {
            try {
                setStudents(JSON.parse(saved));
            } catch (e) {
                setStudents(initialStudents);
            }
        } else {
            setStudents(initialStudents);
        }
    }, []);

    // Save to local storage whenever students change
    useEffect(() => {
        if (students.length > 0) {
            localStorage.setItem("students", JSON.stringify(students));
        }
    }, [students]);

    const addStudent = (student: Student) => {
        setStudents((prev) => [student, ...prev]);
    };

    const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
        setStudents((prev) =>
            prev.map((student) =>
                student.id === id ? { ...student, ...updatedStudent } : student
            )
        );
    };

    const deleteStudent = (id: string) => {
        setStudents((prev) => prev.filter((student) => student.id !== id));
    };

    const getStudent = (id: string) => {
        return students.find((s) => s.id === id);
    };

    return (
        <StudentContext.Provider
            value={{ students, addStudent, updateStudent, deleteStudent, getStudent }}
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
