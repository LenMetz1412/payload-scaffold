// !! super basic extend it as you please

import Image from 'next/image'

import type { UiMediaFieldProps } from '.'

export const UiMediaImageField = ({ src, media }: UiMediaFieldProps & { src: string }) => {
  return <Image src={src} fill alt={media.alt} />
}
