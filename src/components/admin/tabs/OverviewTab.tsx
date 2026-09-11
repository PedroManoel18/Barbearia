import React from "react";
import { useData } from "@/context/DataContext";
import { Scissors, Users, Image as ImageIcon, Clock, ExternalLink } from "lucide-react";

export const OverviewTab: React.FC<{ onNavigateTab: (tabId: string) => void }> = ({ onNavigateTab }) => {
  const { services, team, gallery, storeStatus, businessInfo, mapsLink } = useData();

  const activeServices = services.filter((s) => s.active).length;
  const availableBarbers = team.filter((m) => m.available).length;
  const totalGallery = gallery.length;

  return (
    <div className="space-y-6">
      {/* Banner de Boas-Vindas */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
            Painel Administrativo Ativo
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gestão da {businessInfo.name}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Aqui você atualiza preços, serviços, equipe, horários e fotos da galeria. Qualquer
            alteração feita aqui reflete instantaneamente para os clientes no site.
          </p>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card Serviços */}
        <button
          onClick={() => onNavigateTab("services")}
          className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-emerald-500 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Serviços Ativos
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Scissors className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-black text-slate-950">
              {activeServices}
            </span>
            <span className="text-xs text-slate-500"> de {services.length} cadastrados</span>
          </div>
          <span className="mt-3 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            Gerenciar preços e itens →
          </span>
        </button>

        {/* Card Barbeiros */}
        <button
          onClick={() => onNavigateTab("team")}
          className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-emerald-500 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Barbeiros na Bancada
            </span>
            <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-black text-slate-950">
              {availableBarbers}
            </span>
            <span className="text-xs text-slate-500"> disponíveis hoje</span>
          </div>
          <span className="mt-3 text-[11px] font-semibold text-teal-600 flex items-center gap-1">
            Gerenciar equipe →
          </span>
        </button>

        {/* Card Galeria */}
        <button
          onClick={() => onNavigateTab("gallery")}
          className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-emerald-500 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Fotos na Galeria
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <ImageIcon className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-black text-slate-950">
              {totalGallery}
            </span>
            <span className="text-xs text-slate-500"> fotos no portfólio</span>
          </div>
          <span className="mt-3 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
            Adicionar/remover fotos →
          </span>
        </button>

        {/* Card Status Loja */}
        <button
          onClick={() => onNavigateTab("hours")}
          className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-emerald-500 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Status Atual da Barbearia
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <span className={`size-3 rounded-full ${storeStatus.isOpen ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              <span className="font-display text-xl font-bold text-slate-950">
                {storeStatus.label}
              </span>
            </div>
            <span className="text-xs text-slate-500">{storeStatus.detail}</span>
          </div>
          <span className="mt-3 text-[11px] font-semibold text-slate-700 flex items-center gap-1">
            Ajustar horários de atendimento →
          </span>
        </button>
      </div>

      {/* Resumo Rápido dos Dados e Links */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-display text-base font-bold text-slate-950">
          Dados Públicos da Barbearia
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Verifique se os dados de atendimento estão corretos para seus clientes.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
            <span className="font-bold text-slate-700 block mb-1">WhatsApp de Agendamento:</span>
            <span className="text-emerald-700 font-semibold">{businessInfo.phone}</span>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
            <span className="font-bold text-slate-700 block mb-1">Endereço Cadastrado:</span>
            <span className="text-slate-600 block line-clamp-1">{businessInfo.address}</span>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-[11px] text-emerald-600 font-semibold inline-flex items-center gap-1 hover:underline"
            >
              Testar no Google Maps <ExternalLink className="size-3" />
            </a>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
            <span className="font-bold text-slate-700 block mb-1">Instagram:</span>
            <span className="text-slate-600 font-semibold">@{businessInfo.instagram}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
