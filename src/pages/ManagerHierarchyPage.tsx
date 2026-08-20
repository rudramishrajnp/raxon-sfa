import React from 'react';
import { ManagerHierarchyManagement } from '../components/ManagerHierarchyManagement';

export default function ManagerHierarchyPage() {
  return (
    <div className="py-2">
      <ManagerHierarchyManagement embedded={false} />
    </div>
  );
}
