"use client";

import Link from "next/link";
import { useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { DeleteModal } from "../modal/DeleteModal";

interface Props {
  editLink?: string;
  onDeleteConfirm?: () => void;
  viewLink?: string;
}

const actionButtonClassName =
  "flex h-10 w-10 items-center justify-center rounded-xl border border-(--border-color) bg-(--surface) text-(--muted-text) transition hover:border-[color:var(--primary)] hover:bg-(--primary-soft) hover:text-[color:var(--primary-strong)]";

const DataTableAction = ({ editLink, onDeleteConfirm, viewLink }: Props) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2 text-xl">
        {viewLink && (
          <Link href={viewLink} className={actionButtonClassName}>
            <FaEye />
          </Link>
        )}

        {editLink && (
          <Link href={editLink} className={actionButtonClassName}>
            <FaEdit />
          </Link>
        )}

        {onDeleteConfirm && (
          <button
            type="button"
            onClick={() => setOpenDeleteModal(true)}
            className={actionButtonClassName}
            aria-label="Delete item"
          >
            <RiDeleteBinLine />
          </button>
        )}
      </div>

      {onDeleteConfirm && (
        <DeleteModal
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={onDeleteConfirm}
          open={openDeleteModal}
        />
      )}
    </>
  );
};

export default DataTableAction;
