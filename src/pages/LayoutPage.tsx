import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Settings, SortAsc } from 'lucide-react';
import { LayoutSettings } from '../components/LayoutSettings';
import { LayoutPreview } from '../components/LayoutPreview';
import { SortSettings } from '../components/SortSettings';
import { usePDFStore } from '../store/pdfStore';

export const LayoutPage: React.FC = () => {
  const { layoutConfig, sortConfig, updateLayoutConfig, updateSortConfig } = usePDFStore();
  const [activeTab, setActiveTab] = useState<'layout' | 'sort'>('layout');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            排版设置
          </h1>
          <p className="text-lg text-gray-600">
            配置PDF合并后的页面布局和排序方式
          </p>
        </div>
        
        {/* 标签页切换 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg border p-1 inline-flex">
            <button
              onClick={() => setActiveTab('layout')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'layout'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              布局设置
            </button>
            <button
              onClick={() => setActiveTab('sort')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'sort'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SortAsc className="h-4 w-4 mr-2" />
              排序设置
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 设置面板 */}
          <div className="lg:col-span-2">
            {activeTab === 'layout' ? (
              <LayoutSettings
                config={layoutConfig}
                onChange={updateLayoutConfig}
              />
            ) : (
              <SortSettings
                config={sortConfig}
                onChange={updateSortConfig}
              />
            )}
          </div>

          {/* 预览面板 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                预览效果
              </h3>
              
              <div className="space-y-4">
                <LayoutPreview config={layoutConfig} />
                
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>布局类型:</span>
                    <span className="font-medium">{layoutConfig.layoutType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>页面方向:</span>
                    <span className="font-medium">
                      {layoutConfig.pageOrientation === 'portrait' ? '纵向' : '横向'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>页边距:</span>
                    <span className="font-medium">{layoutConfig.margin}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span>缩放比例:</span>
                    <span className="font-medium">{Math.round(layoutConfig.scale * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>分割线:</span>
                    <span className="font-medium">
                      {layoutConfig.dividerStyle.type === 'none' ? '无' : 
                       layoutConfig.dividerStyle.type === 'cross' ? '十字形' : '网格线'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="flex justify-between mt-12">
          <button 
            onClick={() => window.location.href = '/upload'}
            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回上传
          </button>
          
          <button 
            onClick={() => window.location.href = '/process'}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            开始处理
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};