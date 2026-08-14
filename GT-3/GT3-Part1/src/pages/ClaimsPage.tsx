import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import ClaimBadge from '../assets/ClaimBadge'
import { mockClaims, mockItems, mockUsers } from '../data/mockData'
import type { Claim, LostFoundItem } from '../types/index'

function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>(mockClaims)
  const [items, setItems] = useState<LostFoundItem[]>(mockItems)
  const [activeClaimIndex, setActiveClaimIndex] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const currentUserId = (location.state as { userId?: number | null } | null)?.userId ?? null

  useEffect(() => {
    if (currentUserId === null) {
      return
    }

    const matchingIndex = claims.findIndex((claim) => claim.claimantUserId === currentUserId)
    if (matchingIndex >= 0) {
      setActiveClaimIndex(matchingIndex)
    }
  }, [claims, currentUserId])

  const activeClaim = claims[activeClaimIndex] ?? null
  const claimant = activeClaim
    ? mockUsers.find((user) => user.id === activeClaim.claimantUserId) ?? null
    : null
  const item = activeClaim
    ? items.find((entry) => entry.id === activeClaim.itemId) ?? null
    : null

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

    setClaims((prevClaims) =>
      prevClaims.map((claim) =>
        claim.id === activeClaim.id ? { ...claim, status } : claim
      )
    )

    setItems((prevItems) =>
      prevItems.map((existingItem) =>
        existingItem.id === activeClaim.itemId
          ? {
              ...existingItem,
              status: status === 'approved' ? 'found' : 'lost',
            }
          : existingItem
      )
    )
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
          claim={activeClaim}
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
    </section>
  )
}

export default ClaimsPage