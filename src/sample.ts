import type {
ApiResponse,
Claim,
Grade,
ItemStatusCount,
ItemSummary,
LostFoundItem,
PublicClaim,
User,
UserUpdate,
} from "../types/index";

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

const user: User = getUser(1); // User -- typed with the User interface; holds the returned user object
const grade: Grade = calculateGrade(user.score!, 100); // Grade -- typed with the Grade interface; holds score and letter
console.log(user);
console.log(grade.letter);   // The letter field from the Grade interface
console.log(formatCourse("IT Elective 4", 3, "1st Semester"));

// ===== CAMPUS LOST & FOUND TRACKER APP =====
enum ClaimReviewOutcome {
Verified = "verified",
Rejected = "rejected",
}

function getFirst<T>(items: T[]): T | undefined {
return items[0];
}

function getById<T extends { id: number }>(items: T[], id: number): T | undefined {
return items.find((item) => item.id === id);
}

function createItem(
id: number,
title: string,
description: string,
category: string,
status: "lost" | "found",
location: string,
postedByUserId: number
): LostFoundItem {
return {
id,
title,
description,
category,
status,
location,
postedByUserId,
createdAt: new Date(),
};
}

function reviewClaim(
claim: Claim,
verifierUserId: number,
outcome: ClaimReviewOutcome,
): Claim {
return {
...claim,
status: outcome === ClaimReviewOutcome.Verified ? "approved" : "rejected",
verifiedByUserId: verifierUserId,
};
}

const trackerUsers: User[] = [
{ id: 1, name: "Juan dela Cruz", email: "juan@example.com", role: "student", isActive: true },
{ id: 2, name: "Ava Reyes", email: "ava@school.edu", role: "admin", isActive: true },
];

const trackerItems: LostFoundItem[] = [
createItem(101, "Black Wallet", "Black leather wallet with school ID", "Accessories", "lost", "Library lobby", 1),
createItem(102, "Blue Umbrella", "Foldable umbrella left at the canteen", "Personal Items", "found", "Campus canteen", 2),
];

const trackerClaims: Claim[] = [
{ id: 201, itemId: 102, claimantUserId: 1, notes: "The handle has a small crack.", status: "pending", createdAt: new Date() },
];

const userPatch: UserUpdate = { isActive: true };
const itemPreview: ItemSummary = { id: 101, title: "Black Wallet", status: "lost" };
const claimPreview: PublicClaim = trackerClaims[0]!;
const itemStats: ItemStatusCount = { lost: 1, found: 1 };

const firstItem = getFirst(trackerItems);
const matchedItem = getById(trackerItems, 102);
const currentUser = getById(trackerUsers, 2);

const itemResponse: ApiResponse<LostFoundItem[]> = {
success: true,
data: trackerItems,
message: "Campus posts loaded",
};

const claimResponse: ApiResponse<Claim[]> = {
success: true,
data: trackerClaims,
};

const reviewedClaim = reviewClaim(trackerClaims[0]!, 2, ClaimReviewOutcome.Verified);

console.log(itemResponse.data[0]?.title);
console.log(claimResponse.data[0]?.status);
console.log(userPatch);
console.log(itemPreview);
console.log(claimPreview);
console.log(itemStats);
console.log(firstItem?.location);
console.log(matchedItem?.description);
console.log(currentUser?.name);
console.log(reviewedClaim.status);
