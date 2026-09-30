import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

/**
 * ===========================================
 * Toasts
 * ===========================================
 *
 * Short confirmations and failures for actions
 * that change something without navigating -- adding
 * to the cart, saving to the wishlist.
 *
 * Written here rather than pulled in: the project
 * has no notification library installed, and the
 * whole of what is needed is a list, a timer and a
 * live region.
 *
 * Two rules shape the implementation:
 *
 *   - A toast is raised by whoever knows the action
 *     finished, never by the code that started it.
 *     Nothing in here decides that something
 *     succeeded.
 *
 *   - Repeating an action must not stack up copies
 *     of the same message. Each toast carries a key,
 *     and raising one that is already on screen
 *     replaces it and restarts its timer rather than
 *     adding a second.
 */

export type ToastTone = "success" | "error";

interface Toast {
  /**
   * Also the dedupe key. Two raises with the same id
   * are the same notification, shown once.
   */
  id: string;

  tone: ToastTone;

  message: string;
}

export interface ToastOptions {
  /**
   * Overrides the default dedupe key, which is the
   * tone and the message together.
   *
   * Worth setting where the wording varies but the
   * notification does not -- a per-product key, say,
   * so that adding two different products shows two
   * toasts while double-clicking one product shows
   * one.
   */
  key?: string;

  /** Milliseconds on screen. */
  duration?: number;
}

/**
 * Failures are left up longer than confirmations:
 * they usually carry something the customer has to
 * act on.
 */
const DURATIONS: Record<ToastTone, number> = {
  success: 4000,
  error: 7000,
};

/**
 * Enough to show that several things happened
 * without burying the page under them. Oldest go
 * first.
 */
const MAX_VISIBLE = 3;

interface ToastContextType {
  success: (
    message: string,
    options?: ToastOptions
  ) => void;

  error: (
    message: string,
    options?: ToastOptions
  ) => void;

  dismiss: (id: string) => void;
}

const ToastContext =
  createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({
  children,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Dismiss timers, by toast id. Held in a ref
   * because a re-render must not restart them, and
   * because replacing a toast has to cancel the
   * timer the old one was running on.
   */
  const timers = useRef(
    new Map<string, ReturnType<typeof setTimeout>>()
  );

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);

    if (timer !== undefined) {
      clearTimeout(timer);
      timers.current.delete(id);
    }

    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  }, []);

  const show = useCallback(
    (
      tone: ToastTone,
      message: string,
      options?: ToastOptions
    ) => {
      const trimmed = message.trim();

      // Nothing useful to say. An empty toast is
      // worse than none: it takes up the screen and
      // announces silence.
      if (!trimmed) return;

      const id =
        options?.key ?? `${tone}:${trimmed}`;

      setToasts((current) => {
        const without = current.filter(
          (toast) => toast.id !== id
        );

        return [
          ...without,
          { id, tone, message: trimmed },
        ].slice(-MAX_VISIBLE);
      });

      const existing = timers.current.get(id);

      if (existing !== undefined) {
        clearTimeout(existing);
      }

      timers.current.set(
        id,
        setTimeout(
          () => dismiss(id),
          options?.duration ?? DURATIONS[tone]
        )
      );
    },
    [dismiss]
  );

  // Timers outliving the tree would fire into a
  // provider that is no longer mounted.
  useEffect(() => {
    const pending = timers.current;

    return () => {
      for (const timer of pending.values()) {
        clearTimeout(timer);
      }

      pending.clear();
    };
  }, []);

  const value = useMemo<ToastContextType>(
    () => ({
      success: (message, options) =>
        show("success", message, options),

      error: (message, options) =>
        show("error", message, options),

      dismiss,
    }),
    [show, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <ToastViewport
        toasts={toasts}
        onDismiss={dismiss}
      />
    </ToastContext.Provider>
  );
}

/**
 * ===========================================
 * Viewport
 * ===========================================
 *
 * Full width above the fold of a phone, a fixed
 * column on larger screens. It sits above the
 * sticky header, and does not take pointer events
 * itself, so the page underneath stays usable while
 * a toast is on screen.
 */

interface ToastViewportProps {
  toasts: Toast[];

  onDismiss: (id: string) => void;
}

function ToastViewport({
  toasts,
  onDismiss,
}: ToastViewportProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="
        pointer-events-none
        fixed
        inset-x-0
        bottom-0
        z-[60]
        flex
        flex-col
        gap-3
        p-4
        sm:inset-x-auto
        sm:bottom-6
        sm:right-6
        sm:w-96
        sm:p-0
      "
    >
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

/**
 * ===========================================
 * Card
 * ===========================================
 *
 * The role is what carries this to a screen reader.
 * "status" is announced when the reader next pauses,
 * which is right for a confirmation; "alert"
 * interrupts, which is right for something that has
 * gone wrong. The container above is deliberately
 * not a live region as well -- nesting them makes
 * some readers announce twice.
 */

interface ToastCardProps {
  toast: Toast;

  onDismiss: (id: string) => void;
}

function ToastCard({
  toast,
  onDismiss,
}: ToastCardProps) {
  const isError = toast.tone === "error";

  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-atomic="true"
      className={`
        pointer-events-auto
        flex
        items-start
        gap-3
        rounded-xl
        border
        p-4
        shadow-lg

        ${
          isError
            ? "border-red-200 bg-red-50 text-red-800"
            : "border-green-200 bg-green-50 text-green-800"
        }
      `}
    >
      <Icon
        size={20}
        className={`
          mt-0.5
          shrink-0

          ${
            isError
              ? "text-red-600"
              : "text-green-600"
          }
        `}
        aria-hidden="true"
      />

      <p className="min-w-0 flex-1 text-sm font-medium">
        {toast.message}
      </p>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className={`
          shrink-0
          rounded-lg
          p-1
          transition-colors

          ${
            isError
              ? "hover:bg-red-100"
              : "hover:bg-green-100"
          }
        `}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
}
