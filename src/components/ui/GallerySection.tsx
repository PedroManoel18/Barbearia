import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";
import { type GalleryItem } from "@/components/demo/data";
import { Maximize2, X } from "lucide-react";

export const GallerySection: React.FC = () => {
  const { gallery } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = [
    { id: "todos", label: "Todos os Trabalhos" },
    { id: "cortes", label: "Cortes & Fade" },
    { id: "barbas", label: "Barbas Alinhadas" },
    { id: "ambiente", label: "Estúdio Garage" },
  ];

  const filteredItems = selectedCategory === "todos"
    ? gallery
    : gallery.filter((item) => item.category === selectedCategory);

  return (
    <section id="galeria" aria-labelledby="gallery-title" className="mt-16 sm:mt-20 scroll-mt-12">
      {/* Header da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
            Portfólio & Ambiente
          </span>
          <h3
            id="gallery-title"
            className="font-display text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl"
          >
            Nossos Trabalhos na Navalha
          </h3>
        </div>

        {/* Abas de Filtro */}
        <div className="flex flex-wrap gap-1.5 text-xs font-bold">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`touch-target rounded-full px-3.5 py-1.5 transition-all ${
                  isSelected
                    ? "bg-slate-950 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Imagens */}
      <motion.div
        layout
        className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3"
      >
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActivePhoto(item)}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-slate-100 shadow-sm transition-all hover:shadow-xl"
            >
              <img
                src={item.url}
                alt={item.alt}
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-108"
              />

              {/* Overlay com Título e Categoria */}
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="self-end rounded-full bg-white/20 p-2 text-white backdrop-blur-md">
                  <Maximize2 className="size-3.5" />
                </div>
                <div>
                  <span className="rounded-md bg-emerald-500/90 px-2 py-0.5 text-[9px] font-black uppercase text-slate-950">
                    {item.category}
                  </span>
                  <h4 className="mt-1 font-display text-xs font-bold text-white line-clamp-1">
                    {item.title}
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal de Tela Cheia */}
      <AnimatePresence>
        {activePhoto && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Visualização ampliada da foto"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md"
            onClick={() => setActivePhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-10 rounded-full bg-slate-900/80 p-2.5 text-white hover:bg-slate-800 transition-colors"
                aria-label="Fechar visualização"
              >
                <X className="size-5" />
              </button>

              <div className="max-h-[75vh] overflow-hidden bg-slate-900">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.alt}
                  className="size-full max-h-[75vh] object-contain"
                />
              </div>

              <div className="p-5 flex items-center justify-between bg-slate-950 text-white">
                <div>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-400 uppercase">
                    {activePhoto.category}
                  </span>
                  <h3 className="mt-1 font-display text-base font-bold">
                    {activePhoto.title}
                  </h3>
                </div>
                <span className="text-xs text-slate-400">BarberShop Garage</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
