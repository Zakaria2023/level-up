"use client";

import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const DropdownMenuContainer = ({ children, className }: Props) => {
  return (
    <ul
      role="menu"
      className={clsx(
        "absolute right-0 z-50 mt-2 w-max min-w-30 overflow-hidden rounded-2xl border border-(--border-color) bg-(--surface) py-1 shadow-[0_25px_70px_rgba(15,23,42,0.2)] backdrop-blur",
        className
      )}
    >
      {children}
    </ul>
  );
};

export default DropdownMenuContainer;
