// src/App.tsx
import './App.css'
import type { User, LostFoundItem, Claim } from './types/index'
import UserCard from './assets/UserCard'
import ItemCard from './assets/ItemCard'
import ClaimBadge from './assets/ClaimBadge'

const user: User = {
  id: 1,
  name: 'Mika Santos',
  email: 'mika@example.com',
  role: 'student',
  isActive: true,
  score: 95,
}

const item: LostFoundItem = {
  id: 1,
  title: 'Black water bottle',
  description: 'Left near the computer lab after the morning class.',
  category: 'Personal item',
  status: 'lost',
  location: 'IT Building - Room 302',
  postedByUserId: 1,
  createdAt: new Date('2026-07-18T08:30:00'),
}

const claim: Claim = {
  id: 1,
  itemId: 1,
  claimantUserId: 1,
  notes: 'This matches the bottle I left during the morning lab session.',
  status: 'pending',
  createdAt: new Date('2026-07-18T14:05:00'),
}

function App() {
  return (
    <div className="app">
      <h1>Lost & Found</h1>
      <UserCard
        user={user}
        onSelect={(u) => console.log('Selected:', u)}
      />
      <ItemCard
        item={item}
        onStatusChange={(i, s) => console.log('Status changed:', i.title, s)}
      />
      <ClaimBadge claim={claim}>
        <p>Awaiting admin review</p>
      </ClaimBadge>
    </div>
  )
}

export default App
