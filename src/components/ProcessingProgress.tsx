import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, Download, Eye, Clock, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { ProcessingJob } from '../types/pdf';

interface ProcessingProgressProps {
  job: ProcessingJob;
  onComplete?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

const stageNames = {
  'preparing': '准备处理',
  'analyzing': '分析文件',
  'applying_layout': '应用布局',
  'adding_dividers': '添加分割线',
  'sorting': '排序页面',
  'generating': '生成PDF',
  'finalizing': '完成处理'
};

export const ProcessingProgress: React.FC<ProcessingProgressProps> = ({
  job,
  onComplete,
  onError,
  className
}) => {
  const [estimatedTime, setEstimatedTime] = useState(job.estimatedTime || 30);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (job.status === 'processing') {
      const timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setEstimatedTime(prev => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [job.status]);

  useEffect(() => {
    if (job.status === 'completed' && onComplete) {
      onComplete();
    } else if (job.status === 'failed' && onError) {
      onError('处理失败，请重试');
    }
  }, [job.status, onComplete, onError]);

  const getStatusIcon = () => {
    switch (job.status) {
      case 'processing':
        return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'failed':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getProgressColor = () => {
    switch (job.status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('bg-white rounded-lg border p-6', className)}>
      {/* 状态标题 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {job.status === 'completed' ? '处理完成' :
               job.status === 'failed' ? '处理失败' :
               job.status === 'processing' ? '正在处理' : '等待处理'}
            </h3>
            <p className="text-sm text-gray-600">
              {job.status === 'processing' && job.currentStage
                ? stageNames[job.currentStage as keyof typeof stageNames] || job.currentStage
                : job.status === 'completed'
                ? 'PDF文件已生成完成'
                : job.status === 'failed'
                ? '处理过程中出现错误'
                : '准备开始处理文件'}
            </p>
          </div>
        </div>
        
        {job.status === 'processing' && (
          <div className="text-right">
            <p className="text-sm text-gray-600">预计剩余时间</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatTime(estimatedTime)}
            </p>
          </div>
        )}
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>处理进度</span>
          <span>{Math.round(job.progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={cn('h-3 rounded-full transition-all duration-300', getProgressColor())}
            style={{ width: `${job.progress}%` }}
          />
        </div>
      </div>

      {/* 处理详情 */}
      {job.status === 'processing' && (
        <div className="mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">已用时间</span>
            <span className="font-medium">{formatTime(elapsedTime)}</span>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex space-x-3">
        {job.status === 'completed' && job.resultUrl && (
          <>
            <button
              onClick={() => window.open(job.resultUrl, '_blank')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              预览结果
            </button>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = job.resultUrl!;
                link.download = `merged_${Date.now()}.pdf`;
                link.click();
              }}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              下载文件
            </button>
          </>
        )}
        
        {job.status === 'failed' && (
          <button
            onClick={() => {
              // TODO: 实现重试逻辑
              window.location.reload();
            }}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            重新处理
          </button>
        )}
      </div>

      {/* 状态指示器 */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>任务ID: {job.id.slice(0, 8)}</span>
          <span>
            {job.status === 'completed' && job.completedAt
              ? `完成时间: ${new Date(job.completedAt).toLocaleTimeString()}`
              : job.status === 'processing'
              ? '正在处理中...'
              : '等待开始'}
          </span>
        </div>
      </div>
    </div>
  );
};