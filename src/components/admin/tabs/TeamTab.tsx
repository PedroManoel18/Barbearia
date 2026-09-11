import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { type TeamMember } from "@/components/demo/data";
import { Plus, Edit2, Trash2, UserCheck, UserX, Camera } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";

export const TeamTab: React.FC = () => {
  const { team, addTeamMember, updateTeamMember, deleteTeamMember, toggleTeamMemberAvailable } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formInitials, setFormInitials] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formSpecialty, setFormSpecialty] = useState("");
  const [formPhotoUrl, setFormPhotoUrl] = useState("");
  const [formInstagram, setFormInstagram] = useState("");

  const startEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setIsAddingNew(false);
    setFormName(member.name);
    setFormInitials(member.initials);
    setFormRole(member.role);
    setFormSpecialty(member.specialty);
    setFormPhotoUrl(member.photoUrl || "");
    setFormInstagram(member.instagram || "");
  };

  const startAdd = () => {
    setEditingId(null);
    setIsAddingNew(true);
    setFormName("");
    setFormInitials("");
    setFormRole("Barbeiro Profissional");
    setFormSpecialty("");
    setFormPhotoUrl("");
    setFormInstagram("");
  };

  const cancelForm = () => {
    setEditingId(null);
    setIsAddingNew(false);
  };

  // Upload local de imagem com conversão para Base64 compactada
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormPhotoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("O nome do barbeiro é obrigatório.");
      return;
    }

    const initials =
      formInitials.trim() ||
      formName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    if (isAddingNew) {
      addTeamMember({
        name: formName.trim(),
        initials,
        role: formRole.trim() || "Barbeiro",
        specialty: formSpecialty.trim() || "Especialista em Cortes Masculinos e Barba",
        photoUrl: formPhotoUrl.trim() || undefined,
        instagram: formInstagram.trim() || undefined,
        available: true,
      });
      setIsAddingNew(false);
    } else if (editingId) {
      updateTeamMember(editingId, {
        name: formName.trim(),
        initials,
        role: formRole.trim(),
        specialty: formSpecialty.trim(),
        photoUrl: formPhotoUrl.trim() || undefined,
        instagram: formInstagram.trim() || undefined,
      });
      setEditingId(null);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o perfil de ${name}?`)) {
      deleteTeamMember(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-950">
            Gerenciador da Equipe de Barbeiros
          </h2>
          <p className="text-xs text-slate-500">
            Cadastre os profissionais da barbearia, fotos, especialidades e disponibilidade.
          </p>
        </div>

        {!isAddingNew && !editingId && (
          <button
            onClick={startAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors shadow-sm"
          >
            <Plus className="size-4" />
            <span>Adicionar Novo Barbeiro</span>
          </button>
        )}
      </div>

      {/* Formulário de Barbeiro */}
      {(isAddingNew || editingId) && (
        <form
          onSubmit={handleSave}
          className="rounded-2xl border-2 border-teal-500/40 bg-teal-50/20 p-5 sm:p-6 shadow-sm"
        >
          <h3 className="font-display text-sm font-bold text-slate-900 mb-4">
            {isAddingNew ? "Cadastrar Novo Barbeiro" : "Editar Dados do Barbeiro"}
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nome Completo / Apelido *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Carlos 'Blade'"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Iniciais do Avatar (Ex: CB)</label>
              <input
                type="text"
                maxLength={3}
                value={formInitials}
                onChange={(e) => setFormInitials(e.target.value.toUpperCase())}
                placeholder="Ex: CB"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Função / Cargo</label>
              <input
                type="text"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                placeholder="Ex: Master Barber, Especialista Clássico"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Especialidade / Bio Breve</label>
              <input
                type="text"
                value={formSpecialty}
                onChange={(e) => setFormSpecialty(e.target.value)}
                placeholder="Ex: Fade de Alta Precisão, Barboterapia & Freestyle"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Instagram (sem @)</label>
              <div className="relative">
                <input
                  type="text"
                  value={formInstagram}
                  onChange={(e) => setFormInstagram(e.target.value.replace("@", ""))}
                  placeholder="Ex: carlosblade_barber"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Foto do Perfil (Upload ou URL)</label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  type="text"
                  value={formPhotoUrl}
                  onChange={(e) => setFormPhotoUrl(e.target.value)}
                  placeholder="Cole uma URL da foto ou selecione um arquivo ao lado..."
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none"
                />
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 border border-slate-300">
                  <Camera className="size-4" />
                  <span>Escolher Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {formPhotoUrl && (
                  <div className="size-10 overflow-hidden rounded-full border border-teal-500 shrink-0">
                    <img src={formPhotoUrl} alt="Preview" className="size-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-teal-500/20 pt-4">
            <button
              type="button"
              onClick={cancelForm}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-teal-600 px-5 py-2 text-xs font-bold text-white hover:bg-teal-700 shadow-sm"
            >
              {isAddingNew ? "Salvar Novo Barbeiro" : "Atualizar Barbeiro"}
            </button>
          </div>
        </form>
      )}

      {/* Grid de Barbeiros */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <div
            key={member.id}
            className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all ${
              !member.available ? "opacity-60 bg-slate-50/50" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="size-14 rounded-2xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-900 font-display text-lg font-black text-emerald-400">
                    {member.initials}
                  </div>
                )}
                <div>
                  <h4 className="font-display text-sm font-bold text-slate-950">{member.name}</h4>
                  <p className="text-[11px] font-semibold text-teal-600">{member.role}</p>
                  {member.instagram && (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <InstagramIcon className="size-2.5" /> @{member.instagram}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(member)}
                  title="Editar"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-teal-700"
                >
                  <Edit2 className="size-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(member.id, member.name)}
                  title="Excluir"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-2">
              {member.specialty}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <span className="text-[11px] text-slate-500">Disponibilidade:</span>
              <button
                type="button"
                onClick={() => toggleTeamMemberAvailable(member.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${
                  member.available
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {member.available ? (
                  <>
                    <UserCheck className="size-3" />
                    <span>Disponível Hoje</span>
                  </>
                ) : (
                  <>
                    <UserX className="size-3" />
                    <span>Em Folga / Ausente</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
