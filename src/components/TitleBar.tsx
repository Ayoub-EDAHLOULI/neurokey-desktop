import { Minus, Square, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

export default function TitleBar() {
  return (
    <div
      data-tauri-drag-region
      className="h-8 flex justify-between items-center bg-card border-b border-border absolute top-0 left-0 w-full z-50 select-none rounded-t-xl"
    >
      <div data-tauri-drag-region className="flex-1 h-full"></div>
      <div className="flex h-full">
        <div
          className="inline-flex justify-center items-center w-12 h-full hover:bg-inputBg cursor-pointer text-text transition-colors"
          onClick={() => appWindow.minimize()}
        >
          <Minus size={16} />
        </div>
        <div
          className="inline-flex justify-center items-center w-12 h-full hover:bg-inputBg cursor-pointer text-text transition-colors"
          onClick={() => appWindow.toggleMaximize()}
        >
          <Square size={14} />
        </div>
        <div
          className="inline-flex justify-center items-center w-12 h-full hover:bg-danger hover:text-white cursor-pointer rounded-tr-xl transition-colors"
          onClick={() => appWindow.close()}
        >
          <X size={16} />
        </div>
      </div>
    </div>
  );
}
