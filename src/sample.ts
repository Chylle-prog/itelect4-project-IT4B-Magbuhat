import type { User, Grade } from "../types/index";

// id: number -- the user's unique identifier; must be a whole number
// returns: User -- an object matching the User interface shape (defined in types/index.ts)
function getUser(id: number): User {
return {
id: id,
name: "Juan dela Cruz",     // The user's full name
email: "juan@example.com",  // The user's email address
role: "student",            // Displays the role of the user
isActive: true,             // Shows whether the user is active or not
score: 95.5,                // The user's score
};
}

// score: number -- the student's raw score
// maxScore: number -- the highest possible score (used to compute percentage)
// letter: string -- a single letter grade: "A", "B", "C", or "F"
// returns: Grade -- an object with score (number) and letter
function calculateGrade(score: number, maxScore: number): Grade {
const percentage: number = (score / maxScore) * 100; // number -- result of dividing score by maxScore, always a decimal
if (percentage >= 90) return { score, letter: "A" };
if (percentage >= 80) return { score, letter: "B" };
if (percentage >= 70) return { score, letter: "C" };
return { score, letter: "F" };
}

// name: string -- the course name (e.g. "IT Elective 4")
// units: number -- the number of credit units
// semester: string -- the semester label (e.g. "1st Semester")
// returns: string -- a formatted display string combining all three fields
function formatCourse(name: string, units: number, semester: string): string {
return `${name} (${units} units) - ${semester}`;
}

const user: User = getUser(1); // User -- typed with the User interface; holds the returned student object
const grade: Grade = calculateGrade(user.score!, 100); // Grade -- typed with the Grade interface; holds score and letter
console.log(user);
console.log(grade);          // { score: 95.5, letter: 'A' }
console.log(grade.letter);   // 'A' -- the letter field from the Grade interface
console.log(formatCourse("IT Elective 4", 3, "1st Semester"));
