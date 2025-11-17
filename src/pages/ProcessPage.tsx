import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Download, Eye, RotateCcw } from 'lucide-react';
import { usePDFStore } from '../store/pdfStore';
import { ProcessingProgress } from '../components/ProcessingProgress';
import { ProcessingJob } from '../types/pdf';
import { PDFExportService } from '../lib/pdfExportService';
import { PDFFile } from '../types/pdf';
import { createSafeBlobURL, revokeSafeBlobURL } from '../lib/utils';

export const ProcessPage: React.FC = () => {
  const { files, layoutConfig, sortConfig, currentJob, setCurrentJob, updateJobProgress } = usePDFStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // 组件挂载后设置状态
  useEffect(() => {
    setMounted(true);
    console.log('=== ProcessPage Component Mounted ===');
  }, []);
  
  // 添加详细的调试日志 - 只在挂载后显示
  useEffect(() => {
    if (mounted) {
      console.log('=== ProcessPage Debug Info ===');
      console.log('Files array:', files);
      console.log('Files length:', files.length);
      console.log('Files details:', files.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        url: f.url,
        hasUrl: !!f.url
      })));
    }
  }, [files, mounted]);
  
  // 清理Blob URL
  useEffect(() => {
    return () => {
      if (currentJob?.resultUrl) {
        revokeSafeBlobURL(currentJob.resultUrl);
        console.log('Cleaning up Blob URL:', currentJob.resultUrl);
      }
    };
  }, [currentJob?.resultUrl]);

  // 文件排序函数
  const sortFiles = (files: PDFFile[]): PDFFile[] => {
    return [...files].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortConfig.sortBy) {
        case 'date':
          aValue = a.metadata?.date || a.lastModified;
          bValue = b.metadata?.date || b.lastModified;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'uploadTime':
        default:
          aValue = a.lastModified;
          bValue = b.lastModified;
          break;
      }
      
      if (sortConfig.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // 读取文件为ArrayBuffer
  const readFilesAsArrayBuffer = async (files: PDFFile[]): Promise<ArrayBuffer[]> => {
    const buffers: ArrayBuffer[] = [];
    
    for (const file of files) {
      try {
        console.log(`Reading file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        console.log(`File URL: ${file.url}`);
        
        // 验证文件URL
        if (!file.url || !file.url.startsWith('data:') && !file.url.startsWith('blob:')) {
          console.error(`Invalid file URL for ${file.name}: ${file.url}`);
          throw new Error(`文件 ${file.name} URL无效: ${file.url}`);
        }
        
        // 检查文件大小限制（50MB）
        if (file.size > 50 * 1024 * 1024) {
          throw new Error(`文件 ${file.name} 超过50MB限制`);
        }
        
        const response = await fetch(file.url);
        if (!response.ok) {
          throw new Error(`HTTP错误: ${response.status}`);
        }
        
        const buffer = await response.arrayBuffer();
        buffers.push(buffer);
        console.log(`File ${file.name} read successfully, size: ${(buffer.byteLength / 1024 / 1024).toFixed(2)}MB`);
        
      } catch (error) {
        console.error(`读取文件失败: ${file.name}`, error);
        throw new Error(`无法读取文件 ${file.name}: ${error.message}`);
      }
    }
    
    console.log(`Read ${buffers.length} files in total`);
    return buffers;
  };

  // 真实处理过程
  const startProcessing = async () => {
    const job: ProcessingJob = {
      id: `job_${Date.now()}`,
      status: 'processing',
      progress: 0,
      currentStage: 'preparing',
      estimatedTime: 30,
      previewAvailable: false,
      createdAt: new Date()
    };

    setCurrentJob(job);
    setIsProcessing(true);

    try {
      // 验证输入
      if (!files || files.length === 0) {
        throw new Error('没有文件需要处理');
      }
      
      console.log(`Starting to process ${files.length} files`);
      
      // 阶段1: 准备阶段
      updateJobProgress(job.id, 10, 'processing');
      setCurrentJob({
        ...job,
        currentStage: 'preparing',
        progress: 10
      });
      
      // 排序文件
      const sortedFiles = sortFiles(files);
      console.log('Files sorted, new order:', sortedFiles.map(f => f.name));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 阶段2: 分析文件
      updateJobProgress(job.id, 25, 'processing');
      setCurrentJob({
        ...job,
        currentStage: 'analyzing',
        progress: 25
      });
      console.log('Analyzing PDF files...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 阶段3: 读取文件内容
      updateJobProgress(job.id, 40, 'processing');
      setCurrentJob({
        ...job,
        currentStage: 'reading_files',
        progress: 40
      });
      console.log('Reading file contents...');
      const pdfBuffers = await readFilesAsArrayBuffer(sortedFiles);
      console.log(`Successfully read ${pdfBuffers.length} files`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 阶段4: 应用布局
      updateJobProgress(job.id, 60, 'processing');
      setCurrentJob({
        ...job,
        currentStage: 'applying_layout',
        progress: 60
      });
      console.log('Applying layout settings...', layoutConfig);
      
      const exportOptions = {
        layoutConfig,
        fileName: `merged_${Date.now()}.pdf`,
        quality: 0.9
      };
      
      console.log('Starting PDF generation...');
      const pdfBytes = await PDFExportService.createMergedPDF(pdfBuffers, exportOptions);
      console.log(`PDF generated successfully, size: ${(pdfBytes.length / 1024 / 1024).toFixed(2)}MB`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 阶段5: 添加分割线
      updateJobProgress(job.id, 80, 'processing');
      setCurrentJob({
        ...job,
        currentStage: 'adding_dividers',
        progress: 80
      });
      console.log('Adding dividers...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 阶段6: 生成最终文件
      updateJobProgress(job.id, 95, 'processing');
      setCurrentJob({
        ...job,
        currentStage: 'generating',
        progress: 95
      });
      console.log('Generating final file...');
      
      // 创建Blob URL - 使用类型安全的转换函数
      const resultUrl = createSafeBlobURL(pdfBytes, 'application/pdf');
      console.log('Blob URL created successfully:', resultUrl);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 阶段7: 完成
      updateJobProgress(job.id, 100, 'completed');
      console.log('Processing completed!');
      
      const completedJob: ProcessingJob = {
        ...job,
        status: 'completed',
        progress: 100,
        currentStage: 'completed',
        resultUrl: resultUrl,
        completedAt: new Date()
      };
      
      setCurrentJob(completedJob);
      setIsProcessing(false);
      
    } catch (error) {
      console.error('Processing failed:', error);
      
      const failedJob: ProcessingJob = {
        ...job,
        status: 'failed',
        progress: 0,
        currentStage: 'failed',
        completedAt: new Date()
      };
      
      setCurrentJob(failedJob);
      setIsProcessing(false);
      
      // 显示错误信息
      alert(`处理失败: ${error.message}`);
    }
  };

  const handleRetry = () => {
    setCurrentJob(null);
    startProcessing();
  };

  // 文件验证函数
  const validateFiles = (files: PDFFile[]): boolean => {
    console.log('=== Validating files ===');
    
    if (!files || files.length === 0) {
      console.log('No files provided');
      return false;
    }
    
    const validFiles = files.filter(file => {
      const hasRequiredFields = file.id && file.name && file.url;
      const isValidSize = file.size > 0;
      const isValidType = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isValidUrl = file.url && (file.url.startsWith('data:') || file.url.startsWith('blob:'));
      
      console.log(`File ${file.name}:`, {
        hasId: !!file.id,
        hasName: !!file.name,
        hasUrl: !!file.url,
        isValidUrl: isValidUrl,
        urlType: file.url ? file.url.substring(0, 20) + '...' : 'none',
        size: file.size,
        type: file.type,
        isValid: hasRequiredFields && isValidSize && isValidType && isValidUrl
      });
      
      return hasRequiredFields && isValidSize && isValidType && isValidUrl;
    });
    
    console.log(`Valid files: ${validFiles.length}/${files.length}`);
    return validFiles.length > 0;
  };

  // 手动开始处理函数
  const handleStartProcessing = () => {
    console.log('=== Manual start processing ===');
    const isValid = validateFiles(files);
    console.log('Manual validation result:', isValid);
    
    if (isValid) {
      startProcessing();
    } else {
      alert('文件验证失败，请检查文件是否完整');
    }
  };

  // 如果没有当前任务，自动开始处理（可选，现在改为手动）
  useEffect(() => {
    console.log('=== Auto-start check (disabled for manual control) ===');
    console.log('Current job:', currentJob);
    console.log('Files count:', files.length);
    console.log('Is processing:', isProcessing);
    console.log('Auto-start is disabled, waiting for manual trigger');
    // 暂时禁用自动开始，改为手动控制
    // if (!currentJob && files.length > 0 && !isProcessing) {
    //   const isValid = validateFiles(files);
    //   console.log('Files validation result:', isValid);
    //   
    //   if (isValid) {
    //     console.log('Starting processing...');
    //     startProcessing();
    //   } else {
    //     console.log('Files validation failed, not starting processing');
    //   }
    // }
  }, [files.length, currentJob, isProcessing]);

  // 等待组件挂载完成，避免状态检测错误
  if (!mounted) {
    console.log('Component not mounted yet, showing loading...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">正在加载...</h2>
          <p className="text-gray-600">请稍候</p>
        </div>
      </div>
    );
  }

  // 更智能的文件检测 - 检查文件数组和内容
  const hasValidFiles = files && files.length > 0 && files.some(file => file.name && file.url);
  
  if (!hasValidFiles) {
    console.log('No valid files detected, showing empty state');
    console.log('Files state:', { length: files?.length || 0, files: files || 'null' });
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">没有文件需要处理</h2>
          <p className="text-gray-600 mb-4">请先上传PDF文件</p>
          <button
            onClick={() => window.location.href = '/upload'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回上传页面
          </button>
        </div>
      </div>
    );
  }
  
  console.log('Files detected, rendering processing interface');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            处理进度
          </h1>
          <p className="text-lg text-gray-600">
            正在处理您的PDF文件，请稍候...
          </p>
        </div>

        {/* 文件状态显示 */}
        {!currentJob && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">准备处理</h3>
            <p className="text-blue-700 mb-4">
              已检测到 {files.length} 个PDF文件，准备开始处理
            </p>
            <div className="bg-white rounded p-3 mb-4">
              <h4 className="font-medium text-gray-900 mb-2">文件列表：</h4>
              <div className="max-h-32 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={file.id} className="flex justify-between text-sm py-1">
                    <span className="truncate">{index + 1}. {file.name}</span>
                    <span className="text-gray-500 ml-2">
                      {file.size > 1024 * 1024 
                        ? `${(file.size / 1024 / 1024).toFixed(1)}MB`
                        : `${(file.size / 1024).toFixed(1)}KB`
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleStartProcessing}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              开始处理文件
            </button>
          </div>
        )}

        {/* 处理进度 */}
        {currentJob && (
          <div className="mb-8">
            <ProcessingProgress
              job={currentJob}
              onComplete={() => {
                console.log('处理完成');
              }}
              onError={(error) => {
                console.error('处理错误:', error);
              }}
            />
            
            {/* 当前阶段显示 */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {currentJob.currentStage === 'preparing' && '正在准备文件...'}
                {currentJob.currentStage === 'analyzing' && '正在分析PDF文件...'}
                {currentJob.currentStage === 'reading_files' && '正在读取文件内容...'}
                {currentJob.currentStage === 'applying_layout' && '正在应用布局设置...'}
                {currentJob.currentStage === 'adding_dividers' && '正在添加分割线...'}
                {currentJob.currentStage === 'generating' && '正在生成最终文件...'}
                {currentJob.currentStage === 'completed' && '处理完成！'}
                {currentJob.currentStage === 'failed' && '处理失败，请重试'}
              </p>
            </div>
          </div>
        )}

        {/* 配置摘要 */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            处理配置
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">布局设置</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>布局类型: {layoutConfig.layoutType}</li>
                <li>页面方向: {layoutConfig.pageOrientation === 'portrait' ? '纵向' : '横向'}</li>
                <li>页边距: {layoutConfig.margin}px</li>
                <li>缩放比例: {Math.round(layoutConfig.scale * 100)}%</li>
                <li>分割线: {layoutConfig.dividerStyle.type === 'none' ? '无' : layoutConfig.dividerStyle.type === 'cross' ? '十字形' : '网格线'}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">排序设置</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>排序字段: {sortConfig.sortBy}</li>
                <li>排序顺序: {sortConfig.sortOrder === 'asc' ? '升序' : '降序'}</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              待处理文件: <span className="font-medium">{files.length}</span> 个
            </p>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="flex justify-between">
          <button
            onClick={() => window.location.href = '/layout'}
            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isProcessing}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回设置
          </button>
          
          {currentJob?.status === 'failed' && (
            <button
              onClick={handleRetry}
              className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              重新处理
            </button>
          )}
          
          {currentJob?.status === 'completed' && (
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  if (currentJob?.resultUrl) {
                    try {
                      window.open(currentJob.resultUrl, '_blank');
                      console.log('Preview window opened');
                    } catch (error) {
                      console.error('Preview failed:', error);
                      alert('预览失败，请尝试下载文件后查看');
                    }
                  } else {
                    alert('文件还未生成完成，请稍候');
                  }
                }}
                className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!currentJob?.resultUrl}
              >
                <Eye className="h-4 w-4 mr-2" />
                预览结果
              </button>
              
              <button
                onClick={() => {
                  if (currentJob?.resultUrl) {
                    try {
                      const link = document.createElement('a');
                      link.href = currentJob.resultUrl;
                      link.download = `merged_${new Date().toISOString().slice(0, 10)}_${Date.now()}.pdf`;
                      link.style.display = 'none';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      console.log('File download triggered');
                    } catch (error) {
                      console.error('Download failed:', error);
                      alert('下载失败，请重试');
                    }
                  } else {
                    alert('文件还未生成完成，请稍候');
                  }
                }}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                disabled={!currentJob?.resultUrl}
              >
                <Download className="h-4 w-4 mr-2" />
                下载文件
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};