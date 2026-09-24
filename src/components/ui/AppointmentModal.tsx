import React, { useState } from "react";
import { motion } from "framer-motion";
import { useData } from "@/context/DataContext";
import { X, Calendar, Scissors, User, Clock, ArrowRight, Sparkles } from "lucide-react";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  preselectedServiceId,
}) => {
  const { services, team, businessInfo } = useData();

  const activeServices = services.filter((s) => s.active);
  const availableTeam = team.filter((t) => t.available);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || activeServices[0]?.id || ""
  );
  const [selectedBarberId, setSelectedBarberId] = useState<string>("");
  const [preferredPeriod, setPreferredPeriod] = useState<string>("Tarde (14h - 18h)");
  const [preferredDay, setPreferredDay] = useState<string>("Hoje");

  if (!isOpen) return null;

  const handleSendToWhatsApp = () => {
    const service = services.find((s) => s.id === selectedServiceId);
    const barber = team.find((t) => t.id === selectedBarberId);

    const serviceName = service ? service.name : "Serviço";
    const barberName = barber ? barber.name : "Qualquer profissional disponível";

    const text = `Olá! Gostaria de agendar um horário na ${businessInfo.name}:
✂️ Serviço: ${serviceName} (${service?.price || ""})
💈 Barbeiro de preferência: ${barberName}
📅 Dia desejado: ${preferredDay}
🕒 Período: ${preferredPeriod}

Teria vaga disponível para esse horário?`;

    const url = `https://wa.me/${businessInfo.rawPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl"
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Fechar modal de agendamento"
        >
          <X className="size-5" />
        </button>

        {/* Topo do Modal */}
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
          <Sparkles className="size-4" />
          <span>AGENDAMENTO RÁPIDO DIGITAL</span>
        </div>

        <h3
          id="appointment-modal-title"
          className="mt-1 font-display text-2xl font-black text-slate-950 sm:text-3xl"
        >
          Monte seu Atendimento
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Escolha os detalhes abaixo e nós confirmamos seu horário no WhatsApp em menos de 5 minutos.
        </p>

        {/* Formulário Interativo */}
        <div className="mt-6 space-y-4 text-xs">
          {/* Escolha do Serviço */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Scissors className="size-3.5 text-emerald-600" />
              <span>1. Escolha o Serviço</span>
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
            >
              {activeServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.price} ({s.time})
                </option>
              ))}
            </select>
          </div>

          {/* Escolha do Barbeiro */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <User className="size-3.5 text-teal-600" />
              <span>2. Barbeiro de Preferência</span>
            </label>
            <select
              value={selectedBarberId}
              onChange={(e) => setSelectedBarberId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
            >
              <option value="">Qualquer barbeiro disponível (atendimento mais rápido)</option>
              {availableTeam.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.role}
                </option>
              ))}
            </select>
          </div>

          {/* Dia Preferido */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-slate-600" />
                <span>3. Dia Desejado</span>
              </label>
              <select
                value={preferredDay}
                onChange={(e) => setPreferredDay(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Hoje">Hoje</option>
                <option value="Amanhã">Amanhã</option>
                <option value="Nesta Sexta-feira">Nesta Sexta-feira</option>
                <option value="Neste Sábado">Neste Sábado</option>
                <option value="Próxima semana">Próxima semana</option>
              </select>
            </div>

            {/* Período */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Clock className="size-3.5 text-slate-600" />
                <span>4. Período</span>
              </label>
              <select
                value={preferredPeriod}
                onChange={(e) => setPreferredPeriod(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Manhã (09h - 12h)">Manhã (09h - 12h)</option>
                <option value="Tarde (13h - 18h)">Tarde (13h - 18h)</option>
                <option value="Noite (18h - 20h)">Noite (18h - 20h)</option>
                <option value="Qualquer horário">Qualquer horário</option>
              </select>
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="touch-target inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 py-4 text-xs font-black uppercase tracking-wider text-slate-950 shadow-neon-glow hover:opacity-95 transition-all"
            >
              <span>Confirmar e Agendar no WhatsApp</span>
              <ArrowRight className="size-4" />
            </button>
            <p className="mt-2 text-center text-[11px] text-slate-500">
              ✓ Sem custo antecipado · Pagamento feito no local após o atendimento
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
