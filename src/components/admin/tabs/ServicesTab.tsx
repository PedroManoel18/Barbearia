import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { type ServiceItem } from "@/components/demo/data";
import { Plus, Edit2, Trash2, Sparkles } from "lucide-react";

export const ServicesTab: React.FC = () => {
  const { services, addService, updateService, deleteService, toggleServiceActive } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formTag, setFormTag] = useState("");
  const [formCategory, setFormCategory] = useState<ServiceItem["category"]>("corte");
  const [formHighlight, setFormHighlight] = useState(false);

  const startEdit = (service: ServiceItem) => {
    setEditingId(service.id);
    setIsAddingNew(false);
    setFormName(service.name);
    setFormDesc(service.desc);
    setFormPrice(service.price);
    setFormTime(service.time);
    setFormTag(service.tag || "");
    setFormCategory(service.category);
    setFormHighlight(Boolean(service.highlight));
  };

  const startAdd = () => {
    setEditingId(null);
    setIsAddingNew(true);
    setFormName("");
    setFormDesc("");
    setFormPrice("R$ ");
    setFormTime("30 min");
    setFormTag("");
    setFormCategory("corte");
    setFormHighlight(false);
  };

  const cancelForm = () => {
    setEditingId(null);
    setIsAddingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice.trim()) {
      alert("Nome e preço são obrigatórios.");
      return;
    }

    if (isAddingNew) {
      addService({
        name: formName.trim(),
        desc: formDesc.trim() || "Serviço com produtos premium e atendimento personalizado.",
        price: formPrice.trim(),
        time: formTime.trim() || "30 min",
        tag: formTag.trim() || undefined,
        category: formCategory,
        highlight: formHighlight,
        active: true,
      });
      setIsAddingNew(false);
    } else if (editingId) {
      updateService(editingId, {
        name: formName.trim(),
        desc: formDesc.trim(),
        price: formPrice.trim(),
        time: formTime.trim(),
        tag: formTag.trim() || undefined,
        category: formCategory,
        highlight: formHighlight,
      });
      setEditingId(null);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja remover o serviço "${name}"?`)) {
      deleteService(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-950">
            Gerenciador de Serviços & Preços
          </h2>
          <p className="text-xs text-slate-500">
            Altere preços, adicione novos cortes e ative ou pause itens do cardápio.
          </p>
        </div>

        {!isAddingNew && !editingId && (
          <button
            onClick={startAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors shadow-sm"
          >
            <Plus className="size-4" />
            <span>Adicionar Novo Serviço</span>
          </button>
        )}
      </div>

      {/* Formulário de Adicionar / Editar */}
      {(isAddingNew || editingId) && (
        <form
          onSubmit={handleSave}
          className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/20 p-5 sm:p-6 shadow-sm"
        >
          <h3 className="font-display text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="size-4 text-emerald-600" />
            {isAddingNew ? "Cadastrar Novo Serviço" : "Editar Serviço"}
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nome do Serviço *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Corte Americano / Taper"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Preço Formatado *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="Ex: R$ 55"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Duração Média</label>
              <input
                type="text"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                placeholder="Ex: 45 min"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Categoria</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as ServiceItem["category"])}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
              >
                <option value="corte">Corte de Cabelo</option>
                <option value="barba">Barba & Barboterapia</option>
                <option value="combo">Combo Completo</option>
                <option value="tratamento">Tratamento / Químico</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tag / Selo (Opcional)</label>
              <input
                type="text"
                value={formTag}
                onChange={(e) => setFormTag(e.target.value)}
                placeholder="Ex: MAIS PEDIDO, NOVO, HYPE"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="relative flex cursor-pointer items-center gap-2 font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={formHighlight}
                  onChange={(e) => setFormHighlight(e.target.checked)}
                  className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Destacar este serviço na Home</span>
              </label>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Descrição Breve</label>
              <textarea
                rows={2}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Descreva detalhes do procedimento, produtos usados ou técnicas..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-emerald-500/20 pt-4">
            <button
              type="button"
              onClick={cancelForm}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
            >
              {isAddingNew ? "Salvar Novo Serviço" : "Atualizar Serviço"}
            </button>
          </div>
        </form>
      )}

      {/* Lista de Serviços */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Serviço</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Duração</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((s) => (
                <tr
                  key={s.id}
                  className={`hover:bg-slate-50/80 transition-colors ${!s.active ? "opacity-50 bg-slate-50/40" : ""}`}
                >
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-950 flex items-center gap-2">
                      {s.name}
                      {s.tag && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-black text-emerald-800">
                          {s.tag}
                        </span>
                      )}
                      {s.highlight && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-black text-amber-800">
                          Destaque
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 text-[11px] line-clamp-1">{s.desc}</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 capitalize">
                    {s.category}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    {s.price}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">
                    {s.time}
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleServiceActive(s.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        s.active
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      {s.active ? "Ativo" : "Pausado"}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => startEdit(s)}
                        title="Editar Serviço"
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        title="Remover Serviço"
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
