import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { BellBing, CheckCircle, CloseCircle, DangerTriangle } from "@/lib/icons";

type ToastVariant = "default" | "success" | "destructive" | "warning";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (message: string, variant?: ToastVariant) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "default") => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const variantStyles = {
    default: "border-hairline bg-midnight-soft text-ink",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    destructive: "border-destructive/30 bg-destructive/10 text-destructive",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  };

  const icons = {
    default: <BellBing size={16} className="text-ink-soft" />,
    success: <CheckCircle size={16} className="text-emerald-400" />,
    destructive: <CloseCircle size={16} className="text-destructive" />,
    warning: <DangerTriangle size={16} className="text-amber-400" />,
  };

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 min-w-[280px] max-w-md border
        shadow-soft-lift animate-slide-in
        ${variantStyles[toast.variant]}
      `}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.variant]}</div>
      <p className="text-sm text-ink flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-ink-soft hover:text-ink transition-colors p-1 cursor-pointer"
        aria-label="Dismiss"
      >
        <CloseCircle size={14} />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
