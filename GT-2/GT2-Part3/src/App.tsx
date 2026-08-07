// src/App.tsx
import { useState, useEffect, useRef } from 'react'
import type { User, LostFoundItem, Claim } from './types/index'
import UserCard from './assets/UserCard'
import ItemCard from './assets/ItemCard'
import ClaimBadge from './assets/ClaimBadge'
import useToggle from './hooks/useToggle'
import usePrevious from './hooks/usePrevious'

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
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const [users, setUsers] = useState<User[]>([])
  const [items, setItems] = useState<LostFoundItem[]>([])
  const [claims, setClaims] = useState<Claim[]>([])
  const [activeUserIndex, setActiveUserIndex] = useState(0)
  const [activeItemIndex, setActiveItemIndex] = useState(0)
  const [itemFilter, setItemFilter] = useState<'all' | LostFoundItem['status']>('all')

  const searchInputRef = useRef<HTMLInputElement>(null)

  const [isDarkMode, toggleDarkMode] = useToggle(false)
  const [showDetails, toggleDetails] = useToggle(false)
  const previousSearch = usePrevious(searchValue)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setUsers(initialUsers)
        setItems(initialItems)
        setClaims(initialClaims)
        setIsError(false)
      } catch {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      searchInputRef.current?.focus()
    }
  }, [isLoading])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value)
    setActiveUserIndex(0)
  }

  const handleClearSearch = (): void => {
    setSearchValue('')
    setActiveUserIndex(0)
    searchInputRef.current?.focus()
  }

  const handleRetry = (): void => {
    setIsLoading(true)
    setIsError(false)
    const timer = setTimeout(() => {
      setUsers(initialUsers)
      setItems(initialItems)
      setClaims(initialClaims)
      setIsLoading(false)
    }, 500)
    window.setTimeout(() => clearTimeout(timer), 900)
  }

  const filteredUsers = users.filter((user) => {
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

  // Live details should follow the currently navigated user.
  const activeUserClaim = activeUser
    ? claims.find((claim) => claim.claimantUserId === activeUser.id) ?? null
    : null

  // Claim badge should follow the explicitly selected user.
  const selectedUserClaim = selectedUserId
    ? claims.find((claim) => claim.claimantUserId === selectedUserId) ?? null
    : null

  const selectedClaimantUser = selectedUserClaim
    ? users.find((user) => user.id === selectedUserClaim.claimantUserId) ?? null
    : null

  const activeClaimedItem = activeUserClaim
    ? items.find((item) => item.id === activeUserClaim.itemId) ?? null
    : null
  const selectedClaimedItem = selectedUserClaim
    ? items.find((item) => item.id === selectedUserClaim.itemId) ?? null
    : null

  const activeClaimItemName = activeUserClaim
    ? activeClaimedItem?.title ?? `Item ${activeUserClaim.itemId}`
    : null
  const selectedClaimItemName = selectedUserClaim
    ? selectedClaimedItem?.title ?? `Item ${selectedUserClaim.itemId}`
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
    if (!selectedUserClaim) {
      return
    }

    const nextClaim: Claim = { ...selectedUserClaim, status: 'approved' }
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
    if (!selectedUserClaim) {
      return
    }

    const nextClaim: Claim = { ...selectedUserClaim, status: 'rejected' }
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

  if (isLoading) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-white p-6 dark:bg-[#16171d]">
        <div className="mx-auto max-w-3xl animate-pulse rounded-xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Loading data...
        </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-white p-6 dark:bg-[#16171d]">
          <div className="mx-auto max-w-3xl space-y-4 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
            <p>Could not load data. Please try again.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-900/40"
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white text-slate-800 dark:bg-[#16171d] dark:text-slate-100">
        <div className="mx-auto max-w-6xl space-y-6 p-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Lost & Found</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">Interactive dashboard for users, items, and claims.</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                type="button"
                onClick={() => setIsError(true)}
                className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60"
              >
                Simulate Error
              </button>
            </div>
          </header>

          <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                ref={searchInputRef}
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search users by name, email, or role"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
              />
              <button
                type="button"
                onClick={handleClearSearch}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
              >
                Clear
              </button>
              <button
                type="button"
                aria-expanded={showDetails}
                aria-controls="details-panel"
                onClick={toggleDetails}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
              >
                {showDetails ? 'Hide' : 'Show'} Details
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <span>Total users: {users.length}</span>
              <span>Total items: {items.length}</span>
              {previousSearch !== undefined && previousSearch !== searchValue && (
                <span>Previous search: "{previousSearch}"</span>
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Items</h2>
                <span className="text-xs text-slate-500 dark:text-slate-300">
                  {filteredItems.length === 0 ? '0 / 0' : `${activeItemIndex + 1} / ${filteredItems.length}`}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${itemFilter === 'all' ? 'border-sky-600 bg-sky-100 text-sky-700 dark:border-sky-400 dark:bg-sky-900/40 dark:text-sky-200' : 'border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700'}`}
                  onClick={() => {
                    setItemFilter('all')
                    setActiveItemIndex(0)
                  }}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${itemFilter === 'lost' ? 'border-amber-600 bg-amber-100 text-amber-700 dark:border-amber-400 dark:bg-amber-900/40 dark:text-amber-200' : 'border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700'}`}
                  onClick={() => {
                    setItemFilter('lost')
                    setActiveItemIndex(0)
                  }}
                >
                  Lost
                </button>
                <button
                  type="button"
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${itemFilter === 'found' ? 'border-emerald-600 bg-emerald-100 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-900/40 dark:text-emerald-200' : 'border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700'}`}
                  onClick={() => {
                    setItemFilter('found')
                    setActiveItemIndex(0)
                  }}
                >
                  Found
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={showPrevItem}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={showNextItem}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  Next
                </button>
              </div>
              {activeItem ? (
                <ItemCard
                  key={activeItem.id}
                  item={activeItem}
                  variant={showDetails ? 'default' : 'compact'}
                />
              ) : (
                <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-300">
                  No items match the selected filter.
                </p>
              )}
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Users</h2>
                <span className="text-xs text-slate-500 dark:text-slate-300">
                  {filteredUsers.length === 0 ? '0 / 0' : `${activeUserIndex + 1} / ${filteredUsers.length}`}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={showPrevUser}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={showNextUser}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  Next
                </button>
              </div>
              {activeUser ? (
                <UserCard
                  key={activeUser.id}
                  user={activeUser}
                  isSelected={selectedUserId === activeUser.id}
                  onSelect={(u) => setSelectedUserId(u.id)}
                />
              ) : (
                <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-300">
                  No users match your search.
                </p>
              )}
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Claim Action</h2>
              <ClaimBadge
                claim={selectedUserClaim}
                claimantName={selectedClaimantUser?.name}
                itemName={selectedClaimItemName ?? undefined}
                onAccept={acceptClaim}
                onReject={rejectClaim}
                showDetails={showDetails}
              >
                <p className="text-xs text-slate-600 dark:text-slate-300">Use Accept or Reject to process this claim.</p>
              </ClaimBadge>
            </section>

            {showDetails && (
              <section
                id="details-panel"
                className="space-y-2 rounded-xl border border-sky-200 bg-sky-50 p-4 text-left dark:border-sky-900/40 dark:bg-sky-950/30 lg:col-span-3"
                aria-live="polite"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">Live Details</h3>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Current User: {activeUser ? `${activeUser.name} (${activeUser.role})` : 'None selected'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Claimed Item: {activeUserClaim
                    ? `${activeClaimItemName ?? `Item ${activeUserClaim.itemId}`} - ${activeClaimedItem?.status ?? 'status unavailable'}`
                    : 'No claim for current user'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Current Claim: {activeUserClaim
                    ? `${activeUserClaim.status} for ${activeClaimItemName ?? `Item ${activeUserClaim.itemId}`}`
                    : 'No claim for current user'}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
