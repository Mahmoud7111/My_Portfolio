import { motion } from 'framer-motion'

export default function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, danger }) {
  if (!open) return null

  return (
    <motion.div
      className="confirm-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onCancel}
    >
      <motion.div
        className="confirm-dialog"
        style={{ '--confirm-accent': danger ? 'var(--coral)' : 'var(--cyan)' }}
        initial={{ scale: 0.92, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 10 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-header">
          <span className="confirm-icon">⚠</span>
          {title}
        </div>
        <div className="confirm-body">{message}</div>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn--cancel" onClick={onCancel} type="button">
            {cancelLabel || 'Cancel'}
          </button>
          <button className="confirm-btn confirm-btn--confirm" onClick={onConfirm} type="button">
            {confirmLabel || 'Confirm'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
