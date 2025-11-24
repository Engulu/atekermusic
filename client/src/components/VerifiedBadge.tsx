import { BadgeCheck } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export default function VerifiedBadge({ size = 'md', showTooltip = true }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const badge = (
    <BadgeCheck
      className={`${sizeClasses[size]} text-blue-500 fill-blue-500/20 flex-shrink-0`}
      aria-label="Verified Artist"
    />
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center cursor-help">
          {badge}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">Verified Artist</p>
        <p className="text-xs text-muted-foreground">
          This artist's identity has been confirmed by Ateker Music
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
