"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EventClientActionsProps {
  eventId: string;
  price: number | null;
  spotsLeft: number;
  isFull: boolean;
}

export default function EventClientActions({ eventId, price, spotsLeft, isFull }: EventClientActionsProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleActionClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setPaymentState('processing');
    setTimeout(() => {
      setPaymentState('success');
    }, 2000);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    if (paymentState === 'success') {
      router.push("/");
    }
  };

  const isFree = !price || price === 0;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 px-5 py-4 pb-8 bg-white border-t border-slate-200 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-4 max-w-lg mx-auto">
          <div className="flex flex-col flex-1">
            <span className="text-[17px] font-bold text-slate-900">
              {isFree ? 'Gratis' : `€ ${price?.toFixed(2)}`}
            </span>
            <span className={`text-[12px] font-bold ${spotsLeft <= 2 ? 'text-red-500' : 'text-slate-500'}`}>
              {isFull ? 'Nessun posto disponibile' : `${spotsLeft} posti rimasti`}
            </span>
          </div>

          <Button 
            disabled={isFull}
            onClick={handleActionClick}
            size="lg"
            className={`px-8 rounded-xl font-bold transition-all ${
              isFull 
                ? 'bg-slate-100 text-slate-400' 
                : 'bg-slate-900 text-white active:scale-95'
            }`}
          >
            {isFull ? 'Completo' : (isFree ? 'Partecipa' : 'Iscriviti')}
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6 border-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-[17px] font-bold text-slate-900">
              <div className="bg-slate-100 text-slate-900 p-2.5 rounded-full border border-slate-200">
                {isFree ? <CheckCircle2 size={20} /> : <CreditCard size={20} />}
              </div>
              {isFree ? 'Conferma Iscrizione' : 'Pagamento Sicuro'}
            </DialogTitle>
            <DialogDescription className="text-[13px] font-medium text-slate-500">
              Stai per iscriverti all'evento. Conferma i dettagli qui sotto.
            </DialogDescription>
          </DialogHeader>
          
          {paymentState === 'idle' && (
            <div className="flex flex-col mt-4">
              <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-200">
                <div className="flex justify-between text-[14px] mb-2">
                  <span className="text-slate-600 font-medium">Quota partecipazione</span>
                  <span className="font-bold text-slate-900">{isFree ? 'Gratis' : `€ ${price?.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-[14px] mb-4">
                  <span className="text-slate-600 font-medium">Commissioni</span>
                  <span className="font-bold text-slate-900">€ 0.00</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between">
                  <span className="font-bold text-slate-900">Totale</span>
                  <span className="text-[18px] font-black text-slate-900">{isFree ? '€ 0.00' : `€ ${price?.toFixed(2)}`}</span>
                </div>
              </div>

              {!isFree && (
                <p className="text-[10px] text-slate-400 font-bold text-center flex items-center justify-center gap-1 mb-4">
                  <ShieldCheck size={12} /> Protetto dal sistema
                </p>
              )}

              <div className="flex gap-3 mt-2">
                <Button 
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl h-12 border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Annulla
                </Button>
                <Button 
                  onClick={handleConfirm}
                  className="flex-1 rounded-xl h-12 bg-slate-900 text-white font-bold hover:bg-black"
                >
                  {isFree ? 'Conferma' : 'Paga ora'}
                </Button>
              </div>
            </div>
          )}

          {paymentState === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={40} className="text-slate-900 animate-spin mb-4" />
              <h3 className="text-[17px] font-bold text-slate-900 mb-1">
                {isFree ? 'Elaborazione iscrizione...' : 'Autorizzazione pagamento...'}
              </h3>
              <p className="text-[13px] text-slate-500 font-medium">Non chiudere l'app</p>
            </div>
          )}

          {paymentState === 'success' && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-16 h-16 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center mb-6 animate-bounce border border-slate-200">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tutto fatto!</h3>
              <p className="text-[14px] text-slate-500 text-center mb-8 font-medium">
                {isFree ? "Sei ufficialmente iscritto alla partita." : "Pagamento completato. Il tuo posto è riservato!"}
              </p>
              <Button 
                onClick={handleClose}
                size="lg"
                className="w-full rounded-xl bg-slate-900 text-white font-bold hover:bg-black h-12"
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
