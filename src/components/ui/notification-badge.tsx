'use client';

interface NotificationBadgeProps {
  count: number;
  className?: string;
  maxCount?: number;
}

export function NotificationBadge({ count, className = '', maxCount = 99 }: NotificationBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <span className={`
      absolute -top-1 -right-1 
      min-w-[18px] h-[18px] 
      bg-red-500 text-white 
      text-xs font-medium 
      flex items-center justify-center 
      rounded-full 
      px-1
      ${className}
    `}>
      {displayCount}
    </span>
  );
}