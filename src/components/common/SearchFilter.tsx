import { Search, SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode; // filter dropdowns
  viewMode?: 'grid' | 'table';
  onViewModeChange?: (mode: 'grid' | 'table') => void;
  showViewToggle?: boolean;
  className?: string;
}

export function SearchFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  children,
  viewMode,
  onViewModeChange,
  showViewToggle = false,
  className,
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Toggle (mobile-friendly) */}
        {children && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden h-9"
          >
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            Filters
          </Button>
        )}

        {/* Desktop filters */}
        <div className="hidden lg:flex items-center gap-2 flex-wrap">{children}</div>

        {/* View Toggle */}
        {showViewToggle && onViewModeChange && (
          <div className="flex items-center border rounded-md overflow-hidden">
            <button
              onClick={() => onViewModeChange('table')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'table' ? 'bg-brand text-white' : 'bg-background text-muted-foreground hover:bg-muted'
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid' ? 'bg-brand text-white' : 'bg-background text-muted-foreground hover:bg-muted'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {showFilters && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
