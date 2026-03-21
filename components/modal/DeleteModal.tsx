"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

type Props = {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  isSubmitting?: boolean;
};

export const DeleteModal = ({
  open,
  onConfirm,
  onClose,
  isSubmitting,
}: Props) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#062d33]/45 backdrop-blur"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md rounded-3xl bg-(--surface) px-8 py-10 text-(--foreground) shadow-[0_28px_80px_rgba(9,63,70,0.22)] ring-1 ring-(--border-color)"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="mb-4 text-center text-lg font-semibold text-(--primary-strong)">
              Delete item
            </h2>

            <p className="mb-8 text-center text-base leading-relaxed text-(--muted-text)">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-10 min-w-30 rounded-xl border border-(--border-color) bg-(--surface) px-5 text-sm font-semibold text-(--foreground) transition-colors duration-300 hover:border-(--primary) hover:bg-(--primary-soft) hover:text-(--primary-strong) disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                disabled={isSubmitting}
                className="h-10 min-w-30 rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
