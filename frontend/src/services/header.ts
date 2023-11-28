
const getHeaders = (contentType?: string) => {
  const headers: any = {}
  const token = localStorage.getItem(`token`)
  if (token)
    headers[`Authorization`] = `Bearer ${token}`
  if (contentType)
    headers[`Content-Type`] = contentType
  return headers
}

export const getHeadersWs = () => getHeaders()
export const getHeadersGql = () => getHeaders(`application/json`)