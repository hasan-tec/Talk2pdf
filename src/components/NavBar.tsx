import React from 'react';
import { Link } from 'react-router-dom';
import { User, Upload } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface NavbarProps {
  onUploadClick: () => void;
}

export default function Navbar({ onUploadClick }: NavbarProps) {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <header className="bg-[#1A1A1A] border-b border-[#2A2A2A] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">PDF Q&A Assistant</Link>
        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-300 hover:text-white">About</Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Open user menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Profile</SheetTitle>
                <SheetDescription>
                  <div className="py-4">
                    <p className="font-medium">Name: {user?.fullName}</p>
                    <p className="text-sm text-gray-400">Email: {user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <Button
                    onClick={() => signOut()}
                    variant="destructive"
                    className="w-full mt-4"
                  >
                    Sign Out
                  </Button>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Button
            variant="outline"
            size="sm"
            onClick={onUploadClick}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload PDF
          </Button>
        </div>
      </div>
    </header>
  );
}