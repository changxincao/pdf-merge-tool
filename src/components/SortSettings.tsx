import React from 'react';
import { ArrowUpDown, Calendar, FileText, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { SortConfig } from '../types/pdf';

interface SortSettingsProps {
  config: SortConfig;
  onChange: (config: SortConfig) => void;
  className?: string;
}

const sortOptions = [
  { value: 'uploadTime', label: '上传时间', icon: Clock },
  { value: 'date', label: '文件日期', icon: Calendar },
  { value: 'name', label: '文件名', icon: FileText }
];

export const SortSettings: React.FC<SortSettingsProps> = ({ 
  config, 
  onChange, 
  className 
}) => {
  const handleSortByChange = (sortBy: SortConfig['sortBy']) => {
    onChange({ ...config, sortBy });
  };

  const handleSortOrderChange = (sortOrder: SortConfig['sortOrder']) => {
    onChange({ ...config, sortOrder });
  };

  return (
    <div className={cn('bg-white rounded-lg border p-6', className)}>
      <div className="flex items-center mb-4">
        <ArrowUpDown className="h-5 w-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">排序设置</h3>
      </div>
      
      <div className="space-y-4">
        {/* 排序字段 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            排序字段
          </label>
          <div className="grid grid-cols-2 gap-2">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = config.sortBy === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => handleSortByChange(option.value as SortConfig['sortBy'])}
                  className={cn(
                    'flex items-center p-3 border rounded-lg text-sm transition-all',
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 排序顺序 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            排序顺序
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => handleSortOrderChange('asc')}
              className={cn(
                'flex items-center px-4 py-2 border rounded-lg text-sm',
                config.sortOrder === 'asc'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              )}
            >
              <ArrowUpDown className="h-4 w-4 mr-2 rotate-180" />
              升序
            </button>
            <button
              onClick={() => handleSortOrderChange('desc')}
              className={cn(
                'flex items-center px-4 py-2 border rounded-lg text-sm',
                config.sortOrder === 'desc'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              )}
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              降序
            </button>
          </div>
        </div>

        {/* 当前排序预览 */}
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            当前排序：
            <span className="font-medium text-gray-900 ml-1">
              {sortOptions.find(opt => opt.value === config.sortBy)?.label}
            </span>
            <span className="text-gray-500 ml-1">
              ({config.sortOrder === 'asc' ? '升序' : '降序'})
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};