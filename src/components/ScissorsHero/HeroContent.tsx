import React from "react";
import { motion } from "framer-motion";

export default function HeroContent({ show, barbershopName }: { show: boolean, barbershopName: string }) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-center pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4" style={{ color: "var(--color-gold, #C8A96E)" }}>
          {barbershopName}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto" style={{ color: "var(--color-text, #F5F0E8)" }}>
          Classic cuts, modern style. Experience the tradition of fine grooming.
        </p>
        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noreferrer"
          className="inline-block px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-transform hover:scale-105"
          style={{ background: "var(--color-gold, #C8A96E)", color: "var(--color-bg, #1A1A1A)" }}
        >
          Book Appointment
        </a>
      </motion.div>
    </div>
  );
}
