import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  type ServiceItem,
  type TeamMember,
  type GalleryItem,
  type HourItem,
  type BusinessInfo,
} from "@/components/demo/data";

export interface BarbershopCloudPayload {
  services: ServiceItem[];
  team: TeamMember[];
  gallery: GalleryItem[];
  hours: HourItem[];
  businessInfo: BusinessInfo;
  updatedAt: string;
}

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  supabaseAnonKey.length > 10
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const RECORD_ID = "garage_main";

/**
 * Busca os dados mais atualizados da barbearia salvos na nuvem do Supabase.
 */
export async function fetchBarbershopFromCloud(): Promise<BarbershopCloudPayload | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("barbershop_data")
      .select("payload, updated_at")
      .eq("id", RECORD_ID)
      .maybeSingle();

    if (error) {
      console.warn("Aviso ao buscar dados do Supabase:", error.message);
      return null;
    }

    if (data && data.payload) {
      return data.payload as BarbershopCloudPayload;
    }
  } catch (err) {
    console.error("Erro inesperado ao consultar Supabase:", err);
  }
  return null;
}

/**
 * Salva ou atualiza os dados da barbearia no Supabase para que todos os clientes vejam.
 */
export async function saveBarbershopToCloud(
  payload: BarbershopCloudPayload
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: "Supabase não configurado (modo local-first)" };
  }
  try {
    const { error } = await supabase.from("barbershop_data").upsert(
      {
        id: RECORD_ID,
        payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("Erro ao salvar no Supabase:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Erro inesperado ao gravar no Supabase:", message);
    return { success: false, error: message };
  }
}

/**
 * Assina atualizações em tempo real para refletir mudanças instantaneamente se outro admin editar
 */
export function subscribeToBarbershopChanges(
  onUpdate: (payload: BarbershopCloudPayload) => void
) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel("barbershop_realtime_sync")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "barbershop_data",
        filter: `id=eq.${RECORD_ID}`,
      },
      (payload) => {
        if (payload.new && typeof payload.new === "object" && "payload" in payload.new) {
          onUpdate(payload.new.payload as BarbershopCloudPayload);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
