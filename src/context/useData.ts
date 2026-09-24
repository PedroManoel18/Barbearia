import { useContext } from "react";
import { DataContext, type DataContextType } from "./dataContextDef";

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData deve ser usado dentro de um DataProvider");
  }
  return context;
};
