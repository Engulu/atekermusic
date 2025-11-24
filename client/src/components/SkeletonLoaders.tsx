/**
 * Skeleton Loader Components
 * Provides visual feedback during data loading
 */

import { Card } from './ui/card';

// Song Card Skeleton
export function SongCardSkeleton() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="flex gap-4">
        {/* Cover Image Skeleton */}
        <div className="w-32 h-32 bg-muted rounded-lg flex-shrink-0" />
        
        {/* Content Skeleton */}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <div className="h-6 bg-muted rounded w-3/4" />
          
          {/* Artist */}
          <div className="h-4 bg-muted rounded w-1/2" />
          
          {/* Genre and Language */}
          <div className="flex gap-2">
            <div className="h-3 bg-muted rounded w-20" />
            <div className="h-3 bg-muted rounded w-20" />
          </div>
          
          {/* Stats */}
          <div className="flex gap-4">
            <div className="h-3 bg-muted rounded w-16" />
            <div className="h-3 bg-muted rounded w-16" />
            <div className="h-3 bg-muted rounded w-16" />
          </div>
          
          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <div className="h-12 bg-muted rounded w-24" />
            <div className="h-12 bg-muted rounded w-24" />
            <div className="h-12 bg-muted rounded w-24" />
          </div>
        </div>
      </div>
    </Card>
  );
}

// Artist Card Skeleton
export function ArtistCardSkeleton() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Profile Picture */}
        <div className="w-24 h-24 bg-muted rounded-full" />
        
        {/* Name */}
        <div className="h-5 bg-muted rounded w-32" />
        
        {/* Location */}
        <div className="h-3 bg-muted rounded w-24" />
        
        {/* Stats */}
        <div className="flex gap-4 w-full justify-center">
          <div className="h-3 bg-muted rounded w-16" />
          <div className="h-3 bg-muted rounded w-16" />
        </div>
        
        {/* Button */}
        <div className="h-10 bg-muted rounded w-full" />
      </div>
    </Card>
  );
}

// News Card Skeleton
export function NewsCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      {/* Image */}
      <div className="w-full h-48 bg-muted" />
      
      <div className="p-6 space-y-3">
        {/* Title */}
        <div className="h-6 bg-muted rounded w-full" />
        <div className="h-6 bg-muted rounded w-3/4" />
        
        {/* Excerpt */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
        
        {/* Meta */}
        <div className="flex gap-4 pt-2">
          <div className="h-3 bg-muted rounded w-20" />
          <div className="h-3 bg-muted rounded w-24" />
        </div>
      </div>
    </Card>
  );
}

// Event Card Skeleton
export function EventCardSkeleton() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="flex gap-4">
        {/* Date Box */}
        <div className="w-16 h-16 bg-muted rounded flex-shrink-0" />
        
        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-3 bg-muted rounded w-1/3" />
        </div>
      </div>
    </Card>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-muted rounded" />
        </td>
      ))}
    </tr>
  );
}

// Profile Header Skeleton
export function ProfileHeaderSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center gap-6">
        {/* Profile Picture */}
        <div className="w-32 h-32 bg-muted rounded-full flex-shrink-0" />
        
        <div className="flex-1 space-y-3">
          {/* Name */}
          <div className="h-8 bg-muted rounded w-64" />
          
          {/* Location */}
          <div className="h-4 bg-muted rounded w-48" />
          
          {/* Stats */}
          <div className="flex gap-6">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Grid Skeleton (for song/artist grids)
export function GridSkeleton({ 
  count = 6, 
  component: Component = SongCardSkeleton 
}: { 
  count?: number; 
  component?: React.ComponentType;
}) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}

// List Skeleton
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg animate-pulse">
          <div className="w-12 h-12 bg-muted rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Page Loading Skeleton
export function PageLoadingSkeleton() {
  return (
    <div className="container py-8 space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-4">
        <div className="h-10 bg-muted rounded w-64" />
        <div className="h-4 bg-muted rounded w-96" />
      </div>
      
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 bg-muted rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// Dashboard Stats Skeleton
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-8 bg-muted rounded w-16" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// Form Skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-10 bg-muted rounded w-full" />
        </div>
      ))}
      <div className="h-10 bg-muted rounded w-32" />
    </div>
  );
}

// Search Results Skeleton
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Tabs */}
      <div className="flex gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 bg-muted rounded w-24" />
        ))}
      </div>
      
      {/* Results */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg" />
        ))}
      </div>
    </div>
  );
}
