import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { shortcuts, categoryLabels, type ShortcutDef } from '@/lib/keyboard';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants, backdropVariants } from '@/lib/animations';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  const { t } = useTranslation();

  const grouped = shortcuts.reduce<Record<string, ShortcutDef[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          {/* Dialog */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl border bg-popover shadow-xl"
            role="dialog"
            aria-label={t('common.keyboardShortcuts', 'Keyboard Shortcuts')}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold font-[Montserrat]">
                {t('common.keyboardShortcuts', 'Keyboard Shortcuts')}
              </h2>
              <button
                onClick={() => onOpenChange(false)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-5">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {categoryLabels[category] ?? category}
                  </h3>
                  <div className="space-y-1">
                    {items.map((shortcut) => (
                      <div
                        key={shortcut.keys}
                        className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50"
                      >
                        <span className="text-sm">{shortcut.label}</span>
                        <div className="flex gap-1">
                          {shortcut.keys.split('+').map((key, i) => (
                            <kbd
                              key={i}
                              className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-xs font-medium rounded border bg-muted text-muted-foreground"
                            >
                              {key.trim()}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Press <kbd className="px-1 py-0.5 rounded border bg-muted text-xs">Esc</kbd> to close
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
