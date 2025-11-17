import React from 'react'
import { cn } from '../lib/utils'
import { LayoutConfig } from '../types/pdf'

interface LayoutPreviewProps { config: LayoutConfig; className?: string }

export const LayoutPreview: React.FC<LayoutPreviewProps> = ({ config, className }) => {
  const isPortrait = config.pageOrientation === 'portrait'
  const pageW = isPortrait ? 595 : 842
  const pageH = isPortrait ? 842 : 595
  const innerW = Math.max(0, pageW - config.margin * 2)
  const innerH = Math.max(0, pageH - config.margin * 2)

  const layout = config.layoutType
  const cols = layout === '3x3' ? 3 : layout === '2x2' ? 2 : layout === '2x1' ? 2 : 1
  const rows = layout === '3x3' ? 3 : layout === '2x2' ? 2 : layout === '1x2' ? 2 : 1

  const cellW = innerW / cols
  const cellH = innerH / rows
  const a = cellW / cellH

  const srcW = 1000
  const srcH = 2000
  const r = srcW / srcH

  const dividerColor = config.dividerStyle.color
  const dividerThickness = config.dividerStyle.type === 'none' ? 0 : config.dividerStyle.thickness

  const marginPercent = (config.margin / pageW) * 100
  const aspectRatio = pageW / pageH

  const cells = Array.from({ length: cols * rows })

  return (
    <div className={cn('w-full', className)}>
      <div
        className="bg-white border rounded-lg mx-auto"
        style={{ aspectRatio, width: '100%' }}
      >
        <div
          className="h-full w-full"
          style={{ padding: `${marginPercent}%` }}
        >
          <div
            className="grid h-full w-full"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
          >
            {cells.map((_, idx) => {
              const widthLimited = a <= r
              const drawWPercent = widthLimited ? config.scale * 100 : r * config.scale * (1 / a) * 100
              const drawHPercent = widthLimited ? (1 / r) * config.scale * a * 100 : config.scale * 100
              const isLastCol = (idx % cols) === cols - 1
              const isLastRow = Math.floor(idx / cols) === rows - 1
              const borderRight = isLastCol ? 0 : dividerThickness
              const borderBottom = isLastRow ? 0 : dividerThickness
              return (
                <div
                  key={idx}
                  className="relative flex items-center justify-center bg-gray-50"
                  style={{
                    borderRight: `${borderRight}px solid ${dividerColor}`,
                    borderBottom: `${borderBottom}px solid ${dividerColor}`
                  }}
                >
                  <div
                    className="bg-gray-300"
                    style={{ width: `${drawWPercent}%`, height: `${drawHPercent}%` }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}