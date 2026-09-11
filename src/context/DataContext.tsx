/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useMemo, useRef, type ReactNode } from "react";
import {
  type ServiceItem,
  type TeamMember,
  type GalleryItem,
  type HourItem,
  type BusinessInfo,
  initialServices,
  initialTeam,
  initialGallery,
  initialHours,
  initialBusinessInfo,
} from "@/components/demo/data";
import {
  isSupabaseConfigured,
  fetchBarbershopFromCloud,
  saveBarbershopToCloud,
  subscribeToBarbershopChanges,
  type BarbershopCloudPayload,
} from "@/lib/supabase";
import { DataContext } from "./dataContextDef";
export { useData } from "./useData";
export { DataContext, type DataContextType } from "./dataContextDef";

const STORAGE_KEY_DATA = "barbershop_garage_store_v1";
const STORAGE_KEY_AUTH = "barbershop_garage_auth_session";

interface StoredPayload {
  services: ServiceItem[];
  team: TeamMember[];
  gallery: GalleryItem[];
  hours: HourItem[];
  businessInfo: BusinessInfo;
  updatedAt: string;
}

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inicialização com Fallback Seguro do LocalStorage
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATA);
      if (stored) {
        const parsed: StoredPayload = JSON.parse(stored);
        if (Array.isArray(parsed.services)) return parsed.services;
      }
    } catch (e) {
      console.error("Erro ao carregar serviços do localStorage:", e);
    }
    return initialServices;
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATA);
      if (stored) {
        const parsed: StoredPayload = JSON.parse(stored);
        if (Array.isArray(parsed.team)) return parsed.team;
      }
    } catch (e) {
      console.error("Erro ao carregar equipe do localStorage:", e);
    }
    return initialTeam;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATA);
      if (stored) {
        const parsed: StoredPayload = JSON.parse(stored);
        if (Array.isArray(parsed.gallery)) return parsed.gallery;
      }
    } catch (e) {
      console.error("Erro ao carregar galeria do localStorage:", e);
    }
    return initialGallery;
  });

  const [hours, setHours] = useState<HourItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATA);
      if (stored) {
        const parsed: StoredPayload = JSON.parse(stored);
        if (Array.isArray(parsed.hours)) return parsed.hours;
      }
    } catch (e) {
      console.error("Erro ao carregar horários do localStorage:", e);
    }
    return initialHours;
  });

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATA);
      if (stored) {
        const parsed: StoredPayload = JSON.parse(stored);
        if (parsed.businessInfo) return { ...initialBusinessInfo, ...parsed.businessInfo };
      }
    } catch (e) {
      console.error("Erro ao carregar informações de negócio:", e);
    }
    return initialBusinessInfo;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_AUTH) === "true";
    } catch {
      return false;
    }
  });

  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "local" | "error">(
    isSupabaseConfigured ? "syncing" : "local"
  );
  const isFirstRender = useRef(true);

  // 1. Carregar dados da nuvem (Supabase) na inicialização
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    const loadFromCloud = async () => {
      try {
        setSyncStatus("syncing");
        const cloudData = await fetchBarbershopFromCloud();
        if (cloudData && isMounted) {
          if (Array.isArray(cloudData.services) && cloudData.services.length > 0) {
            setServices(cloudData.services);
          }
          if (Array.isArray(cloudData.team) && cloudData.team.length > 0) {
            setTeam(cloudData.team);
          }
          if (Array.isArray(cloudData.gallery) && cloudData.gallery.length > 0) {
            setGallery(cloudData.gallery);
          }
          if (Array.isArray(cloudData.hours) && cloudData.hours.length > 0) {
            setHours(cloudData.hours);
          }
          if (cloudData.businessInfo) {
            setBusinessInfo((prev) => ({ ...prev, ...cloudData.businessInfo }));
          }
          setSyncStatus("synced");
        } else if (isMounted) {
          // Se ainda não existe registro no Supabase, envia o estado inicial padrão
          const initialPayload: BarbershopCloudPayload = {
            services: initialServices,
            team: initialTeam,
            gallery: initialGallery,
            hours: initialHours,
            businessInfo: initialBusinessInfo,
            updatedAt: new Date().toISOString(),
          };
          await saveBarbershopToCloud(initialPayload);
          setSyncStatus("synced");
        }
      } catch (err) {
        console.error("Erro na sincronização com Supabase:", err);
        if (isMounted) setSyncStatus("error");
      }
    };

    loadFromCloud();

    // 2. Ouvir atualizações em tempo real
    const unsubscribe = subscribeToBarbershopChanges((updatedData) => {
      if (!isMounted || !updatedData) return;
      if (Array.isArray(updatedData.services)) setServices(updatedData.services);
      if (Array.isArray(updatedData.team)) setTeam(updatedData.team);
      if (Array.isArray(updatedData.gallery)) setGallery(updatedData.gallery);
      if (Array.isArray(updatedData.hours)) setHours(updatedData.hours);
      if (updatedData.businessInfo) {
        setBusinessInfo((prev) => ({ ...prev, ...updatedData.businessInfo }));
      }
      setSyncStatus("synced");
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 3. Salvar no localStorage e sincronizar com Supabase
  useEffect(() => {
    const payload: BarbershopCloudPayload = {
      services,
      team,
      gallery,
      hours,
      businessInfo,
      updatedAt: new Date().toISOString(),
    };

    // Cache local rápido e offline
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(payload));
    } catch (e) {
      console.error("Erro ao sincronizar dados com localStorage:", e);
    }

    // Se for o primeiro render, evita sobrescrever dados da nuvem antes da leitura inicial
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Se o Supabase estiver configurado, envia as alterações
    if (isSupabaseConfigured) {
      const timer = setTimeout(async () => {
        setSyncStatus("syncing");
        const res = await saveBarbershopToCloud(payload);
        if (res.success) {
          setSyncStatus("synced");
        } else {
          setSyncStatus("error");
        }
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [services, team, gallery, hours, businessInfo]);

  const syncToCloud = async (): Promise<boolean> => {
    if (!isSupabaseConfigured) return false;
    setSyncStatus("syncing");
    const payload: BarbershopCloudPayload = {
      services,
      team,
      gallery,
      hours,
      businessInfo,
      updatedAt: new Date().toISOString(),
    };
    const res = await saveBarbershopToCloud(payload);
    if (res.success) {
      setSyncStatus("synced");
      return true;
    }
    setSyncStatus("error");
    return false;
  };

  // Ações de Serviços
  const addService = (data: Omit<ServiceItem, "id">) => {
    const newService: ServiceItem = {
      ...data,
      id: `srv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setServices((prev) => [newService, ...prev]);
  };

  const updateService = (id: string, changes: Partial<ServiceItem>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...changes } : s))
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleServiceActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  // Ações de Barbeiros
  const addTeamMember = (data: Omit<TeamMember, "id">) => {
    const newMember: TeamMember = {
      ...data,
      id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setTeam((prev) => [...prev, newMember]);
  };

  const updateTeamMember = (id: string, changes: Partial<TeamMember>) => {
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...changes } : m))
    );
  };

  const deleteTeamMember = (id: string) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleTeamMemberAvailable = (id: string) => {
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m))
    );
  };

  // Ações de Galeria
  const addGalleryItem = (data: Omit<GalleryItem, "id">) => {
    const newItem: GalleryItem = {
      ...data,
      id: `gal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setGallery((prev) => [newItem, ...prev]);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  // Ações de Horários
  const updateHourItem = (id: string, changes: Partial<HourItem>) => {
    setHours((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...changes } : h))
    );
  };

  // Ações de Negócio
  const updateBusinessInfo = (changes: Partial<BusinessInfo>) => {
    setBusinessInfo((prev) => ({ ...prev, ...changes }));
  };

  // Autenticação Admin
  const login = (pin: string): boolean => {
    if (pin.trim() === businessInfo.adminPin.trim()) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(STORAGE_KEY_AUTH, "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
  };

  const updateAdminPin = (currentPin: string, newPin: string) => {
    if (currentPin.trim() !== businessInfo.adminPin.trim()) {
      return { success: false, message: "A senha atual informada está incorreta." };
    }
    if (newPin.trim().length < 4) {
      return { success: false, message: "A nova senha deve ter no mínimo 4 caracteres." };
    }
    setBusinessInfo((prev) => ({ ...prev, adminPin: newPin.trim() }));
    return { success: true, message: "Senha administrativa atualizada com sucesso!" };
  };

  // Backup e Restauração
  const exportBackup = () => {
    const payload: StoredPayload = {
      services,
      team,
      gallery,
      hours,
      businessInfo,
      updatedAt: new Date().toISOString(),
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `barbershop_garage_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackup = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed: StoredPayload = JSON.parse(jsonString);
      if (!parsed.services || !parsed.team || !parsed.hours || !parsed.businessInfo) {
        return { success: false, message: "Arquivo JSON inválido ou incompatível." };
      }
      setServices(parsed.services);
      setTeam(parsed.team);
      setGallery(parsed.gallery || initialGallery);
      setHours(parsed.hours);
      setBusinessInfo({ ...initialBusinessInfo, ...parsed.businessInfo });
      return { success: true, message: "Backup restaurado com sucesso! Todos os dados foram atualizados." };
    } catch {
      return { success: false, message: "Falha ao processar o arquivo JSON. Verifique o formato." };
    }
  };

  const resetToDefaults = () => {
    setServices(initialServices);
    setTeam(initialTeam);
    setGallery(initialGallery);
    setHours(initialHours);
    setBusinessInfo(initialBusinessInfo);
    localStorage.removeItem(STORAGE_KEY_DATA);
  };

  const hasCustomChanges = useMemo(() => {
    return (
      services !== initialServices ||
      team !== initialTeam ||
      gallery !== initialGallery ||
      hours !== initialHours ||
      businessInfo !== initialBusinessInfo
    );
  }, [services, team, gallery, hours, businessInfo]);

  // Helpers derivados
  const whatsappLink = (serviceName?: string, barberName?: string, preferredDate?: string) => {
    let text = `Olá! Gostaria de agendar um horário na ${businessInfo.name}.`;
    if (serviceName && barberName) {
      text = `Olá! Gostaria de agendar o serviço "${serviceName}" com o barbeiro ${barberName}${preferredDate ? ` para ${preferredDate}` : ""} na ${businessInfo.name}.`;
    } else if (serviceName) {
      text = `Olá! Gostaria de agendar o serviço "${serviceName}" na ${businessInfo.name}.`;
    }
    return `https://wa.me/${businessInfo.rawPhone}?text=${encodeURIComponent(text)}`;
  };

  const mapsLink = `https://maps.google.com/?q=${encodeURIComponent(businessInfo.address)}`;
  const telLink = `tel:+${businessInfo.rawPhone}`;

  const storeStatus = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours() + now.getMinutes() / 60;

    // Se segunda-feira (1)
    const seg = hours.find((h) => h.id === "h-seg");
    if (day === 1) {
      const isOpen = Boolean(seg?.active);
      return {
        isOpen,
        label: isOpen ? "Aberto agora" : "Fechado hoje",
        detail: isOpen ? seg?.time || "Aberto" : "Abre terça às 09h",
      };
    }

    // Se domingo (0)
    const dom = hours.find((h) => h.id === "h-dom");
    if (day === 0) {
      const isOpen = Boolean(dom?.active) && hour >= 9 && hour < 13;
      return {
        isOpen,
        label: isOpen ? "Aberto agora" : "Fechado agora",
        detail: isOpen ? "Hoje até 13h" : "Abre terça às 09h",
      };
    }

    // Se sábado (6)
    const sab = hours.find((h) => h.id === "h-sab");
    if (day === 6) {
      const isOpen = Boolean(sab?.active) && hour >= 8 && hour < 18;
      return {
        isOpen,
        label: isOpen ? "Aberto agora" : "Fechado agora",
        detail: isOpen ? "Hoje até 18h" : "Abre domingo às 09h",
      };
    }

    // Terça a Sexta
    const terSex = hours.find((h) => h.id === "h-ter-sex");
    const isOpen = Boolean(terSex?.active) && hour >= 9 && hour < 20;
    return {
      isOpen,
      label: isOpen ? "Aberto agora" : "Fechado agora",
      detail: isOpen ? "Hoje até 20h" : "Abre amanhã às 09h",
    };
  }, [hours]);

  return (
    <DataContext.Provider
      value={{
        services,
        team,
        gallery,
        hours,
        businessInfo,
        addService,
        updateService,
        deleteService,
        toggleServiceActive,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        toggleTeamMemberAvailable,
        addGalleryItem,
        deleteGalleryItem,
        updateHourItem,
        updateBusinessInfo,
        isAdminLoggedIn,
        login,
        logout,
        updateAdminPin,
        exportBackup,
        importBackup,
        resetToDefaults,
        hasCustomChanges,
        whatsappLink,
        mapsLink,
        telLink,
        storeStatus,
        syncStatus,
        isCloudConnected: isSupabaseConfigured,
        syncToCloud,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
