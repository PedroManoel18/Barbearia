export interface ServiceItem {
  id: string;
  name: string;
  desc: string;
  time: string;
  price: string;
  tag?: string;
  highlight?: boolean;
  active: boolean;
  category: "corte" | "barba" | "combo" | "tratamento";
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  specialty: string;
  photoUrl?: string;
  instagram?: string;
  available: boolean;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: "cortes" | "barbas" | "ambiente";
  alt: string;
}

export interface HourItem {
  id: string;
  day: string;
  time: string;
  active: boolean;
}

export interface ReviewItem {
  id: string;
  text: string;
  author: string;
  service: string;
  rating: number;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface BusinessInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  rawPhone: string;
  instagram: string;
  adminPin: string; // Senha padrão para acesso ao painel
}

export const initialBusinessInfo: BusinessInfo = {
  name: "BarberShop Garage",
  tagline: "VINTAGE HYPE // O NOVO CLÁSSICO",
  address: "Rua das Flores, 123 - Centro, São Paulo - SP",
  phone: "(11) 99999-9999",
  rawPhone: "5511999999999",
  instagram: "barbershopgarage.oficial",
  adminPin: "admin123",
};

export const initialServices: ServiceItem[] = [
  {
    id: "srv-1",
    name: "Corte Fade / Nevou",
    desc: "Degradê navalhado de alta precisão, finalização fosca texturizada e navalha afiada.",
    time: "45 min",
    price: "R$ 55",
    tag: "MAIS PEDIDO",
    highlight: true,
    active: true,
    category: "corte",
  },
  {
    id: "srv-2",
    name: "Barba Terapia Garage",
    desc: "Alinhamento a vapor, toalha quente aromatizada, óleos nobres e massagem facial relaxante.",
    time: "35 min",
    price: "R$ 45",
    tag: "RELAX",
    active: true,
    category: "barba",
  },
  {
    id: "srv-3",
    name: "Combo Vintage Hype",
    desc: "Corte clássico ou moderno + Barboterapia completa + Cerveja artesanal gelada de cortesia.",
    time: "1h 15 min",
    price: "R$ 90",
    tag: "HYPE CHOICE",
    highlight: true,
    active: true,
    category: "combo",
  },
  {
    id: "srv-4",
    name: "Pigmentação & Alinhamento",
    desc: "Correção de falhas e disfarce natural para barba ou cabelo com pigmento de longa duração.",
    time: "40 min",
    price: "R$ 60",
    tag: "ESTILO",
    active: true,
    category: "tratamento",
  },
  {
    id: "srv-5",
    name: "Acabamento & Pezinho",
    desc: "Contorno com navalha, sobrancelha na lâmina e higienização refrescante pós-corte.",
    time: "20 min",
    price: "R$ 30",
    active: true,
    category: "corte",
  },
  {
    id: "srv-6",
    name: "Platinado / Nevou Completo",
    desc: "Descoloração segura com proteção capilar e tonalização branca ou cinza platinado.",
    time: "2h 30 min",
    price: "R$ 160",
    tag: "TREND",
    active: true,
    category: "tratamento",
  },
];

export const initialTeam: TeamMember[] = [
  {
    id: "team-1",
    name: "Carlos 'Blade'",
    initials: "CB",
    role: "Master Barber",
    specialty: "Fade de Alta Precisão & Freestyle",
    instagram: "carlosblade_barber",
    available: true,
  },
  {
    id: "team-2",
    name: "Miguel Vintage",
    initials: "MV",
    role: "Especialista Clássico",
    specialty: "Barboterapia com Toalha Quente & Navalha",
    instagram: "miguelvintage",
    available: true,
  },
  {
    id: "team-3",
    name: "Lucas Street",
    initials: "LS",
    role: "Visagista & Colorista",
    specialty: "Platinados, Nevou & Texturização Moderna",
    instagram: "lucasstreet_cut",
    available: true,
  },
];

export const initialGallery: GalleryItem[] = [
  {
    id: "gal-1",
    url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80",
    title: "Mid Fade com Texturização",
    category: "cortes",
    alt: "Corte fade moderno com degradê perfeito",
  },
  {
    id: "gal-2",
    url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
    title: "Barboterapia Tradicional",
    category: "barbas",
    alt: "Alinhamento de barba com navalha e toalha",
  },
  {
    id: "gal-3",
    url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
    title: "Estúdio Vintage Hype",
    category: "ambiente",
    alt: "Poltrona clássica de couro e bancada da barbearia",
  },
  {
    id: "gal-4",
    url: "https://images.unsplash.com/photo-1517832606589-71575354be37?w=800&q=80",
    title: "Taper Fade & Freestyle",
    category: "cortes",
    alt: "Corte com desenho freestyle na nuca",
  },
  {
    id: "gal-5",
    url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80",
    title: "Barba Lenhador Alinhada",
    category: "barbas",
    alt: "Design de barba longa desenhada e hidratada",
  },
  {
    id: "gal-6",
    url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
    title: "Espaço Lounge & Chopp",
    category: "ambiente",
    alt: "Área de espera com frigobar e tijolos aparentes",
  },
];

