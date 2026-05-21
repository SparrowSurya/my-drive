import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/icon";
import { SnackbarOptions } from "@/contexts/snackbar";


export type SnackbarProps = {
  options: SnackbarOptions,
  close: () => void,
};

export default function Snackbar({ options, close }: Readonly<SnackbarProps>) {
  const handleUndo = () => {
    if (options.undoAction) {
      options.undoAction();
    }
    close();
  };

  return (
    <div className="fixed bottom-8 left-8 z-1000002 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-surface0 text-text px-4 py-3 rounded-lg shadow-2xl shadow-crust flex items-center gap-6 min-w-[320px] max-w-md border border-surface1">
        <div className="flex items-center gap-3 grow">
          {options.icon && <span className="text-lavender">{options.icon}</span>}
          <span className="text-sm font-medium leading-tight">{options.message}</span>
        </div>

        <div className="flex items-center gap-2">
          {options.undoAction && (
            <button
              onClick={handleUndo}
              className="text-lavender hover:bg-lavender/10 px-3 py-1.5 rounded-md text-sm font-bold transition-colors uppercase tracking-wider"
            >
              Undo
            </button>
          )}

          <button
            onClick={close}
            className="text-subtext0 hover:text-text p-1.5 rounded-full hover:bg-surface1 transition-all"
            aria-label="Close"
          >
            <Icon icon={faXmark} />
          </button>
        </div>
      </div>
    </div>
  );
}
