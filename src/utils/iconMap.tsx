import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Users,
  Compass,
  Award,
  Shield,
  Zap,
  Target,
  Star,
  Heart,
  Crown,
  Trophy,
  Music,
  Utensils,
  Layers,
  TrendingUp,
  Calendar,
  CreditCard,
  Gem,
  Rocket,
  Check,
  EyeOff,
  ChevronDown,
} from 'lucide-react';

export const AVAILABLE_ICON_NAMES = [
  'Sparkles',
  'Flame',
  'Users',
  'Compass',
  'Award',
  'Shield',
  'Zap',
  'Target',
  'Star',
  'Heart',
  'Crown',
  'Trophy',
  'Music',
  'Utensils',
  'Layers',
  'TrendingUp',
  'Calendar',
  'CreditCard',
  'Gem',
  'Rocket',
] as const;

export type IconName = (typeof AVAILABLE_ICON_NAMES)[number] | 'none' | string;

export function renderSlideIcon(name?: string, className = 'w-4 h-4'): React.ReactNode {
  if (!name || name === 'none') return null;

  switch (name) {
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Target':
      return <Target className={className} />;
    case 'Star':
      return <Star className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Crown':
      return <Crown className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    case 'Music':
      return <Music className={className} />;
    case 'Utensils':
      return <Utensils className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'Calendar':
      return <Calendar className={className} />;
    case 'CreditCard':
      return <CreditCard className={className} />;
    case 'Gem':
      return <Gem className={className} />;
    case 'Rocket':
      return <Rocket className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

interface IconPickerProps {
  currentIcon?: string;
  onSelectIcon: (iconName: string) => void;
  accentColor?: string;
  buttonLabel?: string;
  className?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  currentIcon,
  onSelectIcon,
  accentColor = '#f59e0b',
  buttonLabel,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const hasIcon = currentIcon && currentIcon !== 'none';

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title={hasIcon ? 'Clique para trocar ou remover este ícone' : 'Clique para adicionar um ícone'}
        className="no-print group/picker inline-flex items-center gap-1 p-1 rounded-md bg-black/50 hover:bg-black/80 border border-white/20 hover:border-amber-400/60 text-white transition-all cursor-pointer shadow-sm"
      >
        {hasIcon ? (
          <span style={{ color: accentColor }}>
            {renderSlideIcon(currentIcon, 'w-3.5 h-3.5')}
          </span>
        ) : (
          <span className="text-[10px] text-neutral-400 flex items-center gap-0.5">
            <EyeOff className="w-3 h-3 text-neutral-500" />
            <span className="hidden sm:inline">+ Ícone</span>
          </span>
        )}
        <ChevronDown className="w-2.5 h-2.5 text-neutral-400 group-hover/picker:text-white transition-colors" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="no-print absolute left-0 top-full mt-1 z-50 w-56 p-2 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-neutral-700 shadow-2xl text-white text-xs select-none"
        >
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-neutral-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
              {buttonLabel || 'Escolher Ícone'}
            </span>
            <button
              type="button"
              onClick={() => {
                onSelectIcon('none');
                setIsOpen(false);
              }}
              className="flex items-center gap-1 text-[10px] font-semibold text-rose-400 hover:text-rose-300 px-1.5 py-0.5 rounded hover:bg-rose-950/40 cursor-pointer"
            >
              <EyeOff className="w-2.5 h-2.5" />
              Remover Ícone
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1 max-h-40 overflow-y-auto p-0.5">
            {AVAILABLE_ICON_NAMES.map((name) => {
              const isSelected = currentIcon === name;
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => {
                    onSelectIcon(name);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-center p-2 rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                      : 'hover:bg-white/10 text-neutral-300 hover:text-white'
                  }`}
                >
                  {renderSlideIcon(name, 'w-4 h-4')}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
