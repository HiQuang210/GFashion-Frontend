import { useState, useCallback, useMemo } from 'react';
import { CATEGORIES, SORT_OPTIONS } from '@/types/enum/filter';

export interface FilterState {
  sortBy: string;
  priceRange: { min: string; max: string };
  selectedProducer: string;
}

export interface UseFilterProps {
  initialFilters?: Partial<FilterState>;
  onFiltersChange?: (filters: FilterState) => void;
}

export interface UseFilterReturn {
  // Filter state
  filters: FilterState;
  selectedCategory: string;
  
  // Filter actions
  updateFilters: (newFilters: FilterState) => void;
  updateCategory: (category: string) => void;
  clearAllFilters: () => void;
  clearSpecificFilter: (filterType: keyof FilterState | 'category') => void;
  
  // Filter utilities
  buildApiParams: (searchQuery: string, page: number, limitItem: number) => Record<string, any>;
  getActiveFiltersText: () => string;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
}

const INITIAL_FILTER_STATE: FilterState = {
  sortBy: "newest",
  priceRange: { min: "", max: "" },
  selectedProducer: "",
};

export const useFilter = ({ 
  initialFilters = {}, 
  onFiltersChange 
}: UseFilterProps = {}): UseFilterReturn => {
  const [filters, setFilters] = useState<FilterState>({
    ...INITIAL_FILTER_STATE,
    ...initialFilters,
  });
  
  const [selectedCategory, setSelectedCategory] = useState("all");

  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  }, [onFiltersChange]);

  const updateCategory = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const clearAllFilters = useCallback(() => {
    const clearedFilters = { ...INITIAL_FILTER_STATE };
    setFilters(clearedFilters);
    setSelectedCategory("all");
    onFiltersChange?.(clearedFilters);
  }, [onFiltersChange]);

  const clearSpecificFilter = useCallback((filterType: keyof FilterState | 'category') => {
    if (filterType === 'category') {
      setSelectedCategory("all");
      return;
    }

    const updatedFilters = { ...filters };
    
    switch (filterType) {
      case 'sortBy':
        updatedFilters.sortBy = INITIAL_FILTER_STATE.sortBy;
        break;
      case 'priceRange':
        updatedFilters.priceRange = { ...INITIAL_FILTER_STATE.priceRange };
        break;
      case 'selectedProducer':
        updatedFilters.selectedProducer = INITIAL_FILTER_STATE.selectedProducer;
        break;
    }
    
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  }, [filters, onFiltersChange]);

  const validateAndParsePrice = useCallback((priceStr: string): number | null => {
    if (!priceStr || priceStr.trim() === '') return null;
    
    const cleanPrice = priceStr.replace(/[,\s]/g, '');
    const parsed = parseFloat(cleanPrice);
    
    return !isNaN(parsed) && parsed >= 0 ? parsed : null;
  }, []);

  const buildApiParams = useCallback((
    searchQuery: string, 
    page: number, 
    limitItem: number
  ): Record<string, any> => {
    const params: Record<string, any> = {
      page: page + 1,
      limitItem,
      sort: filters.sortBy,
    };
    
    // Search query
    if (searchQuery?.trim()) {
      params.searchQuery = searchQuery.trim();
    }
    
    // Category filter
    if (selectedCategory !== "all") {
      params.filter = selectedCategory.toLowerCase();
    }

    // Producer filter
    if (filters.selectedProducer?.trim()) {
      params.producer = filters.selectedProducer.trim();
    }

    // Price range filters with validation
    const minPrice = validateAndParsePrice(filters.priceRange.min);
    const maxPrice = validateAndParsePrice(filters.priceRange.max);
    
    if (minPrice !== null) {
      params.minPrice = minPrice;
    }
    
    if (maxPrice !== null) {
      params.maxPrice = maxPrice;
    }

    // Validate price range logic
    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      console.warn('Invalid price range: min price is greater than max price');
    }

    return params;
  }, [filters, selectedCategory, validateAndParsePrice]);

  const getActiveFiltersText = useCallback((): string => {
    const activeFilters: string[] = [];
    
    // Category filter
    if (selectedCategory !== "all") {
      const categoryLabel = CATEGORIES.find(cat => cat.id === selectedCategory)?.name;
      if (categoryLabel) {
        activeFilters.push(`Category: ${categoryLabel}`);
      }
    }
    
    // Producer filter
    if (filters.selectedProducer?.trim()) {
      activeFilters.push(`Producer: ${filters.selectedProducer}`);
    }
    
    // Price range filter
    if (filters.priceRange.min?.trim() || filters.priceRange.max?.trim()) {
      const minPrice = filters.priceRange.min?.trim() || '0';
      const maxPrice = filters.priceRange.max?.trim() || '∞';
      activeFilters.push(`Price: ${minPrice} - ${maxPrice} VND`);
    }
    
    // Sort filter (only show if not default)
    if (filters.sortBy !== INITIAL_FILTER_STATE.sortBy) {
      const sortLabel = SORT_OPTIONS.find(opt => opt.id === filters.sortBy)?.name;
      if (sortLabel) {
        activeFilters.push(`Sort: ${sortLabel}`);
      }
    }
    
    return activeFilters.join(" • ");
  }, [filters, selectedCategory]);

  // Computed values
  const hasActiveFilters = useMemo(() => {
    return (
      selectedCategory !== "all" ||
      filters.selectedProducer?.trim() !== "" ||
      filters.priceRange.min?.trim() !== "" ||
      filters.priceRange.max?.trim() !== "" ||
      filters.sortBy !== INITIAL_FILTER_STATE.sortBy
    );
  }, [filters, selectedCategory]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    
    if (selectedCategory !== "all") count++;
    if (filters.selectedProducer?.trim()) count++;
    if (filters.priceRange.min?.trim() || filters.priceRange.max?.trim()) count++;
    if (filters.sortBy !== INITIAL_FILTER_STATE.sortBy) count++;
    
    return count;
  }, [filters, selectedCategory]);

  return {
    // State
    filters,
    selectedCategory,
    
    // Actions
    updateFilters,
    updateCategory,
    clearAllFilters,
    clearSpecificFilter,
    
    // Utilities
    buildApiParams,
    getActiveFiltersText,
    hasActiveFilters,
    activeFiltersCount,
  };
};