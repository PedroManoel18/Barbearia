import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { Clock, CheckCircle2, Save } from "lucide-react";

export const HoursTab: React.FC = () => {
  const { hours, updateHourItem, storeStatus } = useData();
  const [successMessage, setSuccessMessage] = useState("");

  const handleToggleDay = (id: string, currentActive: boolean) => {
    updateHourItem(id, { active: !currentActive });
    showNotification("Horário atualizado com sucesso!");
  };

  const handleTimeChange = (id: string, newTime: string) => {
    updateHourItem(id, { time: newTime });
  };

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="font-display text-xl font-bold text-slate-950">
          Horários de Atendimento & Funcionamento
        </h2>
        <p className="text-xs text-slate-500">
          Configure a grade de dias e horários da barbearia. O status de aberto/fechado na Home
          responde a estas configurações.
        </p>
      </div>

      {/* Alerta de Status ao Vivo */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white p-2.5 shadow-sm border border-slate-200 text-slate-700">
            <Clock className="size-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-700 block">Status ao Vivo Agora:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`size-2.5 rounded-full ${storeStatus.isOpen ? "bg-emerald-500 animate-ping" : "bg-amber-500"}`} />
              <span className="font-display text-sm font-bold text-slate-900">
                {storeStatus.label} — {storeStatus.detail}
              </span>
            </div>
          </div>
        </div>

        {successMessage && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="size-3.5" />
            {successMessage}
          </span>
        )}
      </div>

      {/* Tabela / Cards de Edição dos Horários */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          {hours.map((h) => (
            <div
              key={h.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleDay(h.id, h.active)}
                  className={`size-6 rounded-md flex items-center justify-center border transition-all ${
                    h.active
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-slate-100 border-slate-300 text-slate-400"
                  }`}
                  title={h.active ? "Desativar dia" : "Ativar dia"}
                >
                  {h.active ? "✓" : "✕"}
                </button>
                <div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                    {h.day}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {h.active ? "Dia com expediente normal" : "Fechado neste dia"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={h.time}
                  disabled={!h.active}
                  onChange={(e) => handleTimeChange(h.id, e.target.value)}
                  placeholder="Ex: 09:00 — 20:00 ou Fechado"
                  className={`w-full sm:w-64 rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none transition-colors ${
                    h.active
                      ? "border-slate-300 bg-white text-slate-900 focus:border-emerald-500"
                      : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                />
                <button
                  onClick={() => showNotification("Horário salvo!")}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-emerald-700"
                  title="Confirmar alteração"
                >
                  <Save className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
