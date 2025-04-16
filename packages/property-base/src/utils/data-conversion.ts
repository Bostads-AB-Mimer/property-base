export const toBoolean = (value: number | null | undefined): boolean => {
  return Boolean(value)
}

export function trimStrings<T>(data: T): T {
  if (typeof data === 'string') {
    return data.trim() as T
  }

  if (Array.isArray(data)) {
    return data.map(trimStrings) as T
  }

  if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        return [key, trimStrings(value)]
      })
    ) as T
  }

  return data
}
