import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { whatsappLink } from "@/components/demo/data";

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <aside
      aria-label="Atendimento via WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5"
    >
      {/* Pill de Notificação / Status Online */}
      {showTooltip && (
        <div className="group relative flex items-center gap-2 rounded-full border border-emerald-500/30 bg-slate-900/90 px-4 py-2 text-xs font-medium text-white shadow-2xl backdrop-blur-md transition-all animate-bounce duration-1000">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span>Online agora · Resposta rápida</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="ml-1 rounded-full p-0.5 text-slate-400 hover:text-white"
            aria-label="Fechar notificação"
          >
            <X className="size-3" />
          </button>
        </div>
      )}

      {/* Botão Principal com Efeito Glow Neon Hype */}
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 p-4 text-slate-950 font-bold shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-108 hover:shadow-[0_0_50px_rgba(16,185,129,0.8)] active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none sm:px-6 sm:py-4"
        aria-label="Agendar horário no WhatsApp da BarberShop Garage (abre em nova aba)"
      >
        {/* Anel de Pulso Neon */}
        <span className="absolute -inset-1 -z-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-70 blur-md transition-all group-hover:opacity-100 group-hover:blur-lg animate-pulse" />

        {/* Ícone WhatsApp */}
        <div className="flex size-7 items-center justify-center rounded-full bg-slate-950 text-emerald-400 transition-transform group-hover:rotate-12">
          <MessageCircle className="size-4.5 fill-current" />
        </div>

        {/* Texto do Botão */}
        <div className="hidden flex-col text-left sm:flex">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900/80">
            Agendamento VIP
          </span>
          <span className="text-sm font-black tracking-tight text-slate-950">
            Agendar no WhatsApp
          </span>
        </div>
      </a>
    </aside>
  );
}
