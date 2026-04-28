"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const fetchNotifications = async () => {
    const res = await fetch("/api/notifications");
    if (res.ok) {
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnread(data.notifications?.filter((n) => !n.read).length || 0);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-400 hover:text-white transition"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">Notifications</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-white text-xs"
            >
              Close
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-4 border-b border-gray-800 ${!n.read ? "bg-blue-500/5" : ""}`}
                >
                  <p className="text-white text-sm font-medium">{n.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{n.message}</p>
                  <p className="text-gray-600 text-xs mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}