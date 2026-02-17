// ──────────────────────────────────────
// Generic CSV / JSON export utilities
// ──────────────────────────────────────

export interface ExportColumn {
  key: string;
  label: string;
}

export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn[],
  filename: string,
) {
  const header = columns.map((c) => `"${c.label}"`).join(',');
  const rows = data.map((row) =>
    columns.map((c) => {
      const val = row[c.key];
      const str = val == null ? '' : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    }).join(','),
  );
  const csv = [header, ...rows].join('\n');
  downloadBlob(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

export function exportToJSON<T>(data: T[], filename: string) {
  const json = JSON.stringify(data, null, 2);
  downloadBlob(json, `${filename}.json`, 'application/json');
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
