export interface User {
id: number;
name: string;
email: string;
role: "student" | "admin" | "instructor";
isActive: boolean;
score?: number;
}

// ===== APP TYPES =====
export interface LostFoundItem {
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

export interface Claim {
id: number;
itemId: number;
claimantUserId: number;
notes: string;
status: "pending" | "approved" | "rejected";
verifiedByUserId?: number;
createdAt: Date;
}

// ===== GENERIC INTERFACE =====
export interface ApiResponse<T> {
success: boolean;
data: T;
message?: string;
}

// ===== UTILITY TYPES =====
export type UserUpdate = Partial<User>;
export type ItemSummary = Pick<LostFoundItem, "id" | "title" | "status">;
export type PublicClaim = Omit<Claim, "verifiedByUserId">;
export type ItemStatusCount = Record<LostFoundItem["status"], number>;

// ===== ENUMS =====
export enum ClaimStatus {
Pending = "pending",
Verified = "verified",
Rejected = "rejected",
Released = "released",
}

export enum ClaimDecision {
Approved = "approved",
Rejected = "rejected",
}
