// src/assets/UserCard.tsx
import type { User } from "../types/index";

interface UserCardProps {
  user: User;
  isSelected: boolean;
  onSelect: (user: User) => void;
}

function UserCard({ user, isSelected, onSelect }: UserCardProps) {
  const handleClick = (_e: React.MouseEvent<HTMLButtonElement>): void => {
    onSelect(user);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">{user.email}</p>
      <span className="mt-2 inline-flex rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:bg-sky-900/40 dark:text-sky-200">{user.role}</span>
      {user.score !== undefined && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Score: {user.score}</p>
      )}
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {isSelected ? 'This user is selected' : 'This user is not selected'}
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleClick}
          className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${isSelected ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {isSelected ? 'Selected' : 'Select User'}
        </button>
      </div>
    </div>
  );
}

export default UserCard;
