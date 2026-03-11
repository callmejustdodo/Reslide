interface PresenterNotesProps {
  notes: string;
}

export function PresenterNotes({ notes }: PresenterNotesProps) {
  return (
    <div style={{
      flex: 1,
      overflow: 'auto',
      padding: '1rem',
      fontSize: '1.25rem',
      lineHeight: 1.6,
      color: '#e2e8f0',
      fontFamily: "'Inter', system-ui, sans-serif",
      whiteSpace: 'pre-wrap',
    }}>
      {notes || <span style={{ color: '#64748b', fontStyle: 'italic' }}>No speaker notes</span>}
    </div>
  );
}
