import React from 'react';

export const AlertBadge = ({ status, type = 'status' }) => {
  if (!status) return null;

  let badgeClass = 'badge-info';

  const normalized = status.toLowerCase();

  if (['active', 'verified', 'checked in', 'resolved', 'low'].includes(normalized)) {
    badgeClass = 'badge-success';
  } else if (['pending', 'reserved', 'under review', 'needs review', 'medium'].includes(normalized)) {
    badgeClass = 'badge-warning';
  } else if (['rejected', 'suspended', 'cancelled', 'high', 'critical'].includes(normalized)) {
    badgeClass = 'badge-danger';
  } else if (['checked out', 'closed', 'not applicable'].includes(normalized)) {
    badgeClass = 'badge-info';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {status}
    </span>
  );
};
