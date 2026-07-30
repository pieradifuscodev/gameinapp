"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Bell, BellOff, Circle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionState(Notification.permission);
    }
    
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchNotifications();
    }
  }, [status, router]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Errore fetch notifiche", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id?: string) => {
    if (isMarkingRead) return;
    setIsMarkingRead(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      
      if (res.ok) {
        if (id) {
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } else {
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }
      }
    } catch (error) {
      console.error("Errore update notifiche", error);
      toast.error("Errore durante l'aggiornamento delle notifiche.");
    } finally {
      setIsMarkingRead(false);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  if (loading) return <div className="h-screen bg-[#0C0C0E] flex items-center justify-center text-white font-black">Caricamento...</div>;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex flex-col min-h-screen bg-[#0C0C0E] pb-safe text-white">
      {/* Sub-header actions */}
      <div className="flex justify-between items-center px-4 py-3 bg-[#16161A] border-b border-[#222226]">
        <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wide">Le tue notifiche</span>
        <div className="flex items-center gap-3">
          {permissionState === 'granted' ? (
            <div 
              onClick={() => toast.success('Riceverai regolarmente gli inviti per le partite!')}
              className="w-8 h-8 rounded-full bg-[#0C0C0E] text-[#CCFF00] flex items-center justify-center cursor-pointer border border-[#222226]"
            >
              <Bell size={16} />
            </div>
          ) : (
            <div 
              onClick={() => {
                if (permissionState === 'denied') {
                  toast('Sblocca le notifiche dall\'icona del lucchetto 🔒 nella barra del browser.', { duration: 5000 });
                } else if ('Notification' in window) {
                  Notification.requestPermission().then(permission => {
                    setPermissionState(permission);
                    if (permission === 'granted') toast.success('Notifiche attivate!');
                  });
                }
              }}
              className="w-8 h-8 rounded-full bg-[#0C0C0E] text-[#8E8E93] flex items-center justify-center cursor-pointer border border-[#222226]"
            >
              <BellOff size={16} />
            </div>
          )}

          {unreadCount > 0 && (
            <button 
              onClick={() => markAsRead()} 
              disabled={isMarkingRead}
              className={`text-[11px] font-black uppercase tracking-wider text-black bg-[#CCFF00] active:scale-95 transition-transform px-3 py-1.5 rounded-full ${isMarkingRead ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isMarkingRead ? '...' : 'Segna lette'}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 mt-2">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center mt-10">
            <div className="w-16 h-16 bg-[#16161A] border border-[#222226] rounded-xl flex items-center justify-center text-[#8E8E93] mb-4">
              <Bell size={32} />
            </div>
            <h2 className="text-white font-black mb-1">Nessuna notifica</h2>
            <p className="text-sm text-[#8E8E93]">Non hai ancora ricevuto notifiche.</p>
          </div>
        ) : (
          <div className="flex flex-col pb-20">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                onClick={() => handleNotificationClick(notification)}
                className={`py-4 border-b border-[#222226] cursor-pointer active:bg-[#16161A] transition-colors flex gap-3 ${
                  notification.isRead ? "" : "bg-[#16161A]/40 -mx-4 px-4"
                }`}
              >
                <div className="pt-1 flex-shrink-0">
                  {notification.type === "SYSTEM" ? (
                    <div className="w-10 h-10 rounded-full bg-[#0C0C0E] border border-[#222226] text-[#CCFF00] flex items-center justify-center">
                      <Bell size={18} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#0C0C0E] border border-[#222226] text-[#00F0FF] flex items-center justify-center">
                      <Circle size={18} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className={`text-[14px] leading-tight ${notification.isRead ? "font-bold text-white" : "font-black text-[#CCFF00]"}`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#CCFF00] flex-shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#8E8E93] leading-snug mb-1 font-medium">{notification.message}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {new Date(notification.createdAt).toLocaleDateString('it-IT')} • {new Date(notification.createdAt).toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
