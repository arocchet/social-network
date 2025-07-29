'use client';

import { Check, CheckCheck } from 'lucide-react';

interface MessageStatusIconsProps {
  status: 'SENT' | 'DELIVERED' | 'READ';
  className?: string;
}

export function MessageStatusIcons({ status, className = '' }: MessageStatusIconsProps) {
  if (status === 'SENT') {
    return (
      <Check 
        className={`w-4 h-4 text-gray-400 ${className}`}
        aria-label="Message envoyé"
      />
    );
  }

  if (status === 'DELIVERED') {
    return (
      <CheckCheck 
        className={`w-4 h-4 text-gray-400 ${className}`}
        aria-label="Message livré"
      />
    );
  }

  if (status === 'READ') {
    return (
      <CheckCheck 
        className={`w-4 h-4 text-blue-500 ${className}`}
        aria-label="Message lu"
      />
    );
  }

  return null;
}