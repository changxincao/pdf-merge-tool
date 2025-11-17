import React from 'react';
import { Toaster } from 'sonner';
import { FileUpload } from '../components/FileUpload';
import { FileList } from '../components/FileList';
import { usePDFStore } from '../store/pdfStore';

export const UploadPage: React.FC = () => {
  const { files } = usePDFStore();
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PDF合并排版工具
          </h1>
          <p className="text-lg text-gray-600">
            智能识别、自动排版，让您的PDF处理更高效
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              上传PDF文件
            </h2>
            <FileUpload />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              文件列表
            </h2>
            <FileList />
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={files.length === 0}
            onClick={() => window.location.href = '/process'}
          >
            开始处理
          </button>
        </div>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
};