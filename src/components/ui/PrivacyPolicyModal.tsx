import React from "react";
import { motion } from "framer-motion";
import { X, ShieldCheck } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h3 id="privacy-modal-title" className="font-display text-base font-bold text-slate-950">
                Política de Privacidade & LGPD
              </h3>
              <p className="text-[11px] text-slate-500">
                Conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Fechar modal de privacidade"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Conteúdo com Rolagem */}
        <div className="overflow-y-auto p-6 text-xs text-slate-600 space-y-4 leading-relaxed">
          <section>
            <h4 className="font-bold text-slate-900 text-sm mb-1">1. Informações Gerais</h4>
            <p>
              A BarberShop Garage tem o compromisso de respeitar a sua privacidade e garantir o sigilo
              de todas as informações que você nos fornece. Este site opera como uma plataforma
              institucional e de facilitação de agendamento de serviços.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 text-sm mb-1">2. Coleta e Uso de Dados</h4>
            <p>
              Nosso site não realiza cadastro compulsório, cobrança direta ou retenção invasiva de
              dados bancários. Ao clicar em botões de agendamento, você é redirecionado ao aplicativo
              oficial do WhatsApp, ambiente seguro onde o atendimento e a marcação de horários são
              conduzidos com base no seu consentimento expresso.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 text-sm mb-1">3. Cookies e Rastreamento</h4>
            <p>
              Utilizamos cookies estritamente necessários para o funcionamento e preservação de preferências
              visuais e métricas anônimas de navegação (Google Analytics). Nenhuma informação de
              navegação é vendida ou repassada a terceiros.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 text-sm mb-1">4. Fotos na Galeria e Direitos de Imagem</h4>
            <p>
              Todas as imagens de clientes exibidas em nossa galeria foram autorizadas previamente
              pelos respectivos clientes ou representam modelos profissionais no contexto de exibição
              técnica de cortes e barboterapia. Caso deseje solicitar a remoção de qualquer imagem,
              basta entrar em contato diretamente via WhatsApp.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 text-sm mb-1">5. Contato do Encarregado de Dados</h4>
            <p>
              Para quaisquer dúvidas sobre nossa política de privacidade ou solicitações referentes à
              LGPD, contate a gerência pelo e-mail ou WhatsApp oficial disponível em nosso rodapé.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors"
          >
            Entendido e Aceito
          </button>
        </div>
      </motion.div>
    </div>
  );
};