export const initialReviews: ReviewItem[] = [
  {
    id: "rev-1",
    text: "Ambiente sensacional! A energia streetwear com atendimento de altíssimo nível. O fade do Carlos é cirúrgico.",
    author: "Matheus Andrade",
    service: "Corte Fade",
    rating: 5,
  },
  {
    id: "rev-2",
    text: "A barboterapia é uma experiência à parte. A toalha quente e a massagem facial tiram o estresse da semana inteira.",
    author: "Renato Silveira",
    service: "Barba Terapia Garage",
    rating: 5,
  },
  {
    id: "rev-3",
    text: "Agendamento rápido pelo WhatsApp e pontualidade britânica. Melhor barbearia de SP sem sombra de dúvidas.",
    author: "Guilherme Sampaio",
    service: "Combo Vintage Hype",
    rating: 5,
  },
];

export const initialHours: HourItem[] = [
  { id: "h-seg", day: "Segunda-feira", time: "Fechado para treinamento", active: false },
  { id: "h-ter-sex", day: "Terça a Sexta", time: "09:00 — 20:00", active: true },
  { id: "h-sab", day: "Sábado", time: "08:00 — 18:00", active: true },
  { id: "h-dom", day: "Domingo", time: "09:00 — 13:00", active: true },
];

export const initialFaqs: FaqItem[] = [
  {
    id: "faq-1",
    q: "Como funciona o agendamento?",
    a: "É 100% digital e rápido! Basta clicar em qualquer botão de agendamento para abrir seu WhatsApp com o serviço escolhido já preenchido. Nós confirmamos seu horário em minutos.",
  },
  {
    id: "faq-2",
    q: "Posso ser atendido sem agendamento prévio?",
    a: "Damos prioridade aos clientes agendados, mas sempre que houver encaixe disponível em nossa bancada, teremos prazer em atendê-lo por ordem de chegada.",
  },
  {
    id: "faq-3",
    q: "Quais são as formas de pagamento aceitas?",
    a: "Aceitamos PIX com desconto, cartões de crédito e débito de todas as bandeiras e dinheiro em espécie.",
  },
  {
    id: "faq-4",
    q: "O local possui estacionamento?",
    a: "Sim! Oferecemos vagas gratuitas exclusivas para clientes diretamente em frente à barbearia.",
  },
];

// Constantes e funções para compatibilidade com a página principal
export const address = initialBusinessInfo.address;
export const phone = initialBusinessInfo.phone;
export const rawPhone = initialBusinessInfo.rawPhone;
export const mapsLink = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
export const telLink = `tel:+${rawPhone}`;
export const services = initialServices;
export const team = initialTeam;
export const reviews = initialReviews;
export const hours = initialHours;
export const faqs = initialFaqs;

export function whatsappLink(serviceName?: string, barberName?: string, preferredDate?: string) {
  let text = "Olá! Gostaria de agendar um horário na BarberShop Garage.";
  if (serviceName && barberName) {
    text = `Olá! Gostaria de agendar o serviço "${serviceName}" com o barbeiro ${barberName}${preferredDate ? ` para ${preferredDate}` : ""} na BarberShop Garage.`;
  } else if (serviceName) {
    text = `Olá! Gostaria de agendar o serviço "${serviceName}" na BarberShop Garage.`;
  }
  return `https://wa.me/${initialBusinessInfo.rawPhone}?text=${encodeURIComponent(text)}`;
}

export function getTodayStatus(): { isOpen: boolean; label: string; detail: string } {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;

  if (day === 1) {
    return { isOpen: false, label: "Fechado hoje", detail: "Abre terça às 09h" };
  }
  if (day === 0) {
    const isOpen = hour >= 9 && hour < 13;
    return {
      isOpen,
      label: isOpen ? "Aberto agora" : "Fechado agora",
      detail: isOpen ? "Hoje até 13h" : "Abre terça às 09h",
    };
  }
  if (day === 6) {
    const isOpen = hour >= 8 && hour < 18;
    return {
      isOpen,
      label: isOpen ? "Aberto agora" : "Fechado agora",
      detail: isOpen ? "Hoje até 18h" : "Abre domingo às 09h",
    };
  }

  // Terça a Sexta
  const isOpen = hour >= 9 && hour < 20;
  return {
    isOpen,
    label: isOpen ? "Aberto agora" : "Fechado agora",
    detail: isOpen ? "Hoje até 20h" : "Abre amanhã às 09h",
  };
}
