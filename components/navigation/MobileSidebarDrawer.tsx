"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Sidebar } from "./Sidebar";

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DrawerCtx = createContext<Ctx | null>(null);

type RootProps = {
  children: ReactNode;
};

function Provider({ children }: RootProps) {
  const [open, setOpen] = useState(false);
  return (
    <DrawerCtx.Provider value={{ open, setOpen }}>
      {children}
    </DrawerCtx.Provider>
  );
}

function useDrawer() {
  const ctx = useContext(DrawerCtx);
  if (!ctx) throw new Error("MobileSidebarDrawer used outside Provider");
  return ctx;
}

/**
 * Child of Trigger:
 * - Can be any element that accepts standard HTML attributes (includes aria-* and onClick).
 */
type TriggerChildProps = HTMLAttributes<HTMLElement>;

function DrawerPortal({ children }: { children: ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

function Trigger({ children }: { children: ReactElement<TriggerChildProps> }) {
  const { open, setOpen } = useDrawer();

  if (isValidElement<TriggerChildProps>(children)) {
    const originalOnClick = children.props.onClick;

    const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
      if (typeof originalOnClick === "function") {
        originalOnClick(event);
      }

      if (!event.defaultPrevented) {
        setOpen(true);
      }
    };

    return cloneElement(children, {
      onClick: handleClick,
      "aria-expanded": open,
      "aria-haspopup": "dialog",
    });
  }

  // Fallback if someone accidentally passes a non-ReactElement
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-expanded={open}
      aria-haspopup="dialog"
    >
      {children}
    </button>
  );
}

function Content() {
  const { open, setOpen } = useDrawer();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen]);

  const handleClose = () => setOpen(false);

  return (
    <DrawerPortal>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-[#062d33]/45 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-67.5 border-r border-(--sidebar-border) bg-(--sidebar-bg) shadow-[0_28px_60px_rgba(7,57,64,0.32)] lg:hidden"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
            >
              <Sidebar onNavigate={handleClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </DrawerPortal>
  );
}

function Root({ children }: RootProps) {
  return <Provider>{children}</Provider>;
}

const MobileSidebarDrawer = Object.assign(Root, { Trigger, Content });
export default MobileSidebarDrawer;
