import qs from 'qs'

export enum ApiEndpoints {
  LOCALIZED_PATH = '/endpoints/localized-path',
}

/**
 * Constructs a query string URL for the specified API endpoint.
 *
 * @param endpoint - The API endpoint to be accessed.
 * @param params - An object representing query parameters to be serialized.
 * @returns A string representing the full URL with query parameters.
 */

export const getEndpoint = (endpoint: ApiEndpoints, params: unknown): string => {
  return [endpoint, qs.stringify(params)].filter((p) => !!p).join('?')
}
