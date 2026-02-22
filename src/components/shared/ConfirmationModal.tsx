import type { ConfirmationModalProps } from '../../types';

export function ConfirmationModal({
  isOpen,
  title,
  message,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'danger'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getButtonClass = () => {
    switch (variant) {
      case 'danger':
        return 'btn-danger';
      case 'warning':
        return 'btn-warning';
      case 'info':
        return 'btn-primary';
      default:
        return 'btn-danger';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="card max-w-md w-full mx-4 animate-slide-in">
        <div className="card-header">
          <h3 className="text-xl font-display font-semibold text-white">{title}</h3>
        </div>
        <div className="card-body">
          <p className="text-slate-300 mb-4">{message}</p>
          {description && <p className="text-sm text-slate-400 mb-6">{description}</p>}
          <div className="flex space-x-3">
            <button onClick={onCancel} className="btn btn-secondary flex-1" disabled={isLoading}>
              {cancelText}
            </button>
            <button onClick={onConfirm} className={`btn ${getButtonClass()} flex-1`} disabled={isLoading}>
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
