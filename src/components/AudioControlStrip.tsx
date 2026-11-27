import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { LanguageMode } from '../types/physics';
import {
  AUDIO_CAPABLE_SIMS,
  setAudioVolume,
  toggleAudio,
  usePhysicsAudio,
} from '../utils/physicsAudio';
import { getBilingualPrimary, UI_TEXT } from '../utils/bilingual';

interface AudioControlStripProps {
  language: LanguageMode;
  simId?: string;
  compact?: boolean;
}

export const AudioControlStrip: React.FC<AudioControlStripProps> = ({
  language,
  simId,
  compact = false,
}) => {
  const { enabled, volume } = usePhysicsAudio();
  const profile = simId ? AUDIO_CAPABLE_SIMS[simId] : undefined;

  return (
    <div className="inline-flex items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={toggleAudio}
        aria-pressed={enabled}
        title={
          enabled
            ? language === 'hi'
              ? 'ध्वनि बंद करें'
              : 'Mute classroom audio'
            : language === 'hi'
              ? 'ध्वनि चालू करें'
              : 'Enable physics & exam audio'
        }
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          enabled
            ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
            : 'border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
        }`}
      >
        {enabled ? (
          <Volume2 className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 shrink-0" />
        )}
        <span>
          {enabled
            ? getBilingualPrimary(UI_TEXT.soundOn, language)
            : getBilingualPrimary(UI_TEXT.soundOff, language)}
        </span>
      </button>

      {enabled && (
        <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white whitespace-nowrap shrink-0">
          <span className="text-[11px] font-mono font-bold tabular-nums">
            {Math.round(volume * 100)}%
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={Math.round(volume * 100)}
            onChange={(e) => setAudioVolume(Number(e.target.value) / 100)}
            aria-label={language === 'hi' ? 'ध्वनि स्तर' : 'Audio volume'}
            className="w-16 sm:w-20 accent-black dark:accent-white cursor-pointer"
          />
        </label>
      )}

      {!compact && profile && (
        <span className="hidden xl:inline text-xs font-medium text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
          · {getBilingualPrimary(profile.label, language)}
        </span>
      )}
    </div>
  );
};
