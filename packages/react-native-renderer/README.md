[![](./public/lib-logo.png)](https://github.com/zhiyuang/react-native-statistic-charts)
=

[![npm version](https://img.shields.io/npm/v/react-native-statistic-charts.svg?style=flat)](https://www.npmjs.com/package/react-native-statistic-charts)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/zhiyuang/react-native-statistic-charts/pulls)
[![license](https://img.shields.io/github/license/zhiyuang/react-native-statistic-charts.svg?style=flat)](https://github.com/zhiyuang/react-native-statistic-charts/blob/main/LICENSE)

Yet another [React Native](https://reactnative.dev/) chart library, but provide more choices of chart types and easy usage. Using [react-native-svg](https://github.com/software-mansion/react-native-svg) as the final renderer.

## Features

* 🚀 Follow the idea from "The Grammar of Graphics".
* 🎨 Support rich chart types.
* ✨ Support basic animation, tooltip and guidelines.
* 📖 Well defined APIs.

<table>
  <tr style="text-align:center;">
    <th>Geometry</th>
    <td>Point</td>
    <td colSpan="2">Line</td>
    <td>Area</td>
    <td colSpan="5">Interval</td>
  </tr>
  <tr style="text-align:center;">
    <th>Chart Type</th>
    <td>Scatter Chart</td>
    <td>Line Chart</td>
    <td>Radar Chart</td>
    <td>Area Chart</td>
    <td>Bar Chart</td>
    <td>Interval Chart</td>
    <td>Pie Chart</td>
    <td>Rose Chart</td>
    <td>Donut Chart</td>
  </tr>
  <tr style="text-align:center;">
    <th>Supported</th>
    <td>✅</td>
    <td>✅</td>
    <td>✅</td>
    <td>✅</td>
    <td>✅</td>
    <td>✅</td>
    <td>✅</td>
    <td>✅</td>
    <td>✅</td>
  </tr>
</table>

<table>
  <tr style="text-align:center;">
    <th>Chart Components</th>
    <td>Legend</td>
    <td>Tooltip</td>
    <td>GuidePoint</td>
    <td>GuideLine</td>
    <td>Text Annotation</td>
    <td>Image Annotation</td>
    <td>Range Selection</td>
    <td>Slider</td>
  </tr>
  <tr style="text-align:center;">
  </tr>
  <tr style="text-align:center;">
    <th>Supported</th>
    <td>❌</td>
    <td>✅</td>
    <td>✅</td>
    <td>✅</td>
    <td>❌</td>
    <td>❌</td>
    <td>❌</td>
    <td>❌</td>
  </tr>
</table>

## Installation

First install [react-native-svg](https://github.com/software-mansion/react-native-svg) based on [installation guide](https://github.com/software-mansion/react-native-svg#installation).

```sh
yarn add react-native-statistic-charts
```


### Example
```tsx
import React from 'react'
// import chart componennt
import { Chart, Line, Axis, Tooltip } from 'react-native-statistic-charts'

// init chart data
const data = [
  {
    date: '2017-06-05',
    value: 116,
  },
  {
    date: '2017-06-06',
    value: 129,
  },
  {
    date: '2017-06-07',
    value: 135,
  },
]

export default () => (
  // render
  <Chart data={data} style={{ width: 500, height: 250, padding: [10, 20, 0, 20] }}>
    <Axis field="date" lineStyle={{ strokeColor: '#aaa' }} tickLineStyle={{ strokeColor: '#ccc' }} />
    <Axis field="value" lineStyle={{ strokeWidth: 0 }} tickLineStyle={{ strokeWidth: 0 }} grid />
    <Line position="date*value" size={2} />
    <Tooltip
      crosshair
      crosshairsType="x"
      crosshairStyle={{ strokeColor: 'orange', strokeWidth: 2, strokeStyle: 'solid' }}
      sticky
    />
  </Chart>
)
```

## License

MIT
