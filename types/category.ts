type IconLibrary = string; 
export interface Category {
  id: string;
  name: string;
  icon: string;
  iconLibrary: IconLibrary;
}

export interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}
