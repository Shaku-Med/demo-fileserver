import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search..."
        className="pl-8 w-full md:w-46"
      />
    </div>
  );
} 