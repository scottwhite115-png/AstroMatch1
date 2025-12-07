"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type Notification = {
  id: string;
  userId: string;
  actorId: string;
  type: "POST_REPLY" | "COMMENT_REPLY";
  postId: string | null;
  commentId: string | null;
  createdAt: string;
  readAt: string | null;
  postTopic?: string | null;
};

export function NotificationsBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/community/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.readAt).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    const unreadIds = notifications
      .filter((n) => !n.readAt)
      .map((n) => n.id);

    if (unreadIds.length === 0) return;

    try {
      const res = await fetch("/api/community/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: unreadIds }),
      });

      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  const getNotificationText = (notification: Notification) => {
    if (notification.type === "POST_REPLY") {
      return "replied to your post";
    } else {
      return "replied to your comment";
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.postId && notification.postTopic) {
      return `/community/${notification.postTopic}/${notification.postId}`;
    }
    return "/community";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-800/60 transition-colors"
      >
        <Bell size={20} className="text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 shadow-xl z-50 max-h-96 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-50">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs text-emerald-400 hover:text-emerald-300"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-slate-400 text-center">
                No notifications yet
              </p>
            ) : (
              <div className="divide-y divide-slate-800">
                {notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    href={getNotificationLink(notification)}
                    onClick={() => setIsOpen(false)}
                    className={`block p-3 hover:bg-slate-800/40 transition-colors ${
                      !notification.readAt ? "bg-slate-800/20" : ""
                    }`}
                  >
                    <p className="text-xs text-slate-300">
                      <span className="text-slate-400">
                        {notification.actorId.slice(0, 8)}...
                      </span>{" "}
                      {getNotificationText(notification)}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

