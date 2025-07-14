import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScannedItem, ScanStore, PermanentBarcodeData } from '@/types';

export const useScanStore = create<ScanStore>()(
  persist(
    (set, get) => ({
      items: [],
      permanentBarcodeData: {},
      addItem: (content: string, type: string) => {
        // Check if we have permanent data for this barcode content
        const permanentData = get().permanentBarcodeData[content];
        
        // Create a new item with the raw content - no formatting or modification
        const newItem: ScannedItem = {
          id: Date.now().toString(),
          content: content, // Keep original content without any formatting
          originalContent: content, // Store the original unformatted content
          timestamp: Date.now(),
          date: new Date().toLocaleString(),
          type,
          additionalInfo: permanentData || undefined,
        };
        
        console.log("Adding scanned item to store:", newItem);
        if (permanentData) {
          console.log("Found permanent data for barcode:", permanentData);
        }
        
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
        const state = get();
        const item = state.items.find(item => item.id === id);
        
        if (item) {
          // Store the additional info permanently linked to the barcode content
          const updatedPermanentData = {
            ...state.permanentBarcodeData,
            [item.content]: additionalInfo || undefined
          };
          
          // If additionalInfo is empty/undefined, remove it from permanent storage
          if (!additionalInfo || Object.keys(additionalInfo).length === 0) {
            delete updatedPermanentData[item.content];
          }
          
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? { 
                ...item, 
                additionalInfo,
                // Update the timestamp when item is edited to show it was modified
                lastModified: Date.now()
              } : item
            ),
            permanentBarcodeData: updatedPermanentData
          }));
          
          console.log("Item updated with additional info:", { id, additionalInfo });
          console.log("Permanent barcode data updated:", updatedPermanentData);
        }
      },
    }),
    {
      name: 'barcode-scan-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Ensure the data persists across app restarts
      partialize: (state) => ({
        items: state.items,
        permanentBarcodeData: state.permanentBarcodeData,
      }),
    }
  )
);