import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FileMoreButton() {
  return (
    <Button variant="ghost" size="sm" className="p-1">
      <MoreVertical className="w-4 h-4" />
    </Button>
  );
} 