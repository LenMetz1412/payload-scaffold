export const defaultCarouselMediaSizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'

export const getGridColumnsClass = (count: number) => {
  if (count <= 2) return 'sm:grid-cols-2 lg:grid-cols-2'
  if (count === 3) return 'sm:grid-cols-2 lg:grid-cols-3'
  if (count === 4) return 'sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4'
  if (count <= 6) return 'sm:grid-cols-2 lg:grid-cols-3'

  if (count % 4 === 0) return 'sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4'
  if (count % 3 === 0) return 'sm:grid-cols-2 lg:grid-cols-3'

  return count % 3 <= 1
    ? 'sm:grid-cols-2 lg:grid-cols-3'
    : 'sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
}

export const getGridMediaSizes = (count: number) => {
  const columnsClass = getGridColumnsClass(count)
  const hasThreeCols = columnsClass.includes('lg:grid-cols-3')
  const hasFourCols = columnsClass.includes('2xl:grid-cols-4')
  const lgSize = hasThreeCols ? '33vw' : '50vw'

  if (hasFourCols) {
    return `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1376px) ${lgSize}, 25vw`
  }

  return `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${lgSize}`
}
