import { BaseChartConfig, HorizontalBarGraphConfig, LabelsData, VerticalBarGraphConfig } from '../../types'
import { G, Rect, Svg } from 'react-native-svg'

import ChartBuilder from '@chartiful/react-native-chart-builder'
import React from 'react'
import { View } from 'react-native'

const HorizontalBarGraph = ({
  data,
  labels,
  height,
  width,
  barRadius = 0,
  barWidthPercentage = 0.7,
  barColor,
  style = {},
  baseConfig = {
    data: data.reverse(),
    height: width,
    width: height
  }
}: HorizontalBarGraphConfig) => {
  const translateProps = () => {
    let baseConfigCopy: BaseChartConfig = JSON.parse(JSON.stringify(baseConfig))

    baseConfigCopy.yAxisLabelStyle = baseConfigCopy.yAxisLabelStyle || {}
    baseConfigCopy.xAxisLabelStyle = baseConfigCopy.xAxisLabelStyle || {}

    if (baseConfig.yAxisLabelStyle) {
      baseConfigCopy.yAxisLabelStyle.rotation = (baseConfig.yAxisLabelStyle.rotation || 0) - 90
      baseConfigCopy.yAxisLabelStyle.position = baseConfig.yAxisLabelStyle.position ?
        (baseConfig.yAxisLabelStyle.position === 'top' ? 'left' : 'right') :
        'right'
      baseConfigCopy.yAxisLabelStyle.width = baseConfig.yAxisLabelStyle.height
      baseConfigCopy.yAxisLabelStyle.yOffset = baseConfig.yAxisLabelStyle.xOffset
      baseConfigCopy.yAxisLabelStyle.xOffset = baseConfig.yAxisLabelStyle.yOffset
    } else {
      baseConfigCopy.yAxisLabelStyle.rotation = -90
      baseConfigCopy.yAxisLabelStyle.position = 'right'
    }

    if (baseConfig.xAxisLabelStyle) {
      baseConfigCopy.xAxisLabelStyle.rotation = (baseConfig.xAxisLabelStyle.rotation || 0) - 90
      baseConfigCopy.xAxisLabelStyle.height = baseConfig.xAxisLabelStyle.width
      baseConfigCopy.xAxisLabelStyle.yOffset = baseConfig.xAxisLabelStyle.xOffset
      baseConfigCopy.xAxisLabelStyle.xOffset = baseConfig.xAxisLabelStyle.yOffset
    } else {
      baseConfigCopy.xAxisLabelStyle.rotation = -90
    }

    baseConfig.xAxisLabelStyle = baseConfigCopy.yAxisLabelStyle
    baseConfig.yAxisLabelStyle = baseConfigCopy.xAxisLabelStyle

    baseConfig.hasXAxisLabels = baseConfigCopy.hasYAxisLabels
    baseConfig.hasYAxisLabels = baseConfigCopy.hasXAxisLabels

    baseConfig.hasXAxisBackgroundLines = baseConfigCopy.hasYAxisBackgroundLines
    baseConfig.hasYAxisBackgroundLines = baseConfigCopy.hasXAxisBackgroundLines

    baseConfig.xAxisLabelCount = baseConfigCopy.yAxisLabelCount
    baseConfig.yAxisLabelCount = baseConfigCopy.xAxisLabelCount

    baseConfig.yAxisBackgroundLineStyle = baseConfigCopy.xAxisBackgroundLineStyle
    baseConfig.xAxisBackgroundLineStyle = baseConfigCopy.yAxisBackgroundLineStyle
  }

  translateProps()

  const chartBuilder = new ChartBuilder({
    data: data.reverse(),
    labels: labels ? labels.reverse() : undefined,
    height: width,
    width: height,
    ...baseConfig
  })

  const baseHeight: number = width - chartBuilder.yAxisLabelHeight
  const barWidth: number = chartBuilder.yLabelSlotWidth * barWidthPercentage
  const slotGap: number = chartBuilder.yLabelSlotWidth * (1 - barWidthPercentage)

  const renderBars = () => {
    return data.map((val: LabelsData, i: number) => {
      const barHeight: number = chartBuilder.calcDataPointHeight(val.value)

      return (
        <Rect
          key={Math.random()}
          x={(i * chartBuilder.yLabelSlotWidth) + (slotGap / 2) + chartBuilder.leftAlignedXAxisLabelWidth}
          y={baseHeight - barHeight}
          rx={barRadius}
          width={barWidth}
          height={barHeight < 0 ? 0 : barHeight}
          fill={val?.barColor ?? barColor}
        />
      )
    })
  }

  return (
    <View style={[
      {
        marginTop: -(width - height) / 2,
        marginLeft: (width - height) / 2,
        width: height,
      },
      {
        transform: [
          { rotate: "90deg" }
        ],
      },
      style
    ]}>
      <Svg height={width} width={height}>
        <G>
          {baseConfig.hasXAxisBackgroundLines !== false ? chartBuilder.renderXAxisLines() : null}
        </G>
        <G>
          {baseConfig.hasXAxisLabels !== false ? chartBuilder.renderXAxisLabels() : null}
        </G>
        <G>
          {baseConfig.hasYAxisLabels !== false ? chartBuilder.renderYAxisLabels() : null}
        </G>
        <G>
          {renderBars()}
        </G>
      </Svg>
    </View>
  )
}

export default HorizontalBarGraph
