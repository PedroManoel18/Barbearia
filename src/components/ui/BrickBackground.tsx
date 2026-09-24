export function BrickBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* 1. Base em Branco Puro */}
      <div className="absolute inset-0 bg-white" />

      {/* 2. Textura de Parede de Tijolos Cinzas Urbanos em Soft Blur */}
      <div
        className="absolute inset-0 opacity-[0.22] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='40' viewBox='0 0 80 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h80v40H0z' fill='none'/%3E%3Cpath d='M0 19h80M0 39h80M40 0v19M0 20v19M80 20v19' stroke='%2364748B' stroke-width='1.5' stroke-opacity='0.45' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M20 9.5h1.5M60 9.5h1.5M20 29.5h1.5M60 29.5h1.5' stroke='%23475569' stroke-width='1' stroke-opacity='0.25' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundSize: "80px 40px",
          filter: "blur(2.5px)",
          transform: "scale(1.04)", // compensa o blur nas bordas
        }}
      />

      {/* 3. Iluminação de Estúdio Suave (Soft Studio Lights) */}
      <div
        className="absolute -top-[20%] left-1/4 h-[700px] w-[700px] rounded-full opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(241,245,249,0.85) 40%, rgba(255,255,255,0) 70%)",
        }}
      />
      <div
        className="absolute top-[30%] -right-[10%] h-[600px] w-[600px] rounded-full opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,245,155,0.08) 0%, rgba(241,245,249,0.5) 50%, rgba(255,255,255,0) 75%)",
        }}
      />

      {/* 4. Gradiente de Vinheta para Branco Puro no Conteúdo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.88) 65%, rgba(255,255,255,0.98) 100%)",
        }}
      />
    </div>
  );
}
