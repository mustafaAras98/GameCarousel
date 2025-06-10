import {create} from 'zustand';
import {persist, createJSONStorage, devtools} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CoinState {
  coins: number;
  addCoins: (amount: number) => void;
  decreaseCoins: (amount: number) => void;
  resetCoins: () => void;
  setCoins: (amount: number) => void;
}

const coinStore = create<CoinState>()(
  devtools(
    persist(
      (set) => ({
        coins: 100,
        addCoins: (amount: number) =>
          set((state) => ({coins: state.coins + amount})),
        decreaseCoins: (amount: number) =>
          set((state) => ({coins: Math.max(0, state.coins - amount)})),
        resetCoins: () => set({coins: 0}),
        setCoins: (amount: number) => set({coins: amount}),
      }),
      {
        name: 'coinStore',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);
export default coinStore;
