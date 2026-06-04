import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
}

export function AppHeader({ title, showBack = true }: AppHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b border-divider bg-surface px-3">
      {showBack && (
        <button
          type="button"
          aria-label="Back"
          onClick={() => navigate(-1)}
          className="grid h-9 w-9 place-items-center rounded-full text-text-primary hover:bg-surface-muted"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <h1 className="text-base font-semibold text-emphasis">{title}</h1>
    </header>
  );
}
