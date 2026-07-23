import Link from "next/link";
import { BlobBanner } from "@/components/ui/BlobBanner";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center px-6 py-12 bg-slate-50 relative overflow-hidden">
      <div className="w-full max-w-md mx-auto relative z-10">
        {/* Logo + Titolo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
              <img src="/assets/logo.png" alt="Logo" width={48} height={48} className="object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Crea un Account</h1>
          <p className="text-slate-500 mt-1 text-sm">Inizia subito a usare l'app</p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-slate-500 mt-6">
          Hai già un account?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline underline-offset-2">
            Accedi
          </Link>
        </p>
      </div>
    </main>
  );
}
