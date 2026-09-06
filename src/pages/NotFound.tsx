import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-4xl font-bold mb-2 text-foreground">404</h1>
        <p className="text-muted-foreground mb-6">Page not found</p>
        <button onClick={() => navigate('/dashboard')}
          className="px-4 py-2 rounded text-sm font-medium text-white"
          style={{ background: 'hsl(var(--primary))' }}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
