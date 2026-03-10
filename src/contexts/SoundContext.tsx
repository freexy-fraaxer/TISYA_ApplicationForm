import { createContext, useContext, ReactNode } from "react";
import useSoundFeedback from "@/hooks/useSoundFeedback";

type SoundContextType = ReturnType<typeof useSoundFeedback>;

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const soundFeedback = useSoundFeedback();

  return (
    <SoundContext.Provider value={soundFeedback}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};
