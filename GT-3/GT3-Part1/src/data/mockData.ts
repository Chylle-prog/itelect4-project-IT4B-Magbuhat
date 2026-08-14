import type { Claim, LostFoundItem, User } from '../types/index'

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Juan dela Cruz',
    email: 'juan@example.com',
    role: 'student',
    isActive: true,
  },
  {
    id: 2,
    name: 'Ava Reyes',
    email: 'ava@school.edu',
    role: 'admin',
    isActive: true,
  },
  {
    id: 3,
    name: 'Mark Santos',
    email: 'mark@school.edu',
    role: 'instructor',
    isActive: true,
  },
]

export const mockItems: LostFoundItem[] = [
  {
    id: 101,
    title: 'Black Wallet',
    description: 'Black leather wallet with school ID',
    category: 'Accessories',
    status: 'lost',
    location: 'Library lobby',
    postedByUserId: 1,
    createdAt: new Date('2026-07-18T08:30:00'),
  },
  {
    id: 102,
    title: 'Blue Umbrella',
    description: 'Foldable umbrella left at the canteen',
    category: 'Personal Items',
    status: 'found',
    location: 'Campus canteen',
    postedByUserId: 2,
    createdAt: new Date('2026-07-18T09:10:00'),
  },
  {
    id: 103,
    title: 'Silver ID Lace',
    description: 'Campus ID lace with silver clip',
    category: 'Accessories',
    status: 'lost',
    location: 'Main gate',
    postedByUserId: 1,
    createdAt: new Date('2026-07-18T09:45:00'),
  },
]

export const mockClaims: Claim[] = [
  {
    id: 201,
    itemId: 101,
    claimantUserId: 1,
    notes: 'Wallet has my student card inside.',
    status: 'pending',
    createdAt: new Date('2026-07-18T14:05:00'),
  },
  {
    id: 202,
    itemId: 102,
    claimantUserId: 3,
    notes: 'The umbrella handle has my initials on it.',
    status: 'pending',
    createdAt: new Date('2026-07-18T14:20:00'),
  },
]