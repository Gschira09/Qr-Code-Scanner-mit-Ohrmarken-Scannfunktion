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
    ownerName?: string;
  };
}

export interface PermanentBarcodeData {
  [barcodeContent: string]: {
    animalId?: string;
    breed?: string;
    birthDate?: string;
    ownerName?: string;
  } | undefined;
}

export interface ScanStore {
  items: ScannedItem[];
  permanentBarcodeData: PermanentBarcodeData;
  addItem: (content: string, type: string) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  updateItem: (id: string, additionalInfo: ScannedItem['additionalInfo']) => void;
}