import React, { useState, useEffect } from 'react';
import { Clock, Download, Trash2, Eye, FileText, RefreshCw } from 'lucide-react';
import { cn, formatFileSize } from '../lib/utils';
import { ProcessingJob } from '../types/pdf';

interface HistoryItem {
  id: string;
  jobId: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  createdAt: Date;
  status: 'completed' | 'failed' | 'processing';
  downloadUrl?: string;
  layoutType: string;
  sortBy: string;
}

export const HistoryPage: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 模拟历史记录数据
  useEffect(() => {
    const mockHistory: HistoryItem[] = [
      {
        id: '1',
        jobId: 'job_123456',
        fileName: 'merged_invoices_20241201.pdf',
        fileSize: 1024000,
        pageCount: 15,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
        status: 'completed',
        downloadUrl: '#',
        layoutType: '2x2',
        sortBy: 'date'
      },
      {
        id: '2',
        jobId: 'job_789012',
        fileName: 'train_tickets_batch.pdf',
        fileSize: 512000,
        pageCount: 8,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
        status: 'completed',
        downloadUrl: '#',
        layoutType: '3x3',
        sortBy: 'uploadTime'
      },
      {
        id: '3',
        jobId: 'job_345678',
        fileName: 'receipts_2024_q4.pdf',
        fileSize: 2048000,
        pageCount: 25,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1天前
        status: 'failed',
        layoutType: '2x1',
        sortBy: 'amount'
      }
    ];

    setTimeout(() => {
      setHistoryItems(mockHistory);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}分钟前`;
    } else if (hours < 24) {
      return `${hours}小时前`;
    } else {
      return `${days}天前`;
    }
  };

  const handleDownload = (item: HistoryItem) => {
    if (item.downloadUrl) {
      // 模拟下载
      const link = document.createElement('a');
      link.href = item.downloadUrl;
      link.download = item.fileName;
      link.click();
    }
  };

  const handleDelete = (itemId: string) => {
    if (confirm('确定要删除这个处理记录吗？')) {
      setHistoryItems(items => items.filter(item => item.id !== itemId));
    }
  };

  const handleReprocess = (item: HistoryItem) => {
    // 重新处理逻辑
    alert(`重新处理文件: ${item.fileName}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'failed':
        return '处理失败';
      case 'processing':
        return '处理中';
      default:
        return '未知';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载历史记录...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            处理历史
          </h1>
          <p className="text-lg text-gray-600">
            查看和管理您的PDF处理记录
          </p>
        </div>

        {historyItems.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无处理记录</h3>
            <p className="text-gray-600 mb-4">您还没有处理过任何PDF文件</p>
            <button
              onClick={() => window.location.href = '/upload'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              开始处理文件
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {historyItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <FileText className="h-10 w-10 text-red-500" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.fileName}
                        </h3>
                        <span className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          getStatusColor(item.status)
                        )}>
                          {getStatusText(item.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                        <div>
                          <span className="font-medium">{formatFileSize(item.fileSize)}</span>
                        </div>
                        <div>
                          <span className="font-medium">{item.pageCount} 页</span>
                        </div>
                        <div>
                          <span className="font-medium">{item.layoutType} 布局</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500">
                        排序方式: {item.sortBy}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {item.status === 'completed' && (
                      <>
                        <button
                          onClick={() => {
                            // 预览功能
                            alert(`预览文件: ${item.fileName}`);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="预览"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDownload(item)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="下载"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    
                    {item.status === 'failed' && (
                      <button
                        onClick={() => handleReprocess(item)}
                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        title="重新处理"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 底部操作 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = '/upload'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            处理新文件
          </button>
        </div>
      </div>
    </div>
  );
};