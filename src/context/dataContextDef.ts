import { createContext } from "react";
import {
  type ServiceItem,
  type TeamMember,
  type GalleryItem,
  type HourItem,
  type BusinessInfo,
} from "@/components/demo/data";

export interface DataContextType {
  services: ServiceItem[];
  team: TeamMember[];
  gallery: GalleryItem[];
  hours: HourItem[];
  businessInfo: BusinessInfo;

  addService: (service: Omit<ServiceItem, "id">) => void;
  updateService: (id: string, service: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  toggleServiceActive: (id: string) => void;

  addTeamMember: (member: Omit<TeamMember, "id">) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  toggleTeamMemberAvailable: (id: string) => void;

  addGalleryItem: (item: Omit<GalleryItem, "id">) => void;
  deleteGalleryItem: (id: string) => void;

  updateHourItem: (id: string, changes: Partial<HourItem>) => void;

  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;

  isAdminLoggedIn: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
  updateAdminPin: (currentPin: string, newPin: string) => { success: boolean; message: string };

  exportBackup: () => void;
  importBackup: (jsonString: string) => { success: boolean; message: string };
  resetToDefaults: () => void;
  hasCustomChanges: boolean;

  whatsappLink: (serviceName?: string, barberName?: string, preferredDate?: string) => string;
  mapsLink: string;
  telLink: string;
  storeStatus: { isOpen: boolean; label: string; detail: string };

  syncStatus: "synced" | "syncing" | "local" | "error";
  isCloudConnected: boolean;
  syncToCloud: () => Promise<boolean>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);
