import type { IdentityOptions, LinearOptions, PointOptions, TimeOptions } from '@antv/scale'

// export type Scale = Base<BaseOptions>

export enum ScaleType {
  Identity,
  Linear,
  Time,
  Category,
  TimeCategory,
}

export type CategoryOptions = PointOptions & { tickCount?: number }

export type ScaleOptions =
  | ({
      type: ScaleType.Identity
    } & IdentityOptions)
  | ({
      type: ScaleType.Linear
    } & LinearOptions)
  | ({
      type: ScaleType.Time
    } & TimeOptions)
  | ({
      type: ScaleType.Category
    } & CategoryOptions)
  | ({
      type: ScaleType.TimeCategory
    } & CategoryOptions)
