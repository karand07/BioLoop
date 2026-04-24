import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

const languages = [
  { code: 'en', name: 'English', label: 'EN' },
  { code: 'hi', name: 'हिंदी', label: 'HI' },
  { code: 'mr', name: 'मराठी', label: 'MR' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  const toggleLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl transition-all border border-slate-100 group shadow-sm active:scale-95"
      >
        <Globe className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{currentLanguage.label}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-200">
            <p className="px-5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-2">
              Select Language
            </p>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={cn(
                  "w-full px-5 py-3 text-left text-sm font-bold transition-all flex items-center justify-between group",
                  i18n.language === lang.code 
                    ? "text-emerald-600 bg-emerald-50/50" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {lang.name}
                {i18n.language === lang.code && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
