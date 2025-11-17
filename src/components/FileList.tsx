import React, { useState } from 'react';
import { FileText, Calendar, DollarSign, Hash, X, Eye } from 'lucide-react';
import { cn, formatFileSize } from '../lib/utils';
import { PDFFile } from '../types/pdf';
import { usePDFStore } from '../store/pdfStore';
import { PDFPreview } from './PDFPreview';

interface FileListProps {
  className?: string;
}

export const FileList: React.FC<FileListProps> = ({ className }) => {
  const { files, removeFile, selectFile, selectedFiles, deselectFile } = usePDFStore();
  const [previewFile, setPreviewFile] = useState<PDFFile | null>(null);

  const handleFileClick = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      deselectFile(fileId);
    } else {
      selectFile(fileId);
    }
  };

  if (files.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-500', className)}>
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>暂无上传的文件</p>
        <p className="text-sm">请先上传PDF文件</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">已上传文件</h3>
          <span className="text-sm text-gray-500">{files.length} 个文件</span>
        </div>
        
        {files.map((file) => {
          const isSelected = selectedFiles.includes(file.id);
          
          return (
            <div
              key={file.id}
              className={cn(
                'group relative bg-white border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer',
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              )}
              onClick={() => handleFileClick(file.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-red-500" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const file = files.find(f => f.id === file.id);
                          if (file) setPreviewFile(file);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-opacity"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      {formatFileSize(file.size)}
                    </span>
                    <span className="flex items-center">
                      <Hash className="h-3 w-3 mr-1" />
                      {file.pageCount} 页
                    </span>
                  </div>
                  
                  {file.metadata && (
                    <div className="mt-3 flex items-center space-x-4 text-xs text-gray-600">
                      {file.metadata.date && (
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {file.metadata.date}
                        </span>
                      )}
                      {file.metadata.amount && (
                        <span className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {file.metadata.amount}
                        </span>
                      )}
                      {file.metadata.number && (
                        <span className="flex items-center">
                          <Hash className="h-3 w-3 mr-1" />
                          {file.metadata.number}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
      
      {previewFile && (
        <PDFPreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </>
  );
}