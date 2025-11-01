"use client";

import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-red-900/50 hover:text-white transition-colors duration-200 disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-5 w-5 mr-4 animate-spin" /> : <LogOut className="h-5 w-5 mr-4" />}
      <span className="font-medium">{loading ? "Cerrando..." : "Cerrar Sesión"}</span>
    </button>
  );
}