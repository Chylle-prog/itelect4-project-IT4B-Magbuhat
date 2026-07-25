// src/assets/UserCard.tsx
import type { User } from "../types/index";

interface UserCardProps {
  user: User;
  isSelected: boolean;
  onSelect: (user: User) => void;
}

function UserCard({ user, isSelected, onSelect }: UserCardProps) {
  // typed onClick event handler
  const handleClick = (_e: React.MouseEvent<HTMLButtonElement>): void => {
    onSelect(user);
  };

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p className="user-email">{user.email}</p>
      <span className={`badge badge-role`}>{user.role}</span>
      {user.score !== undefined && (
        <p className="user-score">Score: {user.score}</p>
      )}
      <p className="selection-state">
        {isSelected ? 'This user is selected' : 'This user is not selected'}
      </p>
      <div className="card-actions">
        <button onClick={handleClick}>{isSelected ? 'Selected' : 'Select User'}</button>
      </div>
    </div>
  );
}

export default UserCard;
