import React, { useState } from "react";
import { MapPin, Phone, Clock, ArrowRight, Star } from "lucide-react";
import { DemoBar } from "@/components/demo/DemoBar";
import { services, team, reviews, hours, faqs, address, phone } from "@/components/demo/data";
import heroImg from "@/assets/demo2-hero.png";
import logoImg from "@/assets/logo.jpg";
import ScissorsBackground from "@/components/ScissorsHero/ScissorsBackground";
import ScissorsIntro from "@/components/ScissorsHero/ScissorsIntro";

export default function LayoutColuna() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="bg-background text-foreground min-h-screen relative">
      {/* Intro com Three.js — desmonta automaticamente após a cortina abrir */}
      {showIntro && <ScissorsIntro onComplete={() => setShowIntro(false)} />}
      {/* Tesoura de fundo, responde ao scroll */}
      <ScissorsBackground />

      <DemoBar current="Coluna fixa" />

      <div className="container-page lg:grid lg:grid-cols-[22rem_1fr] lg:gap-12 relative z-10">
        {/* Coluna fixa: identidade + agendamento sempre à vista */}
        <aside className="border-b border-border py-8 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:py-10">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-4">
              <img src={logoImg} alt="BarberShop Garage Logo" className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-primary">BarberShop Garage</h1>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Desde 2016
                </p>
              </div>
            </div>

            <img
              src={heroImg}
              alt="Barbeiro finalizando um corte"
              className="mt-6 hidden aspect-4/5 w-full rounded-xl object-cover shadow-soft lg:block"
            />

            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-3">
                <MapPin className="size-4 text-primary" /> {address}
              </p>
              <p className="flex items-center gap-3">
                <Phone className="size-4 text-primary" /> {phone}
              </p>
              <p className="flex items-center gap-3">
                <Clock className="size-4 text-primary" /> Hoje: 09h — 20h
              </p>
            </div>

            <div className="mt-6 lg:mt-auto">
              <a
                href="#agendar"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
              >
                Agendar horário <ArrowRight className="size-4" />
              </a>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Confirmação imediata no WhatsApp
              </p>
            </div>
          </div>
        </aside>

        {/* Conteúdo rolável */}
        <main className="py-10 lg:py-10">
          <section>
            <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-foreground">
              Estilo e tradição no seu visual
            </h2>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground leading-relaxed">
              Aqui no BarberShop Garage, unimos a clássica barbearia com um ambiente moderno e descontraído.
              Neste layout com coluna fixa, o contato e agendamento estão sempre visíveis.
            </p>
          </section>

          <section id="servicos" className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight text-primary border-b border-border pb-2 mb-6">Serviços</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {services.map((s) => (
                <div
                  key={s.name}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{s.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">{s.time}</span>
                    <span className="text-lg font-bold">{s.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="equipe" className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight text-primary border-b border-border pb-2 mb-6">Nossa Equipe</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {team.map((m) => (
                <div key={m.name} className="flex flex-col items-center text-center rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 font-bold text-xl text-primary mb-4">
                    {m.initials}
                  </div>
                  <h3 className="font-semibold text-lg">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.role}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight text-primary border-b border-border pb-2 mb-6">Avaliações</h2>
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <blockquote key={i} className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                  <div className="flex gap-1 text-yellow-500 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="leading-relaxed text-foreground/90 italic">"{r.text}"</p>
                  <footer className="mt-4 text-sm font-medium text-muted-foreground">— {r.author}</footer>
                </blockquote>
              ))}
            </div>
          </section>

          <section id="horarios" className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight text-primary border-b border-border pb-2 mb-6">Horários de Funcionamento</h2>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              {hours.map((h) => (
                <div key={h.day} className="flex justify-between border-b border-border py-3 text-sm last:border-0 last:pb-0">
                  <span className="font-medium text-muted-foreground">{h.day}</span>
                  <span className="font-semibold">{h.time}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight text-primary border-b border-border pb-2 mb-6">Dúvidas Comuns</h2>
            <dl className="space-y-4">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                  <dt className="font-semibold text-lg">{f.q}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="agendar" className="mt-16 rounded-2xl bg-primary p-10 text-center text-primary-foreground shadow-lg">
            <h2 className="text-3xl font-bold tracking-tight">Pronto para dar um tapa no visual?</h2>
            <p className="mx-auto mt-4 max-w-md text-primary-foreground/90 text-lg">
              Escolha o serviço, o barbeiro e o horário. Leva menos de um minuto.
            </p>
            <a
              href="#agendar"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-background px-8 py-4 font-bold text-primary shadow-soft hover:bg-background/90 transition-colors"
            >
              Ver horários livres <ArrowRight className="size-5" />
            </a>
          </section>

          <footer className="mt-16 border-t border-border pt-8 pb-4 text-center text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-2">BarberShop Garage</p>
            <p>{address} · {phone}</p>
            <p className="mt-4 text-xs opacity-75">© {new Date().getFullYear()} BarberShop Garage. Todos os direitos reservados.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
