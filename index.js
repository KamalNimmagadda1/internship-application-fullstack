addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */

class ElementHandler {
  element(element){
    if (element.tagName === 'title') {
      element.prepend("Kamal's Own Title")
    }
    if (element.tagName === 'h1') {
      element.prepend('Design Model')
    }
    if (element.tagName === 'p') {
      element.prepend('Thanks for this Opportunity')
    }
    if (element.tagName === 'a') {
      element.setInnerContent("Check out my LinkedIn")
      element.setAttribute('href', 'https://www.linkedin.com/in/kamala-sai-theja-nimmagadda-7a193915a/')
    }
  }
}

async function handleRequest(request) {
  let responses
  let mylogs = []
  let resp
  await fetch('https://cfw-takehome.developers.workers.dev/api/variants')
    .then((response => mylogs = response.json()))
    .then((data => mylogs=data))
  let persistent = getCookie(request, 'myLogs')
  let logIndex = null
  if (persistent === null) {
    logIndex = Math.round(Math.random())
  }
  else {
    logIndex = persistent
  }
  console.log(logIndex)
  var lists = mylogs['variants']
  console.log(lists)
  resp = await fetch(lists[logIndex])
  const custom_url = new HTMLRewriter()
    .on('title', new ElementHandler())
    .on('h1#title', new ElementHandler())
    .on('p#description', new ElementHandler())
    .on('a#url', new ElementHandler())
  responses = new Response(resp.body, {headers:{'content-type':"text/html"}})
  responses.headers.set('Set-Cookie', `myLogs = ${logIndex}`)

  return custom_url.transform(responses)
}

function getCookie(request, name) {
  let result = null
  let cookieStr = request.headers.get('Cookie')
  if (cookieStr) {
    let cookies = cookieStr.split(';')
    cookies.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split('=')[1]
        result = cookieVal
      }
    })
  }
  return result
}