"use client";

import { signIn, signOut } from "next-auth/react";

export function AdminLoginButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/admin" })}
      className="inline-flex min-h-12 items-center justify-center rounded-md bg-grana px-5 py-3 text-sm font-bold text-white transition hover:bg-grana-oscuro focus:outline-none focus:ring-2 focus:ring-grana focus:ring-offset-2"
    >
      Entrar con Google
    </button>
  );
}

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin" })}
      className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/25 px-4 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-azul-noche"
    >
      Cerrar sesion
    </button>
  );
}
