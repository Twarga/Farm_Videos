import styles from './AdminDataTable.module.css';

export type AdminColumn = { key: string; label: string; align?: "left" | "right" };

const STATUS_COLUMNS = new Set(["status", "state", "result", "health", "readiness", "availability", "application"]);

/** Map a status-ish cell to a chip tone without teaching every page a new prop. */
function toneFor(value: string): "good" | "warn" | "bad" | null {
  const normalized = value.trim().toLowerCase();
  if (/^(ok|active|published|available|success|verified|live|pass|current|public|approved)$/.test(normalized)) return "good";
  if (/^(error|failed|fail|blocked|missing|unavailable|closed|rejected)$/.test(normalized)) return "bad";
  if (/^(draft|pending|paused|warning|stale|unknown|not published|not available|rolled-back|superseded|inactive|application|partner-only|applied|researching|not-started|none)$/.test(normalized)) return "warn";
  return null;
}

export function AdminDataTable({ columns, rows, empty = "No records.", caption = "Administrative records" }: { columns: AdminColumn[]; rows: Array<Record<string, string>>; empty?: string; caption?: string }) {
  if (!rows.length) {
    return (
      <div className={styles.empty}>
        <strong>Nothing to show yet</strong>
        <p>{empty}</p>
      </div>
    );
  }

  return (
    <div className={styles.scroll} role="region" aria-label={caption} tabIndex={0}>
      <table className={styles.table}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>{columns.map((column) => <th key={column.key} scope="col" data-align={column.align}>{column.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || String(index)}>
              {columns.map((column) => {
                const value = row[column.key] || "—";
                const tone = STATUS_COLUMNS.has(column.key) ? toneFor(value) : null;
                const isTimestamp = value.length <= 32 && /^\d{4}-\d{2}-\d{2}(T|\b)/.test(value);
                const isIdentifier = /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(value);
                return (
                  <td key={column.key} data-align={column.align} data-label={column.label}>
                    {tone ? <span className={styles.badge} data-tone={tone}>{value}</span> : <span className={isTimestamp ? styles.nowrap : isIdentifier ? styles.identifier : undefined}>{value}</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
