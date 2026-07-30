"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, UserCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
  userId: string;
  initialIsFollowing: boolean;
  compact?: boolean;
  isStructure?: boolean;
}

export function FollowButton({ userId, initialIsFollowing, compact = false, isStructure = false }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(`/api/users/${userId}/follow`, {
        method
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Errore durante l'operazione");
      }

      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? "Non segui più questo utente" : "Utente seguito con successo");
      router.refresh(); 
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleFollowToggle} 
      disabled={loading}
      variant={isFollowing ? "outline" : "default"}
      className={`font-black uppercase tracking-wider rounded-xl transition-all ${
        compact ? "h-8 px-3 text-xs w-auto" : "w-full h-11"
      } ${
        isFollowing 
          ? "border border-[#222226] text-white hover:bg-[#16161A] bg-transparent" 
          : isStructure 
            ? "bg-[#00F0FF] text-black hover:bg-[#00d8e6]" 
            : "bg-[#CCFF00] text-black hover:bg-[#b3ff00]"
      }`}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={compact ? 14 : 18} />
      ) : isFollowing ? (
        <>
          <UserCheck size={compact ? 14 : 18} className={compact ? "mr-1.5" : "mr-2"} />
          {compact ? "Segui Già" : "Segui Già"}
        </>
      ) : (
        <>
          <UserPlus size={compact ? 14 : 18} className={compact ? "mr-1.5" : "mr-2"} />
          Segui
        </>
      )}
    </Button>
  );
}
