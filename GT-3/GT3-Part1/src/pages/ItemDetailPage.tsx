import { useNavigate, useParams } from 'react-router'
import ItemCard from '../assets/ItemCard'
import { mockClaims, mockItems, mockUsers } from '../data/mockData'

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const itemId = Number(id)

  const item = mockItems.find((entry) => entry.id === itemId)

  if (!Number.isFinite(itemId) || item === undefined) {
    return (
      <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
        <p>No item found for ID "{id}".</p>
        <button
          type="button"
          onClick={() => navigate('/items')}
          className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
        >
          Back to Items
        </button>
      </div>
    )
  }

  const relatedClaims = mockClaims.filter((claim) => claim.itemId === item.id)

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Item Detail</h1>
      <div className="max-w-xl">
        <ItemCard item={item} />
      </div>

      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
          Related Claims
        </h2>
        {relatedClaims.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-300">No claims yet for this item.</p>
        ) : (
          relatedClaims.map((claim) => {
            const claimant = mockUsers.find((user) => user.id === claim.claimantUserId)
            return (
              <p key={claim.id} className="text-sm text-slate-700 dark:text-slate-200">
                Claim #{claim.id}: {claim.status} by {claimant?.name ?? `User ${claim.claimantUserId}`}
              </p>
            )
          })
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate('/items')}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Back to Items
      </button>
    </section>
  )
}

export default ItemDetailPage