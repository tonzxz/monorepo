import { ConfirmationModal } from "@/components/common/dynamic/confirmation-modal"

export function DeleteModal({
  open,
  onOpenChange,
  title = "Delete item?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  isPending = false,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  isPending?: boolean
}) {
  return (
    <ConfirmationModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      confirmVariant="destructive"
      isPending={isPending}
    />
  )
}
