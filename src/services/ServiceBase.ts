import config from '../config.json'

class ServiceBase {
  protected baseUrl = config.baseUrl

  protected getJSON = <T>(res): T => {
    if (res.status < 200 || res.status >= 300) {
      console.log(res.status, res.statusText)
      throw Error(res.status + ' (' + res.statusText + ') ')
    }
    if (res.status === 204)
      return null
    console.log(res, res.status)
    return res.json()//.catch(() => [])
  }

  protected sendPost = (url: string, data?: any) => fetch(url, {
    method: 'POST',
    ...requestBase,
    body: data === undefined ? undefined : JSON.stringify(data),
  })

  protected sendGet = (url: string, data?) => fetch(url, {
    method: 'GET',
    ...requestBase,
    body: data === undefined ? undefined : JSON.stringify(data),
  })

  protected sendDelete = (url: string, data: any = {}) => fetch(url, {
    method: 'DELETE',
    ...requestBase,
    body: JSON.stringify(data),
  })
}

const headers: RequestInit['headers'] = {
  'Content-Type': 'application/json'
}

const requestBase: RequestInit = {
  headers,
  mode: 'cors',
  credentials: 'include',
}

export default ServiceBase


