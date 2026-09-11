import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { Save, Lock, CheckCircle2, AlertCircle, Building2 } from "lucide-react";

export const GeneralSettingsTab: React.FC = () => {
  const { businessInfo, updateBusinessInfo, updateAdminPin } = useData();

  // Dados Gerais
  const [name, setName] = useState(businessInfo.name);
  const [tagline, setTagline] = useState(businessInfo.tagline);
  const [address, setAddress] = useState(businessInfo.address);
  const [phone, setPhone] = useState(businessInfo.phone);
  const [rawPhone, setRawPhone] = useState(businessInfo.rawPhone);
  const [instagram, setInstagram] = useState(businessInfo.instagram);
  const [generalSuccess, setGeneralSuccess] = useState(false);

  // Alteração de Senha
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinMessage, setPinMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessInfo({
      name: name.trim(),
      tagline: tagline.trim(),
      address: address.trim(),
      phone: phone.trim(),
      rawPhone: rawPhone.replace(/\D/g, ""),
      instagram: instagram.trim(),
    });
    setGeneralSuccess(true);
    setTimeout(() => setGeneralSuccess(false), 3500);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage(null);

    if (newPin !== confirmPin) {
      setPinMessage({ type: "error", text: "A confirmação da nova senha não confere." });
      return;
    }

    const result = updateAdminPin(currentPin, newPin);
    if (result.success) {
      setPinMessage({ type: "success", text: result.message });
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    } else {
      setPinMessage({ type: "error", text: result.message });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="font-display text-xl font-bold text-slate-950">
          Dados do Estabelecimento & Segurança
        </h2>
        <p className="text-xs text-slate-500">
          Atualize contatos, canais de agendamento e gerencie a senha de acesso ao painel.
        </p>
      </div>

      {/* Formulário de Informações Gerais */}
      <form
        onSubmit={handleSaveGeneral}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-xs"
      >
        <h3 className="font-display text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Building2 className="size-4 text-emerald-600" />
          Informações de Atendimento ao Cliente
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nome Comercial da Barbearia</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Slogan / Tagline do Hero</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Endereço Completo</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Telefone Formatado (Exibição)</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              WhatsApp para Agendamentos (com DDI e DDD, ex: 5511999999999)
            </label>
            <input
              type="text"
              required
              value={rawPhone}
              onChange={(e) => setRawPhone(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Instagram (sem @)</label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value.replace("@", ""))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          {generalSuccess && (
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
              <CheckCircle2 className="size-4" /> Dados salvos e aplicados com sucesso!
            </span>
          )}
          {!generalSuccess && <span />}

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors shadow-sm"
          >
            <Save className="size-4" />
            Salvar Dados
          </button>
        </div>
      </form>

      {/* Formulário de Troca de Senha */}
      <form
        onSubmit={handleSavePin}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-xs"
      >
        <h3 className="font-display text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Lock className="size-4 text-amber-600" />
          Segurança: Alterar Senha de Acesso ao Painel
        </h3>

        <p className="text-slate-500 text-xs">
          A senha padrão inicial é <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">admin123</code>. Recomendamos trocá-la para sua segurança.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Senha Atual *</label>
            <input
              type="password"
              required
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="Digite a senha atual"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nova Senha *</label>
            <input
              type="password"
              required
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Mínimo 4 dígitos"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Confirmar Nova Senha *</label>
            <input
              type="password"
              required
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Repita a nova senha"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {pinMessage && (
          <div
            className={`p-3 rounded-lg flex items-center gap-2 text-xs font-bold ${
              pinMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {pinMessage.type === "success" ? (
              <CheckCircle2 className="size-4 shrink-0" />
            ) : (
              <AlertCircle className="size-4 shrink-0" />
            )}
            <span>{pinMessage.text}</span>
          </div>
        )}

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            type="submit"
            className="rounded-lg bg-amber-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-700 transition-colors shadow-sm"
          >
            Atualizar Senha de Acesso
          </button>
        </div>
      </form>
    </div>
  );
};
