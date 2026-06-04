"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Target, BarChart3, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Beranda" },
  { href: "/my-tryouts", icon: Target, label: "TryoutKu" },
  { href: "/tryouts", icon: BookOpen, label: "Katalog" },
  { href: "/analytics", icon: BarChart3, label: "Analitik" },
  { href: "/profile", icon: User, label: "Profil" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl shadow-slate-900/10">
      <div className="flex items-stretch h-16 px-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 relative group"
            >
              {active && (
                <motion.div
                  layoutId="bottomNavActive"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-600 rounded-full"
                  transition={{ type: "spring", stiffness: 100, damping: 30 }}
                />
              )}
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                active ? "bg-brand-50" : "group-active:bg-slate-100"
              }`}>
                <Icon
                  size={20}
                  className={`transition-colors ${
                    active ? "text-brand-600" : "text-slate-400"
                  }`}
                  strokeWidth={active ? 2.5 : 1.75}
                />
              </div>
              <span className={`text-[10px] font-bold transition-colors leading-none ${
                active ? "text-brand-600" : "text-slate-400"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
