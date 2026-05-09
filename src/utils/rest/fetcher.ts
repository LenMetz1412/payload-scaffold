/**
 * Fetches data from the CMS (REST api) on the server-side.
 *
 * @template T - The expected return type of the data.
 * @param {string} apiPath - The API path to fetch data from.
 * @returns {Promise<T | null>} - Returns the fetched data cast to type `T`, or null if an error occurs.
 * @throws Will throw an error if the request fails.
 *
 * @example
 * const data = await cmsDataFetcher<MyType>('/endpoints/some-endpoint');
 */

export const cmsDataFetcher = async <T>(apiPath: string): Promise<T | null> => {
  try {
    const res = await fetch(apiPath)

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data: unknown = await res.json()
    return data as T
  } catch (error) {
    console.error('Error fetching data from CMS:', error)
    throw error
  }
}

/**
 * Fetches data from the CMS on the client-side using SWR.
 *
 * @template T - The expected return type of the data.
 * @param {string} apiPath - The API path to fetch data from.
 * @returns {Promise<T>} - Returns the fetched data cast to type `T`.
 *
 * @example
 * const { data, error } = useSWR<MyType, string>('/endpoints/some-endpoint', swrCmsDataFetcher);
 */

export const swrCmsDataFetcher = async <T>(apiPath: string): Promise<T> => {
  const res = await fetch(apiPath)
  return res.json() as Promise<T>
}
