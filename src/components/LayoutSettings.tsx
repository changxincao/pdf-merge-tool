import React from 'react';
import { Layout, LayoutGrid, LayoutList, LayoutTemplate, Minus, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { LayoutConfig } from '../types/pdf';

interface LayoutSettingsProps {
  config: LayoutConfig;
  onChange: (config: LayoutConfig) => void;
  className?: string;
}

const layoutOptions = [
  { type: '1x1' as const, name: '1×1', icon: Layout, description: '单页布局' },
  { type: '2x1' as const, name: '2×1', icon: LayoutTemplate, description: '横向两页' },
  { type: '1x2' as const, name: '1×2', icon: LayoutList, description: '纵向两页' },
  { type: '2x2' as const, name: '2×2', icon: LayoutGrid, description: '四宫格' },
  { type: '3x3' as const, name: '3×3', icon: LayoutGrid, description: '九宫格' }
];

const dividerTypes = [
  { type: 'none' as const, name: '无分割线', color: 'transparent' },
  { type: 'cross' as const, name: '十字形', color: '#000000' },
  { type: 'grid' as const, name: '网格线', color: '#000000' }
];

export const LayoutSettings: React.FC<LayoutSettingsProps> = ({ 
  config, 
  onChange, 
  className 
}) => {
  const handleLayoutChange = (layoutType: LayoutConfig['layoutType']) => {
    onChange({ ...config, layoutType });
  };

  const handleOrientationChange = (orientation: 'portrait' | 'landscape') => {
    onChange({ ...config, pageOrientation: orientation });
  };

  const handleMarginChange = (margin: number) => {
    onChange({ ...config, margin: Math.max(0, Math.min(50, margin)) });
  };

  const handleScaleChange = (scale: number) => {
    onChange({ ...config, scale: Math.max(0.1, Math.min(1.0, scale)) });
  };

  const handleDividerChange = (type: LayoutConfig['dividerStyle']['type']) => {
    onChange({
      ...config,
      dividerStyle: {
        ...config.dividerStyle,
        type
      }
    });
  };

  const handleDividerColorChange = (color: string) => {
    onChange({
      ...config,
      dividerStyle: {
        ...config.dividerStyle,
        color
      }
    });
  };

  const handleDividerThicknessChange = (thickness: number) => {
    onChange({
      ...config,
      dividerStyle: {
        ...config.dividerStyle,
        thickness: Math.max(0.5, Math.min(5, thickness))
      }
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* 布局选择 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">页面布局</h3>
        <div className="grid grid-cols-3 gap-4">
          {layoutOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = config.layoutType === option.type;
            
            return (
              <button
                key={option.type}
                onClick={() => handleLayoutChange(option.type)}
                className={cn(
                  'p-4 border-2 rounded-lg text-center transition-all',
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                )}
              >
                <Icon className="h-8 w-8 mx-auto mb-2" />
                <div className="text-sm font-medium">{option.name}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 页面设置 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">页面设置</h3>
        
        {/* 页面方向 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            页面方向
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => handleOrientationChange('portrait')}
              className={cn(
                'px-4 py-2 border rounded-lg text-sm',
                config.pageOrientation === 'portrait'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              )}
            >
              纵向
            </button>
            <button
              onClick={() => handleOrientationChange('landscape')}
              className={cn(
                'px-4 py-2 border rounded-lg text-sm',
                config.pageOrientation === 'landscape'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              )}
            >
              横向
            </button>
          </div>
        </div>

        {/* 页边距 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            页边距: {config.margin}px
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleMarginChange(config.margin - 5)}
              className="p-1 border rounded hover:bg-gray-50"
              disabled={config.margin <= 0}
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="range"
              min="0"
              max="50"
              value={config.margin}
              onChange={(e) => handleMarginChange(parseInt(e.target.value))}
              className="flex-1"
            />
            <button
              onClick={() => handleMarginChange(config.margin + 5)}
              className="p-1 border rounded hover:bg-gray-50"
              disabled={config.margin >= 50}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 缩放比例 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            缩放比例: {Math.round(config.scale * 100)}%
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleScaleChange(config.scale - 0.1)}
              className="p-1 border rounded hover:bg-gray-50"
              disabled={config.scale <= 0.1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={config.scale}
              onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
              className="flex-1"
            />
            <button
              onClick={() => handleScaleChange(config.scale + 0.1)}
              className="p-1 border rounded hover:bg-gray-50"
              disabled={config.scale >= 1.0}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 分割线设置 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">分割线样式</h3>
        
        {/* 分割线类型 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            分割线类型
          </label>
          <div className="grid grid-cols-3 gap-3">
            {dividerTypes.map((type) => (
              <button
                key={type.type}
                onClick={() => handleDividerChange(type.type)}
                className={cn(
                  'p-3 border rounded-lg text-sm text-center',
                  config.dividerStyle.type === type.type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                )}
              >
                <div
                  className="w-full h-1 mb-2 rounded"
                  style={{ backgroundColor: type.color }}
                />
                {type.name}
              </button>
            ))}
          </div>
        </div>

        {/* 分割线颜色 */}
        {config.dividerStyle.type !== 'none' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              颜色
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={config.dividerStyle.color}
                onChange={(e) => handleDividerColorChange(e.target.value)}
                className="h-10 w-20 border rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.dividerStyle.color}
                onChange={(e) => handleDividerColorChange(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
        )}

        {/* 分割线粗细 */}
        {config.dividerStyle.type !== 'none' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              粗细: {config.dividerStyle.thickness}px
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleDividerThicknessChange(config.dividerStyle.thickness - 0.5)}
                className="p-1 border rounded hover:bg-gray-50"
                disabled={config.dividerStyle.thickness <= 0.5}
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={config.dividerStyle.thickness}
                onChange={(e) => handleDividerThicknessChange(parseFloat(e.target.value))}
                className="flex-1"
              />
              <button
                onClick={() => handleDividerThicknessChange(config.dividerStyle.thickness + 0.5)}
                className="p-1 border rounded hover:bg-gray-50"
                disabled={config.dividerStyle.thickness >= 5}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};