import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface BackgroundEffectsContextType {
  backgroundBlurred: boolean;
  setBackgroundBlurred: (blurred: boolean) => void;
  triggerPulse: () => void;
  isPulsing: boolean;
}

const BackgroundEffectsContext = createContext<BackgroundEffectsContextType | null>(null);

export const BackgroundEffectsProvider = ({ children }: { children: ReactNode }) => {
  const [backgroundBlurred, setBackgroundBlurred] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const triggerPulse = useCallback(() => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 600);
  }, []);

  return (
    <BackgroundEffectsContext.Provider 
      value={{ 
        backgroundBlurred, 
        setBackgroundBlurred, 
        triggerPulse, 
        isPulsing 
      }}
    >
      {children}
    </BackgroundEffectsContext.Provider>
  );
};

export const useBackgroundEffects = () => {
  const context = useContext(BackgroundEffectsContext);
  if (!context) {
    throw new Error("useBackgroundEffects must be used within a BackgroundEffectsProvider");
  }
  return context;
};
