"use client";

import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import NotificationBell from "./NotificationBell";

export default function Navbar({ user }) {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <div>
            <p className="font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition text-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}