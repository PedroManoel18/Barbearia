import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import {
  LayoutDashboard,
  Scissors,
  Users,
  Clock,
  Image as ImageIcon,
  Settings,
  Database,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

import { OverviewTab } from "./tabs/OverviewTab";
import { ServicesTab } from "./tabs/ServicesTab";
import { TeamTab } from "./tabs/TeamTab";
import { HoursTab } from "./tabs/HoursTab";
import { GalleryTab } from "./tabs/GalleryTab";
import { GeneralSettingsTab } from "./tabs/GeneralSettingsTab";
import { BackupTab } from "./tabs/BackupTab";

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { businessInfo, logout, syncStatus, isCloudConnected } = useData();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
    { id: "services", label: "Serviços & Preços", icon: Scissors },
    { id: "team", label: "Equipe de Barbeiros", icon: Users },
    { id: "hours", label: "Horários de Funcionamento", icon: Clock },
    { id: "gallery", label: "Galeria de Fotos", icon: ImageIcon },
    { id: "general", label: "Dados da Barbearia", icon: Settings },
    { id: "backup", label: "Backup & Restauração", icon: Database },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 text-slate-900 overflow-hidden">
      {/* ── TOPBAR DO ADMIN ─────────────────────────────────────────────────── */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Abrir menu de navegação do painel"
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-emerald-400 font-display font-black text-sm shadow">
              <Scissors className="size-4" />
            </div>
            <div>
              <h1 className="font-display text-sm font-black text-slate-950 flex items-center gap-2">
                {businessInfo.name}
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-black text-emerald-800 uppercase">
                  Painel Admin
                </span>
              </h1>
              <div className="flex items-center gap-1.5 text-[11px] font-medium">
                {isCloudConnected ? (
                  syncStatus === "synced" ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Nuvem Supabase Sincronizada
                    </span>
                  ) : syncStatus === "syncing" ? (
                    <span className="flex items-center gap-1 text-blue-600 font-semibold">
                      <span className="size-1.5 rounded-full bg-blue-500 animate-ping" />
                      Salvando na Nuvem...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600 font-semibold">
                      <span className="size-1.5 rounded-full bg-rose-500" />
                      Falha de Conexão Nuvem
                    </span>
                  )
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 font-semibold">
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    Modo Local-First (Offline)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Ver Site da Barbearia</span>
            <ExternalLink className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-600 transition-colors"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* ── CORPO PRINCIPAL COM SIDEBAR + ÁREA DE CONTEÚDO ───────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-4 lg:flex">
          <nav className="space-y-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`size-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                    <span>{tab.label}</span>
                  </div>
                  {isActive && <ChevronRight className="size-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </nav>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-500">
            <span className="font-bold text-slate-800 block mb-1">Status da Sessão:</span>
            Armazenamento local-first persistente ativo. Suas alterações permanecem salvas neste
            dispositivo.
          </div>
        </aside>

        {/* Sidebar Mobile Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative flex w-72 flex-col justify-between bg-white p-5 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Menu Administrativo
                  </span>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="size-4 text-slate-500" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold ${
                          isActive
                            ? "bg-slate-950 text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Icon className={`size-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700"
              >
                <LogOut className="size-4" />
                <span>Encerrar Sessão</span>
              </button>
            </div>
          </div>
        )}

        {/* Área Central de Conteúdo com Rolagem */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            {activeTab === "overview" && <OverviewTab onNavigateTab={(t) => setActiveTab(t)} />}
            {activeTab === "services" && <ServicesTab />}
            {activeTab === "team" && <TeamTab />}
            {activeTab === "hours" && <HoursTab />}
            {activeTab === "gallery" && <GalleryTab />}
            {activeTab === "general" && <GeneralSettingsTab />}
            {activeTab === "backup" && <BackupTab />}
          </div>
        </main>
      </div>
    </div>
  );
};
