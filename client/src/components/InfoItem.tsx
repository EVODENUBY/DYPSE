import type { ReactNode } from 'react';

interface InfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | ReactNode;
  className?: string;
}

export default function InfoItem({ icon: Icon, label, value, className = '' }: InfoItemProps) {
  return (
    <div className={`flex items-start ${className}`}>
      <Icon className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm text-gray-900 mt-1 truncate">
          {value || 'Not specified'}
        </p>
      </div>
    </div>
  );
}
