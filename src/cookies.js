export const getCookie = name => {
  try {
    let cname = name + "="
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')
    for (let i = 0; i <ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(cname) === 0) {
        return c.substring(cname.length, c.length)
      }
    }
    return undefined
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export const setCookie = (name, value, exdays = 30) => {
  try {
    var d = new Date()
    d.setTime(d.getTime() + (exdays*24*60*60*1000))
    var expires = "expires="+ d.toUTCString()
    document.cookie = name + "=" + value + ";" + expires + ";path=/"
  } catch (err) {
    console.log(err)
    return undefined
  }
}