import type { User } from "../types/index";

// id: number -- the user's unique identifier; must be a whole number
// returns: User -- an object matching the User interface shape (defined in types/index.ts)
function getUser(id: number): User {
return {
id: id,
name: "Juan dela Cruz",
email: "juan@example.com",
role: "student",
isActive: true,
score: 95.5,
};
}

// score: number -- the student's raw score
// maxScore: number -- the highest possible score (used to compute percentage)
// returns: string -- a single letter grade: "A", "B", "C", or "F"
function calculateGrade(score: number, maxScore: number): string {
const percentage: number = (score / maxScore) * 100; // number -- result of dividing score by maxScore, always a decimal
if (percentage >= 90) return "A";
if (percentage >= 80) return "B";
if (percentage >= 70) return "C";
return "F";
}

// name: string -- the course name (e.g. "IT Elective 4")
// units: number -- the number of credit units
// semester: string -- the semester label (e.g. "1st Semester")
// returns: string -- a formatted display string combining all three fields
function formatCourse(name: string, units: number, semester: string): string {
return `${name} (${units} units) - ${semester}`;
}

const user: User = getUser(1); // User -- typed with the User interface; holds the returned student object
console.log(user);
console.log(calculateGrade(user.score!, 100));
console.log(formatCourse("IT Elective 4", 3, "1st Semester"));
