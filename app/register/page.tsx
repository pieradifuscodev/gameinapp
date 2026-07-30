import Link from "next/link";
import { BlobBanner } from "@/components/ui/BlobBanner";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
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
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">Crea un Account</h1>
          <p className="text-[#8E8E93] mt-1 text-sm font-bold">Inizia subito a usare l'app</p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-[#8E8E93] font-bold mt-6">
          Hai già un account?{" "}
          <Link href="/login" className="font-black text-[#CCFF00] hover:underline underline-offset-2">
            Accedi
          </Link>
        </p>
      </div>
    </main>
  );
}
