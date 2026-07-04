export interface User {
id: number;
name: string;
email: string;
role: "student" | "admin" | "instructor";
isActive: boolean;
score?: number;
}

export interface Grade {
score: number;
letter: "A" | "B" | "C" | "F";
}

export interface Course {
name: string;
units: number;
semester: string;
}