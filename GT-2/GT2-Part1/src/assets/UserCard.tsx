// src/assets/UserCard.tsx
import type { User } from "../types/index";

interface UserCardProps {
  user: User;
  onSelect: (user: User) => void;
}

function UserCard({ user, onSelect }: UserCardProps) {
  // typed onClick event handler
  const handleClick = (_e: React.MouseEvent<HTMLButtonElement>): void => {
    onSelect(user);
  };

  // typed onChange event handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log("Search:", e.target.value);
  };

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p className="user-email">{user.email}</p>
      <span className={`badge badge-role`}>{user.role}</span>
      {user.score !== undefined && (
        <p className="user-score">Score: {user.score}</p>
      )}
      <div className="card-actions">
        <button onClick={handleClick}>Select User</button>
        <input onChange={handleSearch} placeholder="Search users..." />
      </div>
    </div>
  );
}

export default UserCard;
