// src/App.tsx
import { useState } from 'react'
import './App.css'
import type { User, LostFoundItem, Claim } from './types/index'
import UserCard from './assets/UserCard'
import ItemCard from './assets/ItemCard'
import ClaimBadge from './assets/ClaimBadge'

const initialUsers: User[] = [
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

const initialItems: LostFoundItem[] = [
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

const initialClaims: Claim[] = [
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

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [items, setItems] = useState<LostFoundItem[]>(initialItems)
  const [claims, setClaims] = useState<Claim[]>(initialClaims)
  const [activeUserIndex, setActiveUserIndex] = useState(0)
  const [activeItemIndex, setActiveItemIndex] = useState(0)
  const [itemFilter, setItemFilter] = useState<'all' | LostFoundItem['status']>('all')

  const filteredUsers = initialUsers.filter((user) => {
    const keyword = searchValue.trim().toLowerCase()
    if (!keyword) {
      return true
    }
    return (
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      user.role.toLowerCase().includes(keyword)
    )
  })

  const activeUser = filteredUsers[activeUserIndex] ?? null
  const filteredItems = items.filter((item) => {
    if (itemFilter === 'all') {
      return true
    }
    return item.status === itemFilter
  })

  const activeItem = filteredItems[activeItemIndex] ?? null
  const activeClaim = selectedUserId
    ? claims.find((claim) => claim.claimantUserId === selectedUserId) ?? null
    : null
  const claimantUser = activeClaim
    ? initialUsers.find((user) => user.id === activeClaim.claimantUserId) ?? null
    : null

  const showPrevUser = (): void => {
    if (filteredUsers.length === 0) {
      return
    }
    setActiveUserIndex((prev) =>
      prev === 0 ? filteredUsers.length - 1 : prev - 1
    )
  }

  const showNextUser = (): void => {
    if (filteredUsers.length === 0) {
      return
    }
    setActiveUserIndex((prev) =>
      prev === filteredUsers.length - 1 ? 0 : prev + 1
    )
  }

  const showPrevItem = (): void => {
    if (filteredItems.length === 0) {
      return
    }
    setActiveItemIndex((prev) =>
      prev === 0 ? filteredItems.length - 1 : prev - 1
    )
  }

  const showNextItem = (): void => {
    if (filteredItems.length === 0) {
      return
    }
    setActiveItemIndex((prev) =>
      prev === filteredItems.length - 1 ? 0 : prev + 1
    )
  }

  const acceptClaim = (): void => {
    if (!activeClaim) {
      return
    }

    const nextClaim: Claim = { ...activeClaim, status: 'approved' }
    setClaims((prevClaims) =>
      prevClaims.map((claim) => (claim.id === nextClaim.id ? nextClaim : claim))
    )
    setItems((prevItems) =>
      prevItems.map((existingItem) =>
        existingItem.id === nextClaim.itemId
          ? { ...existingItem, status: 'found' }
          : existingItem
      )
    )
  }

  const rejectClaim = (): void => {
    if (!activeClaim) {
      return
    }

    const nextClaim: Claim = { ...activeClaim, status: 'rejected' }
    setClaims((prevClaims) =>
      prevClaims.map((claim) => (claim.id === nextClaim.id ? nextClaim : claim))
    )
    setItems((prevItems) =>
      prevItems.map((existingItem) =>
        existingItem.id === nextClaim.itemId
          ? { ...existingItem, status: 'lost' }
          : existingItem
      )
    )
  }

  return (
    <div className="app">
      <h1>Lost & Found</h1>
      <p className="app-feedback">Total users loaded: {initialUsers.length}</p>
      <p className="app-feedback">Total items loaded: {items.length}</p>

      <h2>Items (from GT1 Part 2)</h2>
      <div className="filter-row" role="group" aria-label="Item status filters">
        <button
          type="button"
          className={itemFilter === 'all' ? 'filter-active' : ''}
          onClick={() => {
            setItemFilter('all')
            setActiveItemIndex(0)
          }}
        >
          All
        </button>
        <button
          type="button"
          className={itemFilter === 'lost' ? 'filter-active' : ''}
          onClick={() => {
            setItemFilter('lost')
            setActiveItemIndex(0)
          }}
        >
          Lost
        </button>
        <button
          type="button"
          className={itemFilter === 'found' ? 'filter-active' : ''}
          onClick={() => {
            setItemFilter('found')
            setActiveItemIndex(0)
          }}
        >
          Found
        </button>
      </div>
      <div className="row-nav">
        <button type="button" onClick={showPrevItem}>Previous Item</button>
        <span>
          {filteredItems.length === 0
            ? '0 / 0'
            : `${activeItemIndex + 1} / ${filteredItems.length}`}
        </span>
        <button type="button" onClick={showNextItem}>Next Item</button>
      </div>
      {activeItem ? (
        <ItemCard
          key={activeItem.id}
          item={activeItem}
        />
      ) : (
        <p className="app-feedback">No items match the selected filter.</p>
      )}

      <h2>Users (from GT1 Part 2)</h2>
      <div className="search-row">
        <input
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            setActiveUserIndex(0)
          }}
          placeholder="Search users..."
        />
      </div>
      <div className="row-nav">
        <button type="button" onClick={showPrevUser}>Previous User</button>
        <span>{filteredUsers.length === 0 ? '0 / 0' : `${activeUserIndex + 1} / ${filteredUsers.length}`}</span>
        <button type="button" onClick={showNextUser}>Next User</button>
      </div>
      {activeUser ? (
        <UserCard
          key={activeUser.id}
          user={activeUser}
          isSelected={selectedUserId === activeUser.id}
          onSelect={(u) => setSelectedUserId(u.id)}
        />
      ) : (
        <p className="app-feedback">No users match your search.</p>
      )}

      <ClaimBadge
        claim={activeClaim}
        claimantName={claimantUser?.name}
        onAccept={acceptClaim}
        onReject={rejectClaim}
      >
        <p>Use Accept or Reject to update the selected user's claim.</p>
      </ClaimBadge>
    </div>
  )
}

export default App
