export interface PDFFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  url: string;
  pageCount: number;
  formatType: 'invoice' | 'ticket' | 'receipt' | 'other';
  metadata?: {
    date?: string;
    amount?: string;
    number?: string;
  };
}

export interface OCRResult {
  date?: string;
  amount?: string;
  number?: string;
  confidence: number;
  rawText?: string;
}

export interface LayoutConfig {
  layoutType: '1x1' | '2x2' | '3x3' | '2x1' | '1x2';
  pageOrientation: 'portrait' | 'landscape';
  margin: number;
  scale: number;
  dividerStyle: {
    type: 'none' | 'cross' | 'grid';
    color: string;
    thickness: number;
  };
}

export interface SortConfig {
  sortBy: 'date' | 'name' | 'uploadTime';
  sortOrder: 'asc' | 'desc';
}

export interface ProcessingJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStage?: string;
  estimatedTime?: number;
  previewAvailable: boolean;
  resultUrl?: string;
  createdAt: Date;
  completedAt?: Date;
}