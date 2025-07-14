
export const DelayedImport = (importFunc, delay = 3000) => {
  return new Promise(resolve => {
    setTimeout(() => {
      importFunc().then(resolve)
    }, delay)
  })
}
