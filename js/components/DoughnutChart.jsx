// @flow

import React from 'react'
import { Doughnut } from 'react-chartjs-2'

const DoughnutChart = (props: {
  data: ChartjsData,
  displayTitle: boolean,
  displayLegend: boolean,
  legendPosition: string
}) => (
  <div>
    <Doughnut
      data={props.data}
      width={100}
      height={50}
      options={{
        title: {
          display: props.displayTitle,
          text: 'Device popularity'
        },
        legend: {
          display: props.displayLegend,
          position: props.legendPosition
        },
        maintainAspectRatio: true
      }}
    />
  </div>
)

export default DoughnutChart
