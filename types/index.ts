export interface ScannedItem {
  id: string;
  content: string;
  originalContent: string; // Added to store the original unformatted content
  timestamp: number;
  date: string;
  type: string; // Added barcode type field
}

export interface ScanStore {
  items: ScannedItem[];
  addItem: (content: string, type: string) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
}