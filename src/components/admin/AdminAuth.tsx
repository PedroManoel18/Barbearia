import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { Lock, ArrowRight, X, Eye, EyeOff } from "lucide-react";

interface AdminAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, businessInfo } = useData();
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError(true);
      setErrorMessage("Por favor, digite a senha de acesso.");
      return;
    }

    const success = login(pin);
    if (success) {
      setError(false);
      setPin("");
      onSuccess();
    } else {
      setError(true);
      setErrorMessage("Senha incorreta. Verifique suas credenciais.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-auth-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Fechar janela de login"
        >
          <X className="size-5" />
        </button>

        {/* Ícone e Header */}
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-950 to-slate-800 text-emerald-400 shadow-md">
            <Lock className="size-7" />
          </div>

          <h3 id="admin-auth-title" className="mt-4 font-display text-2xl font-black text-slate-950">
            Acesso Administrativo
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Painel exclusivo para a gerência da {businessInfo.name}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Senha de Acesso ao Painel
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="Digite sua senha de administrador"
                className={`w-full rounded-xl border px-3.5 py-3 pr-10 text-slate-900 focus:outline-none transition-colors ${
                  error
                    ? "border-red-500 bg-red-50/20 focus:border-red-500"
                    : "border-slate-300 bg-slate-50 focus:border-emerald-500 focus:bg-white"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPin ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {error && (
              <p className="mt-1.5 text-xs font-semibold text-red-600">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 text-[11px] text-slate-500">
            <span className="font-bold text-slate-700 block">Dica de primeiro acesso:</span>
            A senha padrão de fábrica é <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">admin123</code>.
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3.5 text-xs font-bold text-white hover:bg-emerald-600 hover:shadow-neon-glow transition-all"
            >
              <span>Entrar no Painel</span>
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Voltar ao Site da Barbearia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
