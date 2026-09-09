export const address = "Rua das Flores, 123 - Centro, São Paulo - SP";
export const phone = "(11) 99999-9999";
export const rawPhone = "5511999999999";
export const mapsLink = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
export const telLink = `tel:+${rawPhone}`;

export function whatsappLink(serviceName?: string) {
  const text = serviceName
    ? `Olá! Gostaria de agendar o serviço "${serviceName}" na BarberShop Garage.`
    : "Olá! Gostaria de agendar um horário na BarberShop Garage.";
  return `https://wa.me/${rawPhone}?text=${encodeURIComponent(text)}`;
}

export interface ServiceItem {
  name: string;
  desc: string;
  time: string;
  price: string;
  tag?: string;
  highlight?: boolean;
}

export const services: ServiceItem[] = [
  {
    name: "Corte Fade / Nevou",
    desc: "Degradê navalhado de alta precisão, finalização fosca texturizada e navalha afiada.",
    time: "45 min",
    price: "R$ 55",
    tag: "MAIS PEDIDO",
    highlight: true,
  },
  {
    name: "Barba Terapia Garage",
    desc: "Alinhamento a vapor, toalha quente aromatizada, óleos nobres e massagem facial relaxante.",
    time: "35 min",
    price: "R$ 45",
    tag: "RELAX",
  },
  {
    name: "Combo Vintage Hype",
    desc: "Corte clássico ou moderno + Barboterapia completa + Cerveja artesanal gelada de cortesia.",
    time: "1h 15 min",
    price: "R$ 90",
    tag: "HYPE CHOICE",
    highlight: true,
  },
  {
    name: "Pigmentação & Alinhamento",
    desc: "Correção de falhas e disfarce natural para barba ou cabelo com pigmento de longa duração.",
    time: "40 min",
    price: "R$ 60",
    tag: "ESTILO",
  },
  {
    name: "Acabamento & Pezinho",
    desc: "Contorno com navalha, sobrancelha na lâmina e higienização refrescante pós-corte.",
    time: "20 min",
    price: "R$ 30",
  },
  {
    name: "Platinado / Nevou Completo",
    desc: "Descoloração segura com proteção capilar e tonalização branca ou cinza platinado.",
    time: "2h 30 min",
    price: "R$ 160",
    tag: "TREND",
  },
];

export const team = [
  {
    name: "Carlos 'Blade'",
    initials: "CB",
    role: "Master Barber",
    specialty: "Fade de Alta Precisão & Freestyle",
  },
  {
    name: "Miguel Vintage",
    initials: "MV",
    role: "Especialista Clássico",
    specialty: "Barboterapia com Toalha Quente & Navalha",
  },
  {
    name: "Lucas Street",
    initials: "LS",
    role: "Visagista & Colorista",
    specialty: "Platinados, Nevou & Texturização Moderna",
  },
];

export const reviews = [
  {
    text: "Ambiente sensacional! A energia streetwear com atendimento de altíssimo nível. O fade do Carlos é cirúrgico.",
    author: "Matheus Andrade",
    service: "Corte Fade",
    rating: 5,
  },
  {
    text: "A barboterapia é uma experiência à parte. A toalha quente e a massagem facial tiram o estresse da semana inteira.",
    author: "Renato Silveira",
    service: "Barba Terapia Garage",
    rating: 5,
  },
  {
    text: "Agendamento rápido pelo WhatsApp e pontualidade britânica. Melhor barbearia de SP sem sombra de dúvidas.",
    author: "Guilherme Sampaio",
    service: "Combo Vintage Hype",
    rating: 5,
  },
];

export const hours = [
  { day: "Segunda-feira", time: "Fechado para treinamento", active: false },
  { day: "Terça a Sexta", time: "09:00 — 20:00", active: true },
  { day: "Sábado", time: "08:00 — 18:00", active: true },
  { day: "Domingo", time: "09:00 — 13:00", active: true },
];

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

export const faqs = [
  {
    q: "Como funciona o agendamento?",
    a: "É 100% digital e rápido! Basta clicar em qualquer botão de agendamento para abrir seu WhatsApp com o serviço escolhido já preenchido. Nós confirmamos seu horário em minutos.",
  },
  {
    q: "Posso ser atendido sem agendamento prévio?",
    a: "Damos prioridade aos clientes agendados, mas sempre que houver encaixe disponível em nossa bancada, teremos prazer em atendê-lo por ordem de chegada.",
  },
  {
    q: "Quais são as formas de pagamento aceitas?",
    a: "Aceitamos PIX com desconto, cartões de crédito e débito de todas as bandeiras e dinheiro em espécie.",
  },
  {
    q: "O local possui estacionamento?",
    a: "Sim! Oferecemos vagas gratuitas exclusivas para clientes diretamente em frente à barbearia.",
  },
];
