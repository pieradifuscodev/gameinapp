import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bentornato!</h1>
          <p className="text-slate-500 mt-1 text-sm">Accedi per gestire i tuoi eventi sportivi.</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-slate-500 font-medium mt-6">
          Non hai ancora un account?{" "}
          <Link href="/register" className="font-bold text-primary hover:underline underline-offset-2">
            Registrati ora
          </Link>
        </p>
      </div>
    </main>
  );
}
