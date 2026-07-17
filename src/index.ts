import type { ApiResponse, User } from "../types/index";

interface LostFoundItem {
id: number;
title: string;
description: string;
category: string;
status: "lost" | "found";
location: string;
postedByUserId: number;
claimedByUserId?: number;
verifiedByUserId?: number;
createdAt: Date;
}

interface Claim {
id: number;
itemId: number;
claimantUserId: number;
notes: string;
status: ClaimStatus;
verifiedByUserId?: number;
createdAt: Date;
}

enum ClaimStatus {
Pending = "pending",
Verified = "verified",
Rejected = "rejected",
Released = "released",
}

type ItemSummary = Pick<LostFoundItem, "id" | "title" | "status">;
type ItemStatusCount = Record<LostFoundItem["status"], number>;

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

function reviewClaim(claim: Claim, verifierUserId: number, status: ClaimStatus): Claim {
return {
...claim,
status,
verifiedByUserId: verifierUserId,
};
}

const users: User[] = [
{ id: 1, name: "Juan dela Cruz", email: "juan@example.com", role: "student", isActive: true },
{ id: 2, name: "Ava Reyes", email: "ava@school.edu", role: "admin", isActive: true },
{ id: 3, name: "Mark Santos", email: "mark@school.edu", role: "instructor", isActive: true },
];

const items: LostFoundItem[] = [
createItem(101, "Black Wallet", "Black leather wallet with school ID", "Accessories", "lost", "Library lobby", 1),
createItem(102, "Blue Umbrella", "Foldable umbrella left at the canteen", "Personal Items", "found", "Campus canteen", 2),
createItem(103, "Silver ID Lace", "Campus ID lace with silver clip", "Accessories", "lost", "Main gate", 1),
];

const claims: Claim[] = [
{ id: 201, itemId: 102, claimantUserId: 1, notes: "The handle has a small crack.", status: ClaimStatus.Pending, createdAt: new Date() },
{ id: 202, itemId: 101, claimantUserId: 3, notes: "Wallet has my student card inside.", status: ClaimStatus.Pending, createdAt: new Date() },
];

const itemResponse: ApiResponse<LostFoundItem[]> = {
success: true,
data: items,
message: "Campus items loaded",
};

const claimResponse: ApiResponse<Claim[]> = {
success: true,
data: claims,
};

const reviewedClaim = reviewClaim(claims[0]!, 2, ClaimStatus.Verified);

const lostItems = items.filter((item) => item.status === "lost");
const lostItemSummaries: ItemSummary[] = lostItems.map((item) => ({
id: item.id,
title: item.title,
status: item.status,
}));

const foundItems = items.filter((item) => item.status === "found");
const foundItemSummaries: ItemSummary[] = foundItems.map((item) => ({
id: item.id,
title: item.title,
status: item.status,
}));

const claimReviewSummaries = claims.map((claim) => {
const claimant = getById(users, claim.claimantUserId);

return {
claimantName: claimant?.name ?? "Unknown user",
itemId: claim.itemId,
reviewStatus: claim.status,
};
});

const itemStatusCount: ItemStatusCount = items.reduce(
(counts, item) => ({
...counts,
[item.status]: counts[item.status] + 1,
}),
{ lost: 0, found: 0 }
);

console.log("Total amount of items:", itemResponse.data.length);
console.log(itemStatusCount);
console.log("Lost items currently in storage:", lostItemSummaries);
console.log("Total amount of claims:", claimResponse.data.length);
console.log("Found items:", foundItemSummaries);
console.log("Claim review summaries:", claimReviewSummaries);
console.log(reviewedClaim.status);
