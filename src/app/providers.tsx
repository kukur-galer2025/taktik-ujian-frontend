"use client";

import { AuthProvider } from "@/context/AuthContext";
import PhoneNumberModal from "@/components/PhoneNumberModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <PhoneNumberModal />
    </AuthProvider>
  );
}
