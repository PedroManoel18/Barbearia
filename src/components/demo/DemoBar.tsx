import React from "react";

export function DemoBar({ current }: { current: string }) {
  return (
    <div className="bg-foreground text-background py-2 px-4 text-sm text-center flex items-center justify-center gap-4">
      <span className="font-semibold">BarberShop Garage - Modo Demo</span>
      <span className="hidden sm:inline">|</span>
      <span className="text-muted/80 hidden sm:inline">Visualizando: {current}</span>
    </div>
  );
}
