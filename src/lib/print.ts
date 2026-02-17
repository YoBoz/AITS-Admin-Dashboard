// ──────────────────────────────────────
// Print utilities
// ──────────────────────────────────────

export function triggerPrint(title?: string) {
  if (title) {
    const prev = document.title;
    document.title = title;
    window.print();
    document.title = prev;
  } else {
    window.print();
  }
}
