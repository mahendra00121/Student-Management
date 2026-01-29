"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Teacher = {
    id: string;
    name: string;
    employeeId: string;
    email: string;
    phone: string;
    subjects: string[];
    classes: string[];
    status: "Active" | "Inactive";
};

interface TeacherContextType {
    teachers: Teacher[];
    addTeacher: (teacher: Teacher) => void;
    updateTeacher: (id: string, updatedTeacher: Partial<Teacher>) => void;
    deleteTeacher: (id: string) => void;
    getTeacher: (id: string) => Teacher | undefined;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

// Initial dummy data
const initialTeachers: Teacher[] = [
    {
        id: "1",
        name: "Sarah Williams",
        employeeId: "TCH001",
        email: "sarah@school.com",
        phone: "9876543210",
        subjects: ["Mathematics", "Physics"],
        classes: ["10-A", "9-B"],
        status: "Active"
    },
    {
        id: "2",
        name: "David Johnson",
        employeeId: "TCH002",
        email: "david@school.com",
        phone: "8765432109",
        subjects: ["Science", "Chemistry"],
        classes: ["10-B", "8-A"],
        status: "Active"
    },
    {
        id: "3",
        name: "Emily Brown",
        employeeId: "TCH003",
        email: "emily@school.com",
        phone: "7654321098",
        subjects: ["English"],
        classes: ["9-A", "11-C"],
        status: "Inactive"
    },
];

export function TeacherProvider({ children }: { children: React.ReactNode }) {
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    // Load from local storage or set initial
    useEffect(() => {
        const saved = localStorage.getItem("teachers");
        if (saved) {
            try {
                setTeachers(JSON.parse(saved));
            } catch (e) {
                setTeachers(initialTeachers);
            }
        } else {
            setTeachers(initialTeachers);
        }
    }, []);

    // Save to local storage whenever teachers change
    useEffect(() => {
        if (teachers.length > 0) {
            localStorage.setItem("teachers", JSON.stringify(teachers));
        }
    }, [teachers]);

    const addTeacher = (teacher: Teacher) => {
        setTeachers((prev) => [teacher, ...prev]);
    };

    const updateTeacher = (id: string, updatedTeacher: Partial<Teacher>) => {
        setTeachers((prev) =>
            prev.map((teacher) =>
                teacher.id === id ? { ...teacher, ...updatedTeacher } : teacher
            )
        );
    };

    const deleteTeacher = (id: string) => {
        setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
    };

    const getTeacher = (id: string) => {
        return teachers.find((t) => t.id === id);
    };

    return (
        <TeacherContext.Provider
            value={{ teachers, addTeacher, updateTeacher, deleteTeacher, getTeacher }}
        >
            {children}
        </TeacherContext.Provider>
    );
}

export function useTeachers() {
    const context = useContext(TeacherContext);
    if (context === undefined) {
        throw new Error("useTeachers must be used within a TeacherProvider");
    }
    return context;
}
