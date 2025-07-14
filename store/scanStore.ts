import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScannedItem, ScanStore } from '@/types';

export const useScanStore = create<ScanStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (content: string, type: string) => {
        // Create a new item with the raw content - no formatting or modification
        const newItem: ScannedItem = {
          id: Date.now().toString(),
          content: content, // Keep original content without any formatting
          originalContent: content, // Store the original unformatted content
          timestamp: Date.now(),
          date: new Date().toLocaleString(),
          type,
          additionalInfo: undefined,
        };
        
        console.log("Adding scanned item to store:", newItem);
        
        set((state) => {
          // Sort items by timestamp (newest first)
          const updatedItems = [newItem, ...state.items];
          return {
            items: updatedItems,
          };
        });
      },
      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        }));
      },
      clearItems: () => {
        set({ items: [] });
      },
      updateItem: (id: string, additionalInfo: ScannedItem['additionalInfo']) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, additionalInfo } : item
          )
        }));
      },
    }),
    {
      name: 'barcode-scan-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);