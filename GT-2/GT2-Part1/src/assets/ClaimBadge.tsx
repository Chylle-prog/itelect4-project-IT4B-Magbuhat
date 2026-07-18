// src/assets/ClaimBadge.tsx
import type { Claim } from "../types/index";

interface ClaimBadgeProps {
  claim: Claim;
  children?: React.ReactNode;
}

const ClaimBadge: React.FC<ClaimBadgeProps> = ({ claim, children }) => {
  return (
    <div className="claim-badge">
      <div className="card-topline">
        <span className={`badge badge-${claim.status}`}>{claim.status}</span>
        <span className="claim-item">Item #{claim.itemId}</span>
      </div>
      <p className="claim-notes">{claim.notes}</p>
      {claim.verifiedByUserId !== undefined && (
        <p className="claim-verified">Verified by User {claim.verifiedByUserId}</p>
      )}
      {children}
    </div>
  );
};

export default ClaimBadge;
