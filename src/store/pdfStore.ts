import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PDFFile, LayoutConfig, SortConfig, ProcessingJob } from '../types/pdf';

interface PDFStore {
  // 文件管理
  files: PDFFile[];
  selectedFiles: string[];
  
  // 配置状态
  layoutConfig: LayoutConfig;
  sortConfig: SortConfig;
  
  // 处理任务
  currentJob: ProcessingJob | null;
  
  // 动作
  addFiles: (files: PDFFile[]) => void;
  removeFile: (fileId: string) => void;
  selectFile: (fileId: string) => void;
  deselectFile: (fileId: string) => void;
  clearSelection: () => void;
  updateLayoutConfig: (config: Partial<LayoutConfig>) => void;
  updateSortConfig: (config: SortConfig) => void;
  setCurrentJob: (job: ProcessingJob | null) => void;
  updateJobProgress: (jobId: string, progress: number, status?: ProcessingJob['status']) => void;
}

const defaultLayoutConfig: LayoutConfig = {
  layoutType: '2x2',
  pageOrientation: 'portrait',
  margin: 10,
  scale: 0.9,
  dividerStyle: {
    type: 'cross',
    color: '#000000',
    thickness: 1
  }
};

const defaultSortConfig: SortConfig = {
  sortBy: 'uploadTime',
  sortOrder: 'desc'
};

export const usePDFStore = create<PDFStore>()(
  persist(
    (set, get) => ({
  files: [],
  selectedFiles: [],
  layoutConfig: defaultLayoutConfig,
  sortConfig: defaultSortConfig,
  currentJob: null,

  addFiles: (newFiles) => {
    set((state) => ({
      files: [...state.files, ...newFiles]
    }));
  },

  removeFile: (fileId) => {
    set((state) => ({
      files: state.files.filter(f => f.id !== fileId),
      selectedFiles: state.selectedFiles.filter(id => id !== fileId)
    }));
  },

  selectFile: (fileId) => {
    set((state) => ({
      selectedFiles: [...state.selectedFiles, fileId]
    }));
  },

  deselectFile: (fileId) => {
    set((state) => ({
      selectedFiles: state.selectedFiles.filter(id => id !== fileId)
    }));
  },

  clearSelection: () => {
    set({ selectedFiles: [] });
  },

  updateLayoutConfig: (config) => {
    set((state) => ({
      layoutConfig: { ...state.layoutConfig, ...config }
    }));
  },

  updateSortConfig: (config) => {
    set({ sortConfig: config });
  },

  setCurrentJob: (job) => {
    set({ currentJob: job });
  },

  updateJobProgress: (jobId, progress, status) => {
    set((state) => {
      if (state.currentJob?.id === jobId) {
        return {
          currentJob: {
            ...state.currentJob,
            progress,
            status: status || state.currentJob.status
          }
        };
      }
      return state;
    });
  }
}),
{
  name: 'pdf-store', // 存储的名称
  partialize: (state) => ({ 
    // 只持久化文件和配置，不持久化当前任务状态
    files: state.files,
    selectedFiles: state.selectedFiles,
    layoutConfig: state.layoutConfig,
    sortConfig: state.sortConfig
  })
}));