import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center px-6 py-12 bg-[#0C0C0E] relative overflow-hidden">
      <div className="w-full max-w-md mx-auto relative z-10">
        {/* Logo + Titolo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#16161A] rounded-2xl shadow-sm border border-[#222226]">
              <img src="/assets/logo.png" alt="Logo" width={48} height={48} className="object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">Bentornato!</h1>
          <p className="text-[#8E8E93] mt-1 text-sm font-bold">Accedi per gestire i tuoi eventi sportivi.</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-[#8E8E93] font-bold mt-6">
          Non hai ancora un account?{" "}
          <Link href="/register" className="font-black text-[#CCFF00] hover:underline underline-offset-2">
            Registrati ora
          </Link>
        </p>
      </div>
    </main>
  );
}
