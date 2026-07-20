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
    <div className="flex flex-col min-h-[100dvh] bg-slate-50 pb-safe">
      <div className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <h1 className="font-black text-xl text-gray-900 tracking-tight">Notifiche</h1>
        </div>
        <div className="flex items-center gap-3">
          {permissionState === 'granted' ? (
            <div 
              onClick={() => toast.success('Riceverai regolarmente gli inviti per le partite!')}
              className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center cursor-pointer shadow-sm border border-primary/20"
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
              className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center cursor-pointer shadow-sm border border-red-100"
            >
              <BellOff size={16} />
            </div>
          )}

          {unreadCount > 0 && (
            <button 
              onClick={() => markAsRead()} 
              disabled={isMarkingRead}
              className={`text-xs font-bold text-primary active:scale-95 transition-transform bg-primary/10 px-3 py-1.5 rounded-full ${isMarkingRead ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isMarkingRead ? 'Caricamento...' : 'Segna lette'}
            </button>
          )}
        </div>
      </div>

      <div className="p-4 flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <Bell size={32} />
            </div>
            <h2 className="text-gray-900 font-bold mb-1">Nessuna notifica</h2>
            <p className="text-sm text-gray-500">Non hai ancora ricevuto notifiche.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 rounded-2xl shadow-sm border cursor-pointer active:scale-[0.98] transition-all flex gap-3 ${
                  notification.isRead 
                    ? "bg-white border-gray-100" 
                    : "bg-primary/10/50 border-primary/20"
                }`}
              >
                <div className="pt-1 flex-shrink-0">
                  {notification.type === "SYSTEM" ? (
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      <Bell size={16} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                      <Circle size={16} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm ${notification.isRead ? "font-semibold text-gray-800" : "font-bold text-gray-900"}`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">{notification.message}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
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
