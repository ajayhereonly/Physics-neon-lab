import { ArrowUpRight, Eraser, Highlighter, MoveUpRight, Pen, Trash2, Undo2 } from 'lucide-react';
import { ChalkTone, DrawingTool, LanguageMode } from '../types/physics';

interface ChalkboardToolbarProps {
  tool: DrawingTool;
  tone: ChalkTone;
  canUndo: boolean;
  language: LanguageMode;
  onSelectTool: (tool: DrawingTool) => void;
  onSelectTone: (tone: ChalkTone) => void;
  onUndo: () => void;
  onClear: () => void;
  onClose: () => void;
}

const INK_TONES: { id: ChalkTone; label: string }[] = [
  { id: 'primary', label: 'Standard Ink' },
  { id: 'bold', label: 'Extra Bold' },
  { id: 'muted', label: 'Gray Shade' },
];

export function ChalkboardToolbar({
  tool,
  tone,
  canUndo,
  language,
  onSelectTool,
  onSelectTone,
  onUndo,
  onClear,
  onClose,
}: ChalkboardToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-black dark:text-white mr-1 whitespace-nowrap">
          {language === 'hi' ? 'चॉकबोर्ड सक्रिय' : 'Chalkboard Active'}
        </span>

        {(
          [
            { id: 'pen', label: 'Solid Pen', Icon: Pen },
            { id: 'arrow', label: 'Solid Arrow', Icon: ArrowUpRight },
            { id: 'dashed-arrow', label: 'Dashed Arrow', Icon: MoveUpRight },
            { id: 'highlighter', label: 'Shade', Icon: Highlighter },
            { id: 'eraser', label: 'Eraser', Icon: Eraser },
          ] as const
        ).map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelectTool(id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border-2 transition-colors whitespace-nowrap cursor-pointer ${
              tool === id
                ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}

        <span className="mx-1 h-5 w-0.5 bg-neutral-300 dark:bg-neutral-700" aria-hidden="true" />

        <div className="flex items-center gap-1.5" role="group" aria-label="Monochrome ink weight">
          {INK_TONES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTone(item.id);
                if (tool === 'eraser') onSelectTool('pen');
              }}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 transition-colors whitespace-nowrap cursor-pointer ${
                tone === item.id && tool !== 'eraser'
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  : 'border-neutral-400 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-35 transition-colors whitespace-nowrap cursor-pointer"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={!canUndo}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-35 transition-colors whitespace-nowrap cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-85 transition-opacity whitespace-nowrap cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}
