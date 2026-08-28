import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router'
import ClaimBadge from '../assets/ClaimBadge'
import { createClaim, fetchClaims, fetchItems, fetchUsers } from '../api/client'
import type { Claim, LostFoundItem, NewClaim, User } from '../types/index'

function ClaimsPage() {
  const claimsQuery = useQuery<Claim[]>({ queryKey: ['claims'], queryFn: fetchClaims })
  const itemsQuery = useQuery<LostFoundItem[]>({ queryKey: ['items'], queryFn: fetchItems })
  const usersQuery = useQuery<User[]>({ queryKey: ['users'], queryFn: fetchUsers })
  const [activeClaimIndex, setActiveClaimIndex] = useState(0)
  const [claimNotes, setClaimNotes] = useState('')
  const [claimMode, setClaimMode] = useState<'submit' | 'review'>('review')
  const [submitItemId, setSubmitItemId] = useState<number | null>(null)
  const [decisions, setDecisions] = useState<Record<number, Claim['status']>>({})
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const currentUserId = (location.state as { userId?: number | null } | null)?.userId ?? null

  const claims = claimsQuery.data ?? []
  const items = itemsQuery.data ?? []
  const users = usersQuery.data ?? []
  const activeClaim = claims[activeClaimIndex] ?? null
  const claimant = activeClaim
    ? users.find((user) => user.id === activeClaim.claimantUserId) ?? null
    : null
  const item = activeClaim
    ? items.find((entry) => entry.id === activeClaim.itemId) ?? null
    : null
  const submitItem = items.find((entry) => entry.id === submitItemId) ?? null
  const displayedClaim = activeClaim
    ? { ...activeClaim, status: decisions[activeClaim.id] ?? activeClaim.status }
    : null

  const addClaim = useMutation<Claim, Error, NewClaim>({
    mutationFn: createClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] })
      setClaimNotes('')
    },
  })

  const showPrevClaim = (): void => {
    if (claims.length === 0) {
      return
    }
    setActiveClaimIndex((prev) => (prev === 0 ? claims.length - 1 : prev - 1))
  }

  const showNextClaim = (): void => {
    if (claims.length === 0) {
      return
    }
    setActiveClaimIndex((prev) => (prev === claims.length - 1 ? 0 : prev + 1))
  }

  const updateClaim = (status: Claim['status']): void => {
    if (!activeClaim) {
      return
    }

    setDecisions((previous) => ({ ...previous, [activeClaim.id]: status }))
  }

  const handleAddClaim = (): void => {
    if (!submitItem || claimNotes.trim().length === 0) {
      return
    }

    addClaim.mutate({
      itemId: String(submitItem.id),
      claimantUserId: String(currentUserId ?? 1),
      notes: claimNotes.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
  }

  if (claimsQuery.isPending || itemsQuery.isPending || usersQuery.isPending) {
    return <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">Loading claims...</div>
  }

  if (claimsQuery.isError || itemsQuery.isError || usersQuery.isError) {
    return <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">Could not load claims data. Make sure `npm run api` is running.</p>
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Claims Queue</h1>
        <span className="text-xs text-slate-500 dark:text-slate-300">
          {claims.length === 0 ? '0 / 0' : `${activeClaimIndex + 1} / ${claims.length}`}
        </span>
      </div>

      {currentUserId !== null && (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Showing the claim context for user #{currentUserId} first.
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setClaimMode((mode) => mode === 'submit' ? 'review' : 'submit')}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
        >
          {claimMode === 'submit' ? 'Switch to Review Claims' : 'Switch to Submit Claim'}
        </button>
      </div>

      {claimMode === 'submit' ? (
        <div className="max-w-xl space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <label htmlFor="claim-item" className="text-sm font-semibold">Item to claim</label>
          <select
            id="claim-item"
            value={submitItemId ?? ''}
            onChange={(event) => setSubmitItemId(event.target.value ? Number(event.target.value) : null)}
            className="w-full rounded-md border border-slate-300 p-2 text-sm dark:border-slate-600 dark:bg-slate-900"
          >
            <option value="">Choose an item</option>
            {items.map((availableItem) => (
              <option key={availableItem.id} value={availableItem.id}>
                {availableItem.title} ({availableItem.status})
              </option>
            ))}
          </select>
          <textarea
            id="claim-notes"
            value={claimNotes}
            onChange={(event) => setClaimNotes(event.target.value)}
            placeholder="Explain why this item belongs to you"
            className="w-full rounded-md border border-slate-300 p-2 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          <button
            type="button"
            onClick={handleAddClaim}
            disabled={submitItem === null || claimNotes.trim().length === 0 || addClaim.isPending}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {addClaim.isPending ? 'Submitting...' : 'Submit Claim'}
          </button>
          {addClaim.isError && <p className="text-sm text-red-700">{addClaim.error.message}</p>}
          {addClaim.isSuccess && <p className="text-sm text-emerald-700">Claim submitted and list refreshed.</p>}
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={showPrevClaim}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={showNextClaim}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              Next
            </button>
            {item && (
              <button
                type="button"
                onClick={() => navigate(`/items/${item.id}`)}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Open Item Detail
              </button>
            )}
          </div>

          <div className="max-w-xl">
            <ClaimBadge
              claim={displayedClaim}
              claimantName={claimant?.name}
              itemName={item?.title}
              onAccept={() => updateClaim('approved')}
              onReject={() => updateClaim('rejected')}
              showDetails
            >
              {item && (
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  Item status updates immediately when claim is accepted or rejected.
                </p>
              )}
            </ClaimBadge>
          </div>
        </>
      )}
    </section>
  )
}

export default ClaimsPage