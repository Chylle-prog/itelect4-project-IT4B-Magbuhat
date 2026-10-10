import type {
  ApiClaim,
  ApiLostFoundItem,
  ApiUser,
  Claim,
  LostFoundItem,
  NewClaim,
  User,
} from '../types/index'

export const API_URL = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_AUTH_API_URL ??
  'http://localhost:4000'
).replace(/\/$/, '')

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  return response.json() as Promise<T>
}

function toUser(user: ApiUser): User {
  return { ...user, id: Number(user.id) }
}

function toItem(item: ApiLostFoundItem): LostFoundItem {
  return {
    ...item,
    id: Number(item.id),
    postedByUserId: Number(item.postedByUserId),
    createdAt: new Date(item.createdAt),
  }
}

function toClaim(claim: ApiClaim): Claim {
  return {
    ...claim,
    id: Number(claim.id),
    itemId: Number(claim.itemId),
    claimantUserId: Number(claim.claimantUserId),
    createdAt: new Date(claim.createdAt),
  }
}

export async function fetchUsers(): Promise<User[]> {
  const users = await getJson<ApiUser[]>('/users')
  return users.map(toUser)
}

export async function fetchItems(): Promise<LostFoundItem[]> {
  const items = await getJson<ApiLostFoundItem[]>('/items')
  return items.map(toItem)
}

export async function fetchItemById(id: string): Promise<LostFoundItem> {
  const item = await getJson<ApiLostFoundItem>(`/items/${id}`)
  return toItem(item)
}

export async function fetchClaims(): Promise<Claim[]> {
  const claims = await getJson<ApiClaim[]>('/claims')
  return claims.map(toClaim)
}

export async function createClaim(claim: NewClaim): Promise<Claim> {
  const saved = await fetch(`${API_URL}/claims`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(claim),
  })
  if (!saved.ok) {
    throw new Error('Could not create claim')
  }
  const data = (await saved.json()) as ApiClaim
  return toClaim(data)
}