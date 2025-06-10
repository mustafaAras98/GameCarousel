import {create} from 'zustand';
import {persist, createJSONStorage, devtools} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScoreState {
  bestScores: Record<string, number>;
  setBestScore: (gameId: string, score: number) => void;
  getBestScore: (gameId: string) => number;
  resetAllScores: () => void;
}

const scoreStore = create<ScoreState>()(
  devtools(
    persist(
      (set, get) => ({
        bestScores: {},
        setBestScore: (gameId, score) => {
          const currentBestScore = get().bestScores[gameId] || 0;
          if (score > currentBestScore) {
            set((state) => ({
              bestScores: {
                ...state.bestScores,
                [gameId]: score,
              },
            }));
          }
        },
        getBestScore: (gameId) => {
          return get().bestScores[gameId] || 0;
        },
        resetAllScores: () => {
          set({bestScores: {}});
        },
      }),
      {
        name: 'scoreStore',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);

export default scoreStore;
