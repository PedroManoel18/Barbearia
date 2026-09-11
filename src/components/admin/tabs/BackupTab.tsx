import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { Download, Upload, RotateCcw, CheckCircle2, AlertTriangle, Cloud, RefreshCw } from "lucide-react";

export const BackupTab: React.FC = () => {
  const { exportBackup, importBackup, resetToDefaults, isCloudConnected, syncStatus, syncToCloud } = useData();
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBackup(content);
      setImportStatus(res);
      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleReset = () => {
    if (
      confirm(
        "Atenção: Tem certeza que deseja restaurar todos os dados originais? Todas as alterações manuais não salvas em backup serão descartadas."
      )
    ) {
      resetToDefaults();
      alert("Configurações originais de fábrica restauradas com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="font-display text-xl font-bold text-slate-950">
          Backup, Exportação & Restauração
        </h2>
        <p className="text-xs text-slate-500">
          Mantenha uma cópia de segurança de todos os seus dados cadastrados ou transfira suas
          configurações para outro computador.
        </p>
      </div>

      {importStatus && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-bold ${
            importStatus.success
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {importStatus.success ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertTriangle className="size-4 shrink-0" />
          )}
          <span>{importStatus.message}</span>
        </div>
      )}

      {/* Grid de Ações de Backup */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Card Exportar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
              <Download className="size-5" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-900">
              Exportar Cópia de Segurança (JSON)
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Baixa um arquivo <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">.json</code> contendo
              todos os seus serviços, preços cadastrados, fotos da galeria, barbeiros e horários.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={exportBackup}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <Download className="size-4" />
              <span>Baixar Arquivo de Backup</span>
            </button>
          </div>
        </div>

        {/* Card Importar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
              <Upload className="size-5" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-900">
              Restaurar Backup Existente
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Envie um arquivo de backup previamente exportado para recuperar todos os seus dados
              instantaneamente.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <Upload className="size-4" />
              <span>Selecionar Arquivo .JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Card Sincronização em Nuvem Supabase */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`rounded-xl p-2.5 shrink-0 ${
                isCloudConnected ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              }`}
            >
              <Cloud className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-bold text-slate-900">
                  Banco de Dados em Nuvem (Supabase)
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                    isCloudConnected
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {isCloudConnected ? "Conectado" : "Modo Local-First"}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-xl">
                {isCloudConnected
                  ? "Seus dados estão sendo sincronizados automaticamente com a nuvem do Supabase. Qualquer alteração feita aqui reflete instantaneamente para todos os clientes que acessam o site."
                  : "Para que as alterações feitas no painel reflitam para todos os clientes na internet, configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no seu arquivo .env e execute o arquivo supabase_schema.sql no editor do Supabase."}
              </p>
              <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold">
                <span className="text-slate-500">Status atual:</span>
                <span
                  className={
                    syncStatus === "synced"
                      ? "text-emerald-600"
                      : syncStatus === "syncing"
                      ? "text-blue-600"
                      : syncStatus === "error"
                      ? "text-rose-600"
                      : "text-amber-600"
                  }
                >
                  {syncStatus === "synced" && "● Sincronizado com sucesso"}
                  {syncStatus === "syncing" && "● Sincronizando alterações..."}
                  {syncStatus === "local" && "● Operando com cache local (offline/pronto para conectar)"}
                  {syncStatus === "error" && "● Falha ao sincronizar com a nuvem"}
                </span>
              </div>
            </div>
          </div>

          {isCloudConnected && (
            <button
              type="button"
              onClick={async () => {
                const ok = await syncToCloud();
                if (ok) {
                  alert("Dados enviados com sucesso para a nuvem do Supabase!");
                } else {
                  alert("Erro ao sincronizar. Verifique a conexão com o Supabase.");
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shrink-0 shadow-sm"
            >
              <RefreshCw className="size-4" />
              <span>Forçar Sincronização</span>
            </button>
          )}
        </div>
      </div>

      {/* Card Reset de Emergência */}
      <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-red-100 p-2 text-red-600 shrink-0">
              <RotateCcw className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-red-950">
                Restaurar Configurações Originais de Fábrica
              </h3>
              <p className="mt-1 text-xs text-red-800 leading-relaxed">
                Restaura o site para os dados e textos iniciais do projeto. Utilize caso deseje
                começar do zero.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-red-300 bg-white px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-600 hover:text-white transition-colors shrink-0 shadow-sm"
          >
            Resetar para Padrão
          </button>
        </div>
      </div>
    </div>
  );
};
