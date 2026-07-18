// src/assets/ItemCard.tsx
import type { LostFoundItem } from "../types/index";

interface ItemCardProps {
  item: LostFoundItem;
}

function ItemCard({ item }: ItemCardProps) {

  return (
    <div className="item-card">
      <div className="card-topline">
        <span className={`badge badge-${item.status}`}>{item.status}</span>
        <span className="item-category">{item.category}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <p className="item-location">📍 {item.location}</p>
      <p className="item-status">Status: {item.status}</p>
    </div>
  );
}

export default ItemCard;
