import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  ArrowRight,
  Star,
  Scissors,
  Sparkles,
  ShieldCheck,
  Flame,
  CheckCircle2,
  ChevronDown,
  Phone,
  ExternalLink,
  Lock,
  Calendar,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";
import { DataProvider, useData } from "@/context/DataContext";
import { faqs, reviews } from "@/components/demo/data";
import heroImg from "@/assets/demo2-hero.png";
import logoImg from "@/assets/logo.jpg";
import { ScissorsExperience } from "@/components/ScissorsHero/ScissorsExperience";
import { BrickBackground } from "@/components/ui/BrickBackground";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { GallerySection } from "@/components/ui/GallerySection";
import { AppointmentModal } from "@/components/ui/AppointmentModal";
import { PrivacyPolicyModal } from "@/components/ui/PrivacyPolicyModal";
import { AdminAuth } from "@/components/admin/AdminAuth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

// Variantes de Animação com Física de Mola Orgânica (Estilo Anime.js)
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const fadeUpSpring = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 22,
    },
  },
};

function MainSite() {
  const {
    services,
    team,
    hours,
    businessInfo,
    storeStatus,
    whatsappLink,
    mapsLink,
    telLink,
    isAdminLoggedIn,
  } = useData();

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();

  // Atalho de Teclado Seguro para o Dono / Administrador (Alt + A ou Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === "a") || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a")) {
        e.preventDefault();
        if (isAdminLoggedIn) {
          setIsAdminOpen((prev) => !prev);
        } else {
          setIsAuthOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdminLoggedIn]);

  // Acesso direto via Celular por URL (?admin=true ou #admin)
  useEffect(() => {
    const checkAdminUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("admin") === "true" || window.location.hash === "#admin") {
        if (isAdminLoggedIn) {
          setIsAdminOpen(true);
        } else {
          setIsAuthOpen(true);
        }
      }
    };
    checkAdminUrl();
    window.addEventListener("hashchange", checkAdminUrl);
    return () => window.removeEventListener("hashchange", checkAdminUrl);
  }, [isAdminLoggedIn]);

  const handleAdminTrigger = useCallback(() => {
    if (isAdminLoggedIn) {
      setIsAdminOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  }, [isAdminLoggedIn]);

  // Gesto Secreto Mobile: 3 toques rápidos consecutivos no logotipo
  const tapCountRef = useRef<number>(0);
  const lastTapTimeRef = useRef<number>(0);

  const handleLogoTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < 650) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }
    lastTapTimeRef.current = now;

    if (tapCountRef.current === 3) {
      tapCountRef.current = 0;
      handleAdminTrigger();
    }
  }, [handleAdminTrigger]);

  const activeServices = services.filter((s) => s.active);

  const handleOpenAppointment = (serviceId?: string) => {
    setSelectedServiceId(serviceId);
    setIsAppointmentOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-900 selection:bg-emerald-400 selection:text-slate-950">
      {/* ── ACESSIBILIDADE WCAG: Skip Link para Teclado ─────────────────────── */}
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-slate-950 focus:px-5 focus:py-3 focus:text-xs focus:font-bold focus:text-emerald-400 focus:shadow-2xl focus:ring-2 focus:ring-emerald-400 touch-target"
      >
        Pular para o conteúdo principal
      </a>

      {/* Experiência 3D Unificada com Tesoura Cromada e Abertura Cinematográfica */}
      <ScissorsExperience />

      {/* Textura Urbana: Parede de Tijolos Cinzas em Soft Blur */}
      <BrickBackground />

      {/* Super Botão Flutuante do WhatsApp em Verde Neon Brilhante */}
      <FloatingWhatsApp />

      {/* ── NAVEGAÇÃO RÁPIDA MOBILE (Aparece em telas < 1024px) ─────────────── */}
      <nav
        aria-label="Atalhos rápidos para dispositivos móveis"
        className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 py-2.5 backdrop-blur-xl lg:hidden"
      >
        <div
          onClick={handleLogoTap}
          role="button"
          tabIndex={0}
          className="flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform"
          title="Toque 3 vezes para acesso administrativo"
        >
          <img
            src={logoImg}
            alt={`Logo ${businessInfo.name}`}
            className="size-8 rounded-lg object-cover border border-emerald-500/30 shadow-sm"
          />
          <span className="font-display text-xs font-black tracking-tight text-slate-950">
            {businessInfo.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold text-slate-700">
          <a
            href="#servicos"
            className="touch-target rounded-full bg-slate-100 px-3 py-1.5 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
          >
            Serviços
          </a>
          <a
            href="#equipe"
            className="touch-target rounded-full bg-slate-100 px-3 py-1.5 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
          >
            Equipe
          </a>
          <a
            href="#galeria"
            className="touch-target rounded-full bg-slate-100 px-3 py-1.5 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
          >
            Galeria
          </a>
          <a
            href="#horarios"
            className="touch-target rounded-full bg-slate-100 px-3 py-1.5 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
          >
            Horários
          </a>
          <button
            onClick={() => handleOpenAppointment()}
            className="touch-target rounded-full bg-emerald-500 px-3 py-1.5 text-slate-950 font-black shadow-sm"
          >
            Agendar
          </button>
        </div>
      </nav>

      {/* ── LAYOUT PRINCIPAL: Sidebar Fixa Desktop + Conteúdo Rolável ───────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-[380px_1fr] lg:gap-12 lg:px-8 xl:grid-cols-[420px_1fr]">
        {/* ── SIDEBAR FIXA (DESKTOP) / CARD COMPACTO (MOBILE) ────────────────── */}
        <aside
          aria-label="Informações da barbearia e contato"
          className="py-6 sm:py-8 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:py-10"
        >
          <div className="glass-card flex h-full flex-col justify-between rounded-3xl p-6 sm:p-8">
            <div>
              {/* Header da Marca: Logo + Título */}
              <div
                onClick={handleLogoTap}
                role="button"
                tabIndex={0}
                className="flex items-center gap-3.5 cursor-pointer select-none group"
                title="Toque 3 vezes para acesso administrativo"
              >
                <div className="relative">
                  <img
                    src={logoImg}
                    alt={`Logo oficial da ${businessInfo.name}`}
                    className="size-13 rounded-2xl object-cover border-2 border-slate-900/10 shadow-md"
                  />
                  <div
                    className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-slate-950 font-black"
                    title="Verificado e Autêntico"
                  >
                    ✓
                  </div>
                </div>

                <div>
                  <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                    {businessInfo.name}
                  </h1>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-emerald-600">
                    EST. 2026 · SÃO PAULO
                  </p>
                </div>
              </div>

              {/* Hero Image / Imagem de Destaque Urbana */}
              <div className="mt-6 relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-studio">
                <img
                  src={heroImg}
                  alt="Interior da Barbearia com iluminação de estúdio"
                  className="size-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-[11px] font-bold tracking-wider uppercase backdrop-blur-md bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                    Atendimento de Estúdio
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-black/40 px-2 py-1 rounded-full backdrop-blur-md">
                    <Star className="size-3 fill-current" aria-hidden="true" />
                    <span>4.9 (500+ reviews)</span>
                  </div>
                </div>
              </div>

              {/* Cartões Rápidos de Informação com Links Semânticos */}
              <div className="mt-6 space-y-2.5 text-xs">
                {/* Endereço com Link Direto do Maps */}
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl bg-slate-50/80 p-3 border border-slate-100 transition-colors hover:bg-emerald-50 hover:text-emerald-900"
                  aria-label={`Ver endereço no Google Maps: ${businessInfo.address} (abre em nova aba)`}
                >
                  <MapPin className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span className="line-clamp-1 font-medium text-slate-700 group-hover:text-emerald-950">
                    {businessInfo.address}
                  </span>
                  <ExternalLink
                    className="size-3 ml-auto opacity-0 transition-opacity group-hover:opacity-100 text-emerald-600"
                    aria-hidden="true"
                  />
                </a>

                {/* Telefone com Link Direto Tel */}
                <a
                  href={telLink}
                  className="flex items-center gap-3 rounded-xl bg-slate-50/80 p-3 border border-slate-100 transition-colors hover:bg-emerald-50 hover:text-emerald-900"
                  aria-label={`Ligar para a barbearia no número ${businessInfo.phone}`}
                >
                  <Phone className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span className="font-semibold text-slate-800">{businessInfo.phone}</span>
                </a>

                {/* Status Ao Vivo com ARIA Live Region */}
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-center justify-between rounded-xl bg-slate-50/80 p-3 border border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-2.5" aria-hidden="true">
                      {storeStatus.isOpen ? (
                        <>
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                        </>
                      ) : (
                        <span className="relative inline-flex size-2.5 rounded-full bg-amber-500" />
                      )}
                    </span>
                    <span className="font-semibold text-slate-800">{storeStatus.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">{storeStatus.detail}</span>
                </div>
              </div>
            </div>

            {/* Ação Primária da Sidebar: Agendamento Direto */}
            <div className="mt-6 pt-2 space-y-2">
              <button
                type="button"
                onClick={() => handleOpenAppointment()}
                className="group flex w-full min-h-[48px] items-center justify-center gap-2.5 rounded-xl bg-slate-950 px-6 py-3.5 font-bold text-white shadow-lg transition-all duration-300 hover:bg-emerald-500 hover:text-slate-950 hover:shadow-neon-glow"
              >
                <Calendar className="size-4" />
                <span>Agendar Horário Online</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
              <p className="text-center text-[11px] font-medium text-slate-500">
                ⚡ Resposta no WhatsApp em menos de 5 minutos
              </p>
            </div>
          </div>
        </aside>

        {/* ── CONTEÚDO ROLÁVEL PRINCIPAL ────────────────────────────────────── */}
        <main id="conteudo-principal" role="main" className="py-6 sm:py-8 lg:py-10">
          {/* HERO SECTION — Assimétrico, Tipografia Ousada & Streetwear Hype */}
          <section aria-labelledby="hero-title" className="relative">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3.5 py-1.5 text-xs font-bold tracking-wider text-slate-800 shadow-sm backdrop-blur-md">
                <Sparkles className="size-3.5 text-emerald-500" aria-hidden="true" />
                <span>{businessInfo.tagline}</span>
              </div>

              <h2
                id="hero-title"
                className="font-display mt-5 max-w-2xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl leading-[1.08]"
              >
                Precisão na navalha,{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 bg-clip-text text-transparent">
                  atitude no visual.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-base text-slate-600 sm:text-lg leading-relaxed font-normal">
                Onde o respeito pela tradição clássica das toalhas quentes encontra o hype da cultura
                urbana contemporânea. Fade cirúrgico, barboterapia imersiva e atendimento de estúdio.
              </p>

              {/* Destaques Rápidos Streetwear com Alvos Acessíveis */}
              <div className="mt-8 flex flex-wrap gap-3 sm:gap-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" aria-hidden="true" />
                  <span>Navalha Descartável & Higiene 100%</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm">
                  <Flame className="size-4 text-emerald-500 shrink-0" aria-hidden="true" />
                  <span>Ambiente Climatizado + Cerveja Free</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm">
                  <ShieldCheck className="size-4 text-emerald-500 shrink-0" aria-hidden="true" />
                  <span>Estacionamento Gratuito no Local</span>
                </div>
              </div>
            </motion.div>
          </section>

          {/* ── SEÇÃO DE SERVIÇOS — Staggered Entrance com Framer Motion ─────── */}
          <section id="servicos" aria-labelledby="services-title" className="mt-16 sm:mt-20 scroll-mt-12">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                  Cardápio de Serviços
                </span>
                <h3
                  id="services-title"
                  className="font-display text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl"
                >
                  Escolha o seu estilo
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Toque no botão para agendar direto pelo WhatsApp ou personalizar
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5"
            >
              {activeServices.map((s) => (
                <motion.div
                  key={s.id}
                  variants={fadeUpSpring}
                  whileHover={{ y: -4 }}
                  className={`glass-card group relative flex flex-col justify-between rounded-2xl p-5 sm:p-6 ${
                    s.highlight ? "ring-2 ring-emerald-500/30" : ""
                  }`}
                >
                  {/* Tag do Serviço & Preço */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {s.tag && (
                        <span
                          className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase ${
                            s.highlight
                              ? "bg-emerald-500 text-slate-950"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {s.tag}
                        </span>
                      )}
                      <h4 className="font-display text-lg font-bold text-slate-950 group-hover:text-emerald-600 transition-colors">
                        {s.name}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display text-xl font-black text-slate-950">
                        {s.price}
                      </span>
                      <span className="block text-[11px] font-medium text-slate-500">
                        {s.time}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600 font-normal">
                    {s.desc}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-[11px] font-medium text-slate-400">
                      Vagas para esta semana
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenAppointment(s.id)}
                        className="touch-target rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                        title="Personalizar dia e barbeiro"
                      >
                        Personalizar
                      </button>
                      <motion.a
                        href={whatsappLink(s.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="touch-target inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-500 hover:text-slate-950"
                        aria-label={`Agendar serviço de ${s.name} por ${s.price} no WhatsApp (abre em nova aba)`}
                      >
                        <span>Agendar</span>
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ── SEÇÃO NOSSA EQUIPE ───────────────────────────────────────────── */}
          <section id="equipe" aria-labelledby="team-title" className="mt-16 sm:mt-20 scroll-mt-12">
            <div className="border-b border-slate-200/80 pb-4">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                Os Especialistas
              </span>
              <h3
                id="team-title"
                className="font-display text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl"
              >
                Bancada de Mestres
              </h3>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5"
            >
              {team.map((m) => (
                <motion.div
                  key={m.id}
                  variants={fadeUpSpring}
                  whileHover={{ y: -4 }}
                  className={`glass-card flex flex-col items-center rounded-2xl p-6 text-center transition-all ${
                    !m.available ? "opacity-60" : ""
                  }`}
                >
                  {m.photoUrl ? (
                    <div className="relative mb-4 size-20 overflow-hidden rounded-2xl border-2 border-emerald-500/30 shadow-md">
                      <img src={m.photoUrl} alt={m.name} className="size-full object-cover" />
                      <span
                        className={`absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${
                          m.available ? "bg-emerald-500 text-slate-950" : "bg-slate-400 text-white"
                        }`}
                      >
                        {m.available ? "✓" : "–"}
                      </span>
                    </div>
                  ) : (
                    <div
                      className="relative mb-4 flex size-18 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-950 to-slate-700 font-display text-xl font-black text-emerald-400 shadow-md"
                      aria-hidden="true"
                    >
                      {m.initials}
                      <span
                        className={`absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${
                          m.available ? "bg-emerald-500 text-slate-950" : "bg-slate-400 text-white"
                        }`}
                      >
                        {m.available ? "✓" : "–"}
                      </span>
                    </div>
                  )}

                  <h4 className="font-display text-base font-bold text-slate-950">{m.name}</h4>
                  <p className="text-xs font-semibold text-emerald-600 mt-0.5">{m.role}</p>
                  <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{m.specialty}</p>

                  {m.instagram && (
                    <a
                      href={`https://instagram.com/${m.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-emerald-600 transition-colors"
                    >
                      <InstagramIcon className="size-3" />
                      <span>@{m.instagram}</span>
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ── SEÇÃO GALERIA DE FOTOS (NOVA) ────────────────────────────────── */}
          <GallerySection />

          {/* ── SEÇÃO AVALIAÇÕES / SOCIAL PROOF ──────────────────────────────── */}
          <section aria-labelledby="reviews-title" className="mt-16 sm:mt-20">
            <div className="border-b border-slate-200/80 pb-4">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                Experiência dos Clientes
              </span>
              <h3
                id="reviews-title"
                className="font-display text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl"
              >
                O que dizem sobre a Garage
              </h3>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5"
            >
              {reviews.map((r, i) => (
                <motion.div
                  key={i}
                  variants={fadeUpSpring}
                  whileHover={{ y: -3 }}
                  className="glass-card flex flex-col justify-between rounded-2xl p-5 sm:p-6"
                >
                  <div>
                    <div className="flex gap-1 text-amber-400 mb-3" aria-hidden="true">
                      {Array.from({ length: r.rating }).map((_, idx) => (
                        <Star key={idx} className="size-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="sr-only">Avaliação de {r.rating} de 5 estrelas</span>
                    <p className="text-xs leading-relaxed text-slate-700 italic font-medium">
                      "{r.text}"
                    </p>
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900">{r.author}</span>
                    <span className="text-emerald-600 font-medium">{r.service}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ── SEÇÃO HORÁRIOS ──────────────────────────────────────────────── */}
          <section id="horarios" aria-labelledby="hours-title" className="mt-16 sm:mt-20 scroll-mt-12">
            <div className="border-b border-slate-200/80 pb-4">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                Disponibilidade
              </span>
              <h3
                id="hours-title"
                className="font-display text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl"
              >
                Horários de Funcionamento
              </h3>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-studio backdrop-blur-xl sm:p-6">
              <div className="divide-y divide-slate-100">
                {hours.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between py-3.5 text-xs first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-slate-400" aria-hidden="true" />
                      <span className="font-semibold text-slate-800">{h.day}</span>
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        h.active ? "text-slate-900" : "text-amber-600"
                      }`}
                    >
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── SEÇÃO FAQ — Acordeão Interativo e Acessível (WCAG Accordion) ─── */}
          <section id="faq" aria-labelledby="faq-title" className="mt-16 sm:mt-20 scroll-mt-12">
            <div className="border-b border-slate-200/80 pb-4">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                Tire suas Dúvidas
              </span>
              <h3
                id="faq-title"
                className="font-display text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl"
              >
                Perguntas Frequentes
              </h3>
            </div>

            <div className="mt-8 space-y-3">
              {faqs.map((f, idx) => {
                const isOpen = openFaq === idx;
                const questionId = `faq-q-${idx}`;
                const answerId = `faq-a-${idx}`;

                return (
                  <div
                    key={idx}
                    className="glass-card overflow-hidden rounded-2xl border border-slate-200/90 transition-all"
                  >
                    <button
                      id={questionId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="touch-target flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-bold text-slate-950 transition-colors hover:text-emerald-600 sm:p-6 sm:text-base font-display"
                    >
                      <span>{f.q}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="shrink-0 text-slate-400 group-hover:text-emerald-600"
                      >
                        <ChevronDown className="size-4" aria-hidden="true" />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={answerId}
                          role="region"
                          aria-labelledby={questionId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed sm:px-6 sm:pb-6">
                            {f.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── BANNER FINAL DE CONVERSÃO — Streetwear Chic com Botão Neon ────── */}
          <section
            id="agendar"
            aria-labelledby="cta-title"
            className="relative mt-16 sm:mt-20 overflow-hidden rounded-3xl bg-slate-950 p-7 text-center text-white shadow-2xl sm:p-12"
          >
            {/* Efeitos de Fundo com Glow Neon */}
            <div
              className="absolute -top-24 -left-24 size-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-24 -right-24 size-72 rounded-full bg-teal-500/20 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-400 border border-emerald-500/30 mb-4">
                <Flame className="size-3" aria-hidden="true" />
                Vagas Limitadas para esta semana
              </span>

              <h3
                id="cta-title"
                className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
              >
                Pronto para dar aquele tapa de respeito no visual?
              </h3>

              <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                Escolha o barbeiro da sua preferência, defina o horário e receba confirmação
                imediata no seu WhatsApp. Menos de 1 minuto.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleOpenAppointment()}
                  className="touch-target group flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-8 py-4 text-xs font-black text-slate-950 uppercase tracking-wider shadow-neon-glow hover:opacity-95 transition-all"
                >
                  <Calendar className="size-4" />
                  <span>Agendar Horário Online</span>
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-slate-400 font-medium">
                <span>✓ Sem adiantamento</span>
                <span>✓ Estacionamento grátis</span>
                <span>✓ Cerveja artesanal</span>
              </div>
            </div>
          </section>

          {/* ── FOOTER COM LINKS SEMÂNTICOS, PRIVACIDADE & ACESSO ADMIN ───────── */}
          <footer
            role="contentinfo"
            className="mt-16 sm:mt-20 border-t border-slate-200/80 pt-8 pb-12 text-center text-xs text-slate-500"
          >
            <div className="flex items-center justify-center gap-2 mb-2 font-display text-sm font-bold text-slate-900">
              <Scissors className="size-4 text-emerald-500" aria-hidden="true" />
              <span>{businessInfo.name}</span>
            </div>

            <p className="text-slate-600">
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-700 underline-offset-2 hover:underline"
              >
                {businessInfo.address}
              </a>{" "}
              ·{" "}
              <a href={telLink} className="hover:text-emerald-700 underline-offset-2 hover:underline">
                {businessInfo.phone}
              </a>
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="hover:text-emerald-700 underline-offset-2 hover:underline font-semibold"
              >
                Política de Privacidade & LGPD
              </button>
              <span>·</span>
              <button
                onClick={handleAdminTrigger}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors shadow-sm active:scale-95"
                title="Atalho: 3 toques no logo, ?admin=true ou Alt + A"
              >
                <Lock className="size-3.5 text-slate-500" />
                <span>Área do Proprietário (Painel Admin)</span>
              </button>
            </div>

            <p className="mt-4 text-[11px] text-slate-400">
              © {new Date().getFullYear()} {businessInfo.name}. Conceito "Vintage Hype: O Novo
              Clássico". Todos os direitos reservados.
            </p>
          </footer>
        </main>
      </div>

      {/* ── MODAIS E PAINEL ADMINISTRATIVO ──────────────────────────────────── */}
      {isAuthOpen && (
        <AdminAuth
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={() => {
            setIsAuthOpen(false);
            setIsAdminOpen(true);
          }}
        />
      )}

      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}

      {isAppointmentOpen && (
        <AppointmentModal
          isOpen={isAppointmentOpen}
          onClose={() => setIsAppointmentOpen(false)}
          preselectedServiceId={selectedServiceId}
        />
      )}

      {isPrivacyOpen && (
        <PrivacyPolicyModal
          isOpen={isPrivacyOpen}
          onClose={() => setIsPrivacyOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <MainSite />
    </DataProvider>
  );
}
