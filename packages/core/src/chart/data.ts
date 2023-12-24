import Scale from '@/scale'
import { ChartData, FieldData, ScaleOptions } from '@/types'
import { uniqueFilter } from '@/utils/data'
import { isNil } from '@/utils/judgement'

export class DataSource {
  private data: ChartData
  private fields: Record<string, { data: FieldData[]; scale: Scale }>
  constructor(data: ChartData, scaleOptions?: Record<string, ScaleOptions>) {
    this.data = data
    this.fields = data
      .map(record => Object.keys(record))
      .reduce((res, val) => res.concat(val), []) // flatten
      .filter(uniqueFilter)
      .reduce((res, field) => {
        const fieldDatas = data.map(record => record[field]).filter(value => !isNil(value))
        const fieldScale = new Scale(fieldDatas, scaleOptions?.[field])

        return {
          ...res,
          [field]: {
            data: fieldDatas,
            scale: fieldScale,
          },
        }
      }, {})
  }

  getData() {
    return this.data
  }

  getField(field: string) {
    const { data, scale } = this.fields[field] ?? {}
    return {
      getData() {
        return data
      },
      getScale() {
        return scale
      },
    }
  }
}
