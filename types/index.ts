export interface ScannedItem {
  id: string;
  content: string;
  originalContent: string;
  timestamp: number;
  date: string;
  type: string;
  lastModified?: number; // Track when the item was last edited
  // Additional fields for QR code editing - these are permanently stored
  additionalInfo?: {
    animalId?: string;
    breed?: string;
    birthDate?: string;
    weight?: string;
    notes?: string;
    ownerName?: string;
    location?: string;
  };
}

export interface ScanStore {
  items: ScannedItem[];
  addItem: (content: string, type: string) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  updateItem: (id: string, additionalInfo: ScannedItem['additionalInfo']) => void;
}