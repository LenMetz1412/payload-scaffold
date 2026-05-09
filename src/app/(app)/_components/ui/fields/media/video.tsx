// !! super basic extend it as you please

import type { UiMediaFieldProps } from '.'

export const UiMediaVideoField = ({ src }: UiMediaFieldProps & { src: string }) => {
  return <video src={src} />
}
