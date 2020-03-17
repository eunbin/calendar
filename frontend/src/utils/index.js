export const cloneDeep = (obj) => {
  if (obj === null || typeof (obj) !== 'object') {
    return obj
  }

  const copy = {}
  for (const key in obj) {
    copy[key] = cloneDeep(obj[key])
  }
  return copy
}
