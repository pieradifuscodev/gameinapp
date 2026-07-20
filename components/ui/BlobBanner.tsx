"use client";

import React from "react";

interface BlobBannerProps {
    title: string;
    subtitle?: string;
    badge?: string;
    actionText?: string;
    onActionClick?: () => void;
    variant?: "primary" | "emerald" | "amber";
    className?: string;
    showLogo?: boolean;
}

export const BlobBanner: React.FC<BlobBannerProps> = ({
    title,
    subtitle,
    badge,
    actionText,
    onActionClick,
    variant = "primary",
    className = "",
    showLogo = false,
}) => {
    const colorStyles = {
        primary: {
            bg: "linear-gradient(135deg, #0060FD 0%, #003db3 100%)",
            blob1: "rgba(255,255,255,0.25)",
            blob2: "rgba(255,255,255,0.15)",
            blob3: "rgba(255,255,255,0.2)",
            badgeBg: "bg-white/20 text-white border-white/30",
            buttonBg: "bg-white text-[#0060FD] hover:bg-white/90",
        },
        emerald: {
            bg: "linear-gradient(135deg, #10b981 0%, #065f46 100%)",
            blob1: "rgba(255,255,255,0.25)",
            blob2: "rgba(255,255,255,0.15)",
            blob3: "rgba(255,255,255,0.2)",
            badgeBg: "bg-white/20 text-white border-white/30",
            buttonBg: "bg-white text-emerald-600 hover:bg-white/90",
        },
        amber: {
            bg: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
            blob1: "rgba(255,255,255,0.25)",
            blob2: "rgba(255,255,255,0.15)",
            blob3: "rgba(255,255,255,0.2)",
            badgeBg: "bg-white/20 text-white border-white/30",
            buttonBg: "bg-white text-amber-600 hover:bg-white/90",
        },
    }[variant];

    return (
        <div
            className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl ${className}`}
            style={{ background: colorStyles.bg }}
        >
            {/* Pure CSS Blobs */}
            <div
                className="absolute -top-8 -right-8 w-40 h-40 rounded-full animate-blob"
                style={{ background: colorStyles.blob1, filter: "blur(20px)" }}
            />
            <div
                className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full animate-blob animation-delay-2000"
                style={{ background: colorStyles.blob2, filter: "blur(25px)" }}
            />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full animate-blob animation-delay-4000"
                style={{ background: colorStyles.blob3, filter: "blur(20px)" }}
            />

            {/* Contenuto */}
            <div className="relative z-10 flex flex-col gap-3">
                {showLogo && (
                    <div className="flex justify-center mb-1">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/30 shadow-sm w-fit">
                            <img src="/assets/logo.png" alt="Logo" width={56} height={56} className="object-contain" />
                        </div>
                    </div>
                )}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="max-w-md space-y-2">
                    {badge && (
                        <span
                            className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-sm ${colorStyles.badgeBg}`}
                        >
                            {badge}
                        </span>
                    )}
                    <h3 className="text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-sm text-white/80 leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </div>

                {actionText && (
                    <button
                        onClick={onActionClick}
                        className={`w-full sm:w-auto shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 shadow-md ${colorStyles.buttonBg}`}
                    >
                        {actionText}
                    </button>
                )}
                </div>
            </div>
        </div>
    );
};