"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface EventClientActionsProps {
  eventId: string;
  price: number | null;
  spotsLeft: number;
  isFull: boolean;
  isCreator?: boolean;
  isParticipating?: boolean;
}

export default function EventClientActions({ eventId, price, spotsLeft, isFull, isCreator, isParticipating }: EventClientActionsProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [loading, setLoading] = useState(false);

  const handleActionClick = () => {
    if (isParticipating) {
      handleLeave();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleLeave = async () => {
    if (!confirm("Sei sicuro di voler annullare la tua partecipazione?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/join`, { method: "DELETE" });
      if (!res.ok) throw new Error("Errore");
      toast.success("Partecipazione annullata");
      router.refresh();
    } catch (e: any) {
      toast.error("Impossibile annullare la partecipazione");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setPaymentState('processing');
    try {
      const res = await fetch(`/api/events/${eventId}/join`, { method: "POST" });
      if (!res.ok) throw new Error("Errore iscrizione");
      setPaymentState('success');
      router.refresh();
    } catch (e: any) {
      toast.error("Errore durante l'iscrizione");
      setPaymentState('idle');
      setIsModalOpen(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const isFree = !price || price === 0;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 px-5 py-4 pb-8 bg-[#0C0C0E]/90 backdrop-blur-xl border-t border-[#222226] z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4 max-w-lg mx-auto">
          {isCreator ? (
            <>
              <Button 
                variant="outline"
                onClick={async () => {
                  if (confirm("Sei sicuro di voler eliminare questo evento?")) {
                    try {
                      const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
                      if (!res.ok) throw new Error("Errore eliminazione");
                      toast.success("Evento eliminato");
                      router.push('/dashboard');
                      router.refresh();
                    } catch (e: any) {
                      toast.error("Errore eliminazione");
                    }
                  }
                }}
                className="flex-1 rounded-xl font-bold border-red-200 text-red-600 hover:bg-red-50"
              >
                Elimina
              </Button>
              <Button 
                onClick={() => router.push(`/events/${eventId}/edit`)}
                className="flex-1 rounded-xl bg-slate-900 text-white font-bold active:scale-95"
              >
                Modifica
              </Button>
            </>
          ) : (
            <>
              <div className="flex flex-col flex-1">
                <span className="text-[17px] font-black text-white">
                  {isFree ? 'Gratis' : `€ ${price?.toFixed(2)}`}
                </span>
                <span className={`text-[12px] font-bold ${spotsLeft <= 2 ? 'text-red-500' : 'text-[#8E8E93]'}`}>
                  {isFull ? 'Nessun posto disponibile' : `${spotsLeft} posti rimasti`}
                </span>
              </div>

              <Button 
                disabled={isFull && !isParticipating || loading}
                onClick={handleActionClick}
                size="lg"
                className={`px-8 rounded-[12px] font-black uppercase tracking-wider transition-all ${
                  isParticipating
                    ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20'
                    : isFull 
                      ? 'bg-[#16161A] text-[#8E8E93]' 
                      : 'bg-[#CCFF00] text-black hover:bg-[#b3ff00] active:scale-95'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" size={20}/> : 
                 isParticipating ? 'Annulla' :
                 isFull ? 'Completo' : (isFree ? 'Partecipa' : 'Iscriviti')}
              </Button>
            </>
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#16161A] rounded-2xl p-6 border-[#222226]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-[17px] font-black text-white">
              <div className="bg-[#222226] text-[#CCFF00] p-2.5 rounded-full border border-[#222226]">
                {isFree ? <CheckCircle2 size={20} /> : <CreditCard size={20} />}
              </div>
              {isFree ? 'Conferma Iscrizione' : 'Pagamento Sicuro'}
            </DialogTitle>
            <DialogDescription className="text-[13px] font-medium text-[#8E8E93]">
              Stai per iscriverti all'evento. Conferma i dettagli qui sotto.
            </DialogDescription>
          </DialogHeader>
          
          {paymentState === 'idle' && (
            <div className="flex flex-col mt-4">
              <div className="bg-[#0C0C0E] p-4 rounded-[12px] mb-6 border border-[#222226]">
                <div className="flex justify-between text-[14px] mb-2">
                  <span className="text-[#8E8E93] font-medium">Quota partecipazione</span>
                  <span className="font-bold text-white">{isFree ? 'Gratis' : `€ ${price?.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-[14px] mb-4">
                  <span className="text-[#8E8E93] font-medium">Commissioni</span>
                  <span className="font-bold text-white">€ 0.00</span>
                </div>
                <div className="border-t border-[#222226] pt-3 flex justify-between">
                  <span className="font-bold text-white">Totale</span>
                  <span className="text-[18px] font-black text-[#CCFF00]">{isFree ? '€ 0.00' : `€ ${price?.toFixed(2)}`}</span>
                </div>
              </div>

              {!isFree && (
                <p className="text-[10px] text-[#8E8E93] font-bold text-center flex items-center justify-center gap-1 mb-4">
                  <ShieldCheck size={12} /> Protetto dal sistema
                </p>
              )}

              <div className="flex gap-3 mt-2">
                <Button 
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-[12px] h-12 border-[#222226] text-white font-bold hover:bg-[#222226] hover:text-white"
                >
                  Annulla
                </Button>
                <Button 
                  onClick={handleConfirm}
                  className="flex-1 rounded-[12px] h-12 bg-[#CCFF00] text-black font-black hover:bg-[#b3ff00]"
                >
                  {isFree ? 'Conferma' : 'Paga ora'}
                </Button>
              </div>
            </div>
          )}

          {paymentState === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={40} className="text-[#CCFF00] animate-spin mb-4" />
              <h3 className="text-[17px] font-bold text-white mb-1">
                {isFree ? 'Elaborazione iscrizione...' : 'Autorizzazione pagamento...'}
              </h3>
              <p className="text-[13px] text-[#8E8E93] font-medium">Non chiudere l'app</p>
            </div>
          )}

          {paymentState === 'success' && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-16 h-16 bg-[#CCFF00]/10 text-[#CCFF00] rounded-full flex items-center justify-center mb-6 animate-bounce border border-[#CCFF00]/50">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Tutto fatto!</h3>
              <p className="text-[14px] text-[#8E8E93] text-center mb-8 font-medium">
                {isFree ? "Sei ufficialmente iscritto alla partita." : "Pagamento completato. Il tuo posto è riservato!"}
              </p>
              <Button 
                onClick={handleClose}
                size="lg"
                className="w-full rounded-[12px] bg-[#CCFF00] text-black font-black hover:bg-[#b3ff00] h-12"
              >
                Torna alla Home
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
