"use client";

import RootLoading from "@/components/feedback/RootLoading";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type LangLoadingContextValue = {
  isLangLoading: boolean;
  setLangLoading: (loading: boolean) => void;
};

const LangLoadingContext = createContext<LangLoadingContextValue | null>(null);

type LangLoadingProviderProps = {
  children: ReactNode;
};

export const LangLoadingProvider = ({ children }: LangLoadingProviderProps) => {
  const [isLangLoading, setIsLangLoading] = useState(false);

  const contextValue = useMemo(
    () => ({
      isLangLoading,
      setLangLoading: setIsLangLoading,
    }),
    [isLangLoading]
  );

  return (
    <LangLoadingContext.Provider value={contextValue}>
      {children}
      {isLangLoading && <RootLoading />}
    </LangLoadingContext.Provider>
  );
};

export const useLangLoading = () => {
  const context = useContext(LangLoadingContext);
  if (!context) {
    throw new Error("useLangLoading must be used within LangLoadingProvider");
  }
  return context;
};
