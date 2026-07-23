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

  if (loading) return <div className="h-screen bg-slate-50 flex items-center justify-center">Caricamento...</div>;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white pb-safe">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-bold text-slate-900 tracking-tight">Notifiche</h1>
        </div>
        <div className="flex items-center gap-3">
          {permissionState === 'granted' ? (
            <div 
              onClick={() => toast.success('Riceverai regolarmente gli inviti per le partite!')}
              className="w-8 h-8 rounded-full bg-slate-50 text-slate-900 flex items-center justify-center cursor-pointer border border-slate-200"
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
              className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center cursor-pointer border border-slate-200"
            >
              <BellOff size={16} />
            </div>
          )}

          {unreadCount > 0 && (
            <button 
              onClick={() => markAsRead()} 
              disabled={isMarkingRead}
              className={`text-[11px] font-bold text-slate-900 active:scale-95 transition-transform bg-slate-100 px-3 py-1.5 rounded-full ${isMarkingRead ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isMarkingRead ? '...' : 'Segna lette'}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center mt-10">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
              <Bell size={32} />
            </div>
            <h2 className="text-slate-900 font-bold mb-1">Nessuna notifica</h2>
            <p className="text-sm text-slate-500">Non hai ancora ricevuto notifiche.</p>
          </div>
        ) : (
          <div className="flex flex-col pb-20">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                onClick={() => handleNotificationClick(notification)}
                className={`py-4 border-b border-slate-100 cursor-pointer active:bg-slate-50 transition-colors flex gap-3 ${
                  notification.isRead ? "" : "bg-slate-50 -mx-4 px-4"
                }`}
              >
                <div className="pt-1 flex-shrink-0">
                  {notification.type === "SYSTEM" ? (
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Bell size={18} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Circle size={18} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className={`text-[14px] leading-tight ${notification.isRead ? "font-semibold text-slate-800" : "font-bold text-slate-900"}`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-slate-900 flex-shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-[13px] text-slate-600 leading-snug mb-1">{notification.message}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
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
