'use client';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="confirm-dialog-backdrop" onClick={onCancel} />
      <div className="confirm-dialog">
        <h3 className="confirm-dialog-title">{title}</h3>
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button
            className="confirm-dialog-button confirm-dialog-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="confirm-dialog-button confirm-dialog-confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
}
