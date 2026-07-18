// src/assets/ClaimBadge.tsx
import type { Claim } from "../types/index";

interface ClaimBadgeProps {
  claim: Claim | null;
  claimantName?: string;
  onAccept?: () => void;
  onReject?: () => void;
  children?: React.ReactNode;
}

const ClaimBadge: React.FC<ClaimBadgeProps> = ({
  claim,
  claimantName,
  onAccept,
  onReject,
  children,
}) => {
  const handleAccept = (_e: React.MouseEvent<HTMLButtonElement>): void => {
    if (onAccept) {
      onAccept();
    }
  };

  const handleReject = (_e: React.MouseEvent<HTMLButtonElement>): void => {
    if (onReject) {
      onReject();
    }
  };

  return (
    <div className="claim-badge">
      {claim ? (
        <>
          <div className="card-topline">
            <span className={`badge badge-${claim.status}`}>{claim.status}</span>
            <span className="claim-item">Item #{claim.itemId}</span>
          </div>
          <p className="claim-user">
            Claimant: {claimantName ?? `User ${claim.claimantUserId}`}
          </p>
          <p className="claim-notes">Evidence: {claim.notes}</p>
          {claim.verifiedByUserId !== undefined && (
            <p className="claim-verified">Verified by User {claim.verifiedByUserId}</p>
          )}
          <div className="card-actions">
            <button onClick={handleAccept}>Accept Claim</button>
            <button onClick={handleReject}>Reject Claim</button>
          </div>
          {children}
        </>
      ) : (
        <p className="claim-empty">No claim loaded yet.</p>
      )}
    </div>
  );
};

export default ClaimBadge;
