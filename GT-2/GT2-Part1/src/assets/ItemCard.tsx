// src/assets/ItemCard.tsx
import type { LostFoundItem } from "../types/index";

interface ItemCardProps {
  item: LostFoundItem;
  onStatusChange?: (item: LostFoundItem, status: LostFoundItem["status"]) => void;
}

function ItemCard({ item, onStatusChange }: ItemCardProps) {
  // typed onChange event handler
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    if (onStatusChange) {
      onStatusChange(item, e.target.value as LostFoundItem["status"]);
    }
  };

  return (
    <div className="item-card">
      <div className="card-topline">
        <span className={`badge badge-${item.status}`}>{item.status}</span>
        <span className="item-category">{item.category}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <p className="item-location">📍 {item.location}</p>
      <select value={item.status} onChange={handleStatusChange}>
        <option value="lost">Lost</option>
        <option value="found">Found</option>
      </select>
    </div>
  );
}

export default ItemCard;
