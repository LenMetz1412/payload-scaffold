export async function GET(): Promise<Response> {
  return new Promise((resolve) => {
    resolve(new Response('Draft mode is disabled'))
  })
}
