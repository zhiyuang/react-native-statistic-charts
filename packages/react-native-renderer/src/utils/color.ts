export const isGradientColor = (value?: string) => !!value?.includes('gradient')

export const color = (value?: string) => (isGradientColor(value) ? `url(#${value})` : value)
