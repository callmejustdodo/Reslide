import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog.js';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table.js';
import { Badge } from '@/components/ui/badge.js';

const shortcuts = [
  { key: '→ / Space', action: 'Next step or slide' },
  { key: '←', action: 'Previous step or slide' },
  { key: 'Home', action: 'First slide' },
  { key: 'End', action: 'Last slide' },
  { key: 'P', action: 'Presenter mode' },
  { key: 'O', action: 'Slide overview' },
  { key: '?', action: 'Toggle this help' },
];

export function KeyboardHelp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setVisible((v) => !v);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Dialog open={visible} onOpenChange={setVisible}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Keyboard Shortcuts</DialogTitle>
          <DialogDescription>Navigate your presentation with these shortcuts</DialogDescription>
        </DialogHeader>
        <Table>
          <TableBody>
            {shortcuts.map(({ key, action }) => (
              <TableRow key={key}>
                <TableCell className="font-bold whitespace-nowrap w-40">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {key}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
