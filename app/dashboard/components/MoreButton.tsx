import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Settings, 
  RefreshCw, 
  Info, 
  HelpCircle,
  ChevronDown,
  KeySquareIcon,
  LogOut
} from 'lucide-react';

const MoreButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 z-[100000000000000001]">
        <Link href="/dashboard/keys">
          <DropdownMenuItem>
            <KeySquareIcon className="h-4 w-4 mr-2" />
            Keys
          </DropdownMenuItem>
        </Link>
          <DropdownMenuItem className={`text-red-500 hover:text-red-500`}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link href="/about">
          <DropdownMenuItem>
            <Info className="h-4 w-4 mr-2" />
            About
          </DropdownMenuItem>
        </Link>
        <Link href="/help">
          <DropdownMenuItem>
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreButton; 