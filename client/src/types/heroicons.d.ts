declare module '@heroicons/react/outline' {
  import { FC, SVGProps } from 'react';
  
  type Icon = FC<SVGProps<SVGSVGElement>>;
  
  export const BellIcon: Icon;
  export const SearchIcon: Icon;
  export const UserCircleIcon: Icon;
  export const ChevronDownIcon: Icon;
  
  // Add other icons as needed
  
  // Index signature for dynamic icon imports
  const icons: { [key: string]: Icon };
  export default icons;
}
