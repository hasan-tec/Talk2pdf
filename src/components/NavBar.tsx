import React from 'react';
import { SignInButton, SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-react';
import { LogOut, User } from 'lucide-react';
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const Navbar = ({ onDashboard }) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#1A1A1A] border-b border-[#2A2A2A] px-4 py-3 z-50">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold">AskYourPDF</h1>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-300 hover:text-white">Features</a>
            <a href="#tools" className="text-gray-300 hover:text-white">Tools</a>
            <a href="#faq" className="text-gray-300 hover:text-white">FAQ</a>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <SignedIn>
            {onDashboard ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
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
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            ) : (
              <>
                <Button variant="ghost" onClick={onDashboard}>
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </>
            )}
          </SignedIn>
          
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost">
                Sign In
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;