"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { UserAvatar } from "./UserAvatar";

interface User {
  name: string;
  profile: string;
}

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-700 transition-colors duration-200"
      >
        <UserAvatar name={user.name} className="w-10 h-10 text-sm" />
        <div className="flex-1 overflow-hidden">
          <p className="font-semibold text-white truncate">{user.name}</p>
        </div>
        <ChevronUp
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 animate-fade-in-up">
          <div className="p-2">
            <div className="p-3 rounded-lg bg-gray-900/50 mb-2">
              <p className="font-semibold text-white truncate">{user.name}</p>
            </div>
            <div className="border-t border-gray-700 my-1"></div>
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
