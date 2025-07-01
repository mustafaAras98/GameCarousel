import {useEffect} from 'react';
import {NativeModules} from 'react-native';

const {SoundModule} = NativeModules;

export const Sound = {
  DRAW: 'DRAW',
  FLIP: 'FLIP',
  WIN: 'WIN',
  LOSE: 'LOSE',
} as const;

type SoundKey = keyof typeof Sound;

const SOUND_FILES = {
  DRAW: 'draw',
  FLIP: 'flip_card',
  WIN: 'success_sound',
  LOSE: 'fail_sound',
};

export const useSoundManager = () => {
  useEffect(() => {
    Object.values(SOUND_FILES).forEach((key) =>
      SoundModule.loadSound(key, key)
    );
    return () => {
      Object.values(SOUND_FILES).forEach((key) => SoundModule.unloadSound(key));
    };
  }, []);

  const playSound = (soundName: SoundKey) => {
    SoundModule.playSound(SOUND_FILES[soundName]);
  };

  return {
    playSound,
  };
};
