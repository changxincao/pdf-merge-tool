import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Download, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { PDFFile } from '../types/pdf';
import { PDFService } from '../lib/pdfService';

interface PDFPreviewProps {
  file: PDFFile;
  onClose: () => void;
  className?: string;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ file, onClose, className }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [pageImage, setPageImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadPDFInfo();
  }, [file]);

  useEffect(() => {
    loadPageImage();
  }, [currentPage, scale, rotation]);

  const loadPDFInfo = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // 转换data URL为File对象或直接使用
      const response = await fetch(file.url);
      const blob = await response.blob();
      const pdfFile = new File([blob], file.name, { type: file.type });
      
      const pdfInfo = await PDFService.getDocumentInfo(pdfFile);
      setTotalPages(pdfInfo.numPages);
      
      // 更新文件信息到store
      // TODO: 更新store中的pageCount
    } catch (error) {
      console.error('加载PDF信息失败:', error);
      setError('无法加载PDF文件');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPageImage = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(file.url);
      const blob = await response.blob();
      
      const imageUrl = await PDFService.getPageThumbnail(
        URL.createObjectURL(blob),
        currentPage,
        scale
      );
      
      setPageImage(imageUrl);
    } catch (error) {
      console.error('加载页面图像失败:', error);
      setError('无法加载页面预览');
    } finally {
      setIsLoading(false);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={cn('fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50', className)}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* 头部工具栏 */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {file.name}
            </h3>
            <span className="text-sm text-gray-500">
              {currentPage} / {totalPages}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            
            <span className="text-sm text-gray-600 min-w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              disabled={scale >= 3.0}
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleRotate}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            >
              <RotateCw className="h-4 w-4" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* 页面控制 */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            
            <span className="text-sm text-gray-600">
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
        
        {/* 预览内容 */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">正在加载页面...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-96 text-red-500">
              <p>{error}</p>
            </div>
          ) : pageImage ? (
            <div className="flex items-center justify-center min-h-full">
              <img
                src={pageImage}
                alt={`第${currentPage}页`}
                className="max-w-full h-auto shadow-lg"
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transformOrigin: 'center'
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};