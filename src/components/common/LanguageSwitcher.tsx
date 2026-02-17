import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, STORAGE_KEYS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/Tooltip';
import { useState, useRef, useEffect } from 'react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ||
    SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, code);
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (lang) {
      document.documentElement.dir = lang.dir;
      document.documentElement.lang = code;
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(!open)}
            className="gap-1.5 h-9 px-2.5"
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-medium uppercase">
              {currentLang.code}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Change language</p>
        </TooltipContent>
      </Tooltip>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[120px] rounded-md border bg-popover p-1 shadow-md">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                currentLang.code === lang.code
                  ? 'bg-accent text-accent-foreground'
                  : ''
              }`}
            >
              <span className="uppercase text-xs font-medium w-5">
                {lang.code}
              </span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
