"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type AttendanceStatus = "Present" | "Absent" | "Late";

export type AttendanceRecord = {
    id: string;
    studentId: string;
    studentName: string;
    classId: string;
    section?: string;
    date: string; // YYYY-MM-DD
    status: AttendanceStatus;
    markedBy: string; // Teacher/Admin ID or Name
};

interface AttendanceContextType {
    attendanceRecords: AttendanceRecord[];
    markAttendance: (records: AttendanceRecord[]) => void;
    getAttendanceByDateAndClass: (date: string, classId: string, section?: string) => AttendanceRecord[];
    getStudentAttendance: (studentId: string) => AttendanceRecord[];
    getClassAttendanceStats: (classId: string, section?: string, month?: string) => {
        totalStudents: number;
        presentToday: number;
        absentToday: number;
        attendancePercentage: number;
    };
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem("attendance");
        if (saved) {
            try {
                setAttendanceRecords(JSON.parse(saved));
            } catch (e) {
                setAttendanceRecords([]);
            }
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem("attendance", JSON.stringify(attendanceRecords));
    }, [attendanceRecords]);

    const markAttendance = (newRecords: AttendanceRecord[]) => {
        setAttendanceRecords((prev) => {
            // Filter out any existing records for the same students on the same date to avoid duplicates
            const studentIdsInNew = new Set(newRecords.map(r => `${r.studentId}-${r.date}`));
            const existingFiltered = prev.filter(r => !studentIdsInNew.has(`${r.studentId}-${r.date}`));
            return [...existingFiltered, ...newRecords];
        });
    };

    const getAttendanceByDateAndClass = (date: string, classId: string, section?: string) => {
        return attendanceRecords.filter(r =>
            r.date === date &&
            r.classId === classId &&
            (section ? r.section === section : true)
        );
    };

    const getStudentAttendance = (studentId: string) => {
        return attendanceRecords.filter(r => r.studentId === studentId);
    };

    const getClassAttendanceStats = (classId: string, section?: string, month?: string) => {
        // This is a simplified version for stats
        const classRecords = attendanceRecords.filter(r =>
            r.classId === classId && (section ? r.section === section : true)
        );

        const today = new Date().toISOString().split('T')[0];
        const todayRecords = classRecords.filter(r => r.date === today);

        const presentToday = todayRecords.filter(r => r.status === "Present" || r.status === "Late").length;
        const absentToday = todayRecords.filter(r => r.status === "Absent").length;

        // We'd need total student count from StudentContext for accurate % usually
        // For now returning basic numbers
        return {
            totalStudents: todayRecords.length,
            presentToday,
            absentToday,
            attendancePercentage: todayRecords.length > 0 ? (presentToday / todayRecords.length) * 100 : 0
        };
    };

    return (
        <AttendanceContext.Provider value={{
            attendanceRecords,
            markAttendance,
            getAttendanceByDateAndClass,
            getStudentAttendance,
            getClassAttendanceStats
        }}>
            {children}
        </AttendanceContext.Provider>
    );
}

export function useAttendance() {
    const context = useContext(AttendanceContext);
    if (context === undefined) {
        throw new Error("useAttendance must be used within an AttendanceProvider");
    }
    return context;
}
