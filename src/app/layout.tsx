import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { StudentProvider } from "@/context/student-context";
import { TeacherProvider } from "@/context/teacher-context";
import { ClassProvider } from "@/context/class-context";
import { SubjectProvider } from "@/context/subject-context";
import { AttendanceProvider } from "@/context/attendance-context";
import { ExamProvider } from "@/context/exam-context";
import { ResultContextProvider } from "@/context/result-context";
import { FeeProvider } from "@/context/fee-context";
import { SettingsProvider } from "@/context/settings-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Management System",
  description: "High-performance SMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StudentProvider>
            <TeacherProvider>
              <ClassProvider>
                <SubjectProvider>
                  <AttendanceProvider>
                    <ExamProvider>
                      <ResultContextProvider>
                        <FeeProvider>
                          <SettingsProvider>
                            {children}
                          </SettingsProvider>
                        </FeeProvider>
                      </ResultContextProvider>
                    </ExamProvider>
                  </AttendanceProvider>
                </SubjectProvider>
              </ClassProvider>
            </TeacherProvider>
          </StudentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
