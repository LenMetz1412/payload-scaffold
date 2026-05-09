import { draftMode } from 'next/headers'

export async function GET(): Promise<Response> {
  const draft = await draftMode()
  return new Promise((resolve) => {
    draft.disable()
    resolve(new Response('Draft mode is disabled'))
  })
}
