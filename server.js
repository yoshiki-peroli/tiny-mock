let MOCK_FOLDER_PATH = './json'

let fs = require('fs')
let http = require('http')
let url = require('url')

let random_generator = value => {
  if (value === '$str')
    return Math.random().toString(36).slice(-8)
  if (value === '$int')
    return Math.floor(Math.random() * 100)
  return value
}

let randomizer = object => {
  if (typeof object !== 'object')
    return random_generator(object)
  if (object instanceof Array)
    return object.map(randomizer)
  for (let property in object)
    object[property] = randomizer(object[property])
  return object
}

let formatter = object => JSON.stringify(object, null, 4)

let server = http.createServer()

server.on('request', (request, response) => {
  response.writeHead(200, {'content-Type':'application/json'})
  try {
    let path = MOCK_FOLDER_PATH + url.parse(request.url).path + '.json'
    let read = path => JSON.parse(fs.readFileSync(path).toString())
    response.write(formatter(randomizer(read(path))))
  } catch(error) {
    response.write(formatter({error}))
  }
  response.write('\n')
  response.end()
})

server.listen(3000, '127.0.0.1')
