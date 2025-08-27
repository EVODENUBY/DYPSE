import { PencilIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

interface ProfileCardProps {
  title: ReactNode;
  children: ReactNode;
  onEdit: () => void;
  className?: string;
}

export default function ProfileCard({ title, children, onEdit, className = '' }: ProfileCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-gray-400 hover:text-indigo-600"
          aria-label={`Edit ${typeof title === 'string' ? title : 'section'}`}
        >
          <PencilIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}
