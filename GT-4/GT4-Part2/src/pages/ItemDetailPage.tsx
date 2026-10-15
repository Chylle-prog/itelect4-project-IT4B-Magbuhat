import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'
import ItemCard from '../assets/ItemCard'
import { fetchItemById } from '../api/client'

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const itemQuery = useQuery<Awaited<ReturnType<typeof fetchItemById>>, Error>({
    queryKey: ['items', id],
    queryFn: () => fetchItemById(id ?? ''),
    enabled: id !== undefined,
  })
  const item = itemQuery.data

  if (itemQuery.isPending) {
    return <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">Loading item details...</div>
  }

  if (itemQuery.isError || item === undefined) {
    return (
      <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
        <p>Could not load item "{id}". Please log in again and retry.</p>
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

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Item Detail</h1>
      <div className="max-w-xl">
        <ItemCard item={item} />
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