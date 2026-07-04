import type { User, Grade, Course } from "./types/index";

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
function calculateGrade(score: number, maxScore: number): Grade {
  const percentage: number = (score / maxScore) * 100;
  if (percentage >= 90) return { score, letter: "A" };
  if (percentage >= 80) return { score, letter: "B" };
  if (percentage >= 70) return { score, letter: "C" };
  return { score, letter: "F" };
}
function formatCourse(course: Course): string {
  return `${course.name} (${course.units} units) - ${course.semester}`;
}
const user: User = getUser(1);
const course: Course = { name: "IT Elective 4", units: 3, semester: "1st Semester" };
console.log(user);
console.log(calculateGrade(user.score!, 100));
console.log(formatCourse(course));
