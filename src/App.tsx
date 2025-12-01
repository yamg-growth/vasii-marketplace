import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { PromotionBanner } from "./components/PromotionBanner";
import AdminUpload from "./pages/AdminUpload";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Login route (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin-upload" element={<AdminUpload />} />
          {/* Protected admin route (no public layout) */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          
          {/* Public routes (with layout) */}
          <Route path="/*" element={
            <>
              <PromotionBanner />
              <Header />
              <main className="font-sans">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalogo" element={<Catalog />} />
                  <Route path="/colecciones" element={<Collections />} />
                  <Route path="/coleccion/:collectionId" element={<CollectionDetail />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
