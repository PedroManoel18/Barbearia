import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { type GalleryItem } from "@/components/demo/data";
import { Plus, Trash2, Image as ImageIcon, UploadCloud } from "lucide-react";

export const GalleryTab: React.FC = () => {
  const { gallery, addGalleryItem, deleteGalleryItem } = useData();
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [formUrl, setFormUrl] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<GalleryItem["category"]>("cortes");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUrl.trim()) {
      alert("Selecione uma imagem ou informe a URL.");
      return;
    }

    addGalleryItem({
      url: formUrl.trim(),
      title: formTitle.trim() || "Trabalho BarberShop Garage",
      category: formCategory,
      alt: formTitle.trim() || "Foto do trabalho da barbearia",
    });

    setFormUrl("");
    setFormTitle("");
    setIsAdding(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Tem certeza que deseja excluir a foto "${title}" da galeria?`)) {
      deleteGalleryItem(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-950">
            Gerenciador da Galeria de Fotos
          </h2>
          <p className="text-xs text-slate-500">
            Adicione e organize fotos dos melhores cortes, barbas alinhadas e ambiente do estúdio.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors shadow-sm"
          >
            <Plus className="size-4" />
            <span>Adicionar Nova Foto</span>
          </button>
        )}
      </div>

      {/* Formulário de Adicionar Foto */}
      {isAdding && (
        <form
          onSubmit={handleSave}
          className="rounded-2xl border-2 border-blue-500/40 bg-blue-50/20 p-5 sm:p-6 shadow-sm"
        >
          <h3 className="font-display text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ImageIcon className="size-4 text-blue-600" />
            Adicionar Imagem à Galeria
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Título / Legenda da Foto</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: Mid Fade com Risca Lateral"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Categoria de Exibição</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as GalleryItem["category"])}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="cortes">Cortes de Cabelo (Fade, Clássico, etc.)</option>
                <option value="barbas">Barbas & Alinhamento</option>
                <option value="ambiente">Ambiente & Estúdio Garage</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Imagem (Upload do Computador ou URL Web)</label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  type="text"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="Cole aqui o link da imagem ou selecione um arquivo..."
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                />
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 border border-slate-300">
                  <UploadCloud className="size-4" />
                  <span>Subir do PC</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {formUrl && (
              <div className="sm:col-span-2 mt-2">
                <span className="text-[11px] font-bold text-slate-600 block mb-1">Pré-visualização:</span>
                <div className="h-40 w-48 rounded-xl overflow-hidden border border-slate-300 bg-slate-100">
                  <img src={formUrl} alt="Preview" className="size-full object-cover" />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-blue-500/20 pt-4">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
            >
              Publicar Foto na Galeria
            </button>
          </div>
        </form>
      )}

      {/* Grid de Fotos */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="aspect-square overflow-hidden bg-slate-100">
              <img
                src={item.url}
                alt={item.alt}
                loading="lazy"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="p-3">
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase text-slate-600">
                {item.category}
              </span>
              <h4 className="mt-1 font-display text-xs font-bold text-slate-900 line-clamp-1">
                {item.title}
              </h4>
            </div>

            <button
              onClick={() => handleDelete(item.id, item.title)}
              title="Excluir Foto"
              className="absolute top-2 right-2 rounded-full bg-red-600/90 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700 shadow-md"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
