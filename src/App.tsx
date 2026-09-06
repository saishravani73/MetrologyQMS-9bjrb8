import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';

import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import ToolRegister from '@/pages/ToolRegister';
import ToolDetail from '@/pages/ToolDetail';
import CalibrationUpcoming from '@/pages/CalibrationUpcoming';
import CalibrationOverdue from '@/pages/CalibrationOverdue';
import CalibrationCalendar from '@/pages/CalibrationCalendar';
import CalibrationHistory from '@/pages/CalibrationHistory';
import Inspection from '@/pages/Inspection';
import Tasks from '@/pages/Tasks';
import Documents from '@/pages/Documents';
import Reports from '@/pages/Reports';
import DataImport from '@/pages/DataImport';
import Notifications from '@/pages/Notifications';
import AuditLog from '@/pages/AuditLog';
import DataQuality from '@/pages/DataQuality';
import UsersRoles from '@/pages/UsersRoles';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tools" element={<ToolRegister />} />
        <Route path="/tools/:id" element={<ToolDetail />} />
        <Route path="/calibration/upcoming" element={<CalibrationUpcoming />} />
        <Route path="/calibration/overdue" element={<CalibrationOverdue />} />
        <Route path="/calibration/calendar" element={<CalibrationCalendar />} />
        <Route path="/calibration/history" element={<CalibrationHistory />} />
        <Route path="/inspection" element={<Inspection />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/import" element={<DataImport />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/audit" element={<AuditLog />} />
        <Route path="/data-quality" element={<DataQuality />} />
        <Route path="/users" element={<UsersRoles />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
