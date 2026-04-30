import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import RolesPage from "./pages/RolesPage";
import MissionPage from "./pages/MissionPage";
import JoinPage from "./pages/JoinPage";
import NotFound from "./pages/NotFound";
import AppShell from "./components/AppShell";

import { SoundProvider } from "@/contexts/SoundContext";
import { BackgroundEffectsProvider } from "@/contexts/BackgroundEffectsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BackgroundEffectsProvider>
          <SoundProvider>
            <AppShell>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/roles" element={<RolesPage />} />
                <Route path="/mission/:role" element={<MissionPage />} />
                <Route path="/join/:role" element={<JoinPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppShell>
          </SoundProvider>
        </BackgroundEffectsProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;