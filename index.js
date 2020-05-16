const http = require('http')
const fs = require('fs')
const path = require('path')
const st = require('st')
const Router = require('http-hash-router')

const port = 8000
const MESSAGES_PATH = './messages.txt'

const mount = st({ path: path.join(__dirname, '/static'), url: '/static' })
const router = Router()

const chat = './chat-text.json'
// going to /static/<file-name> will serve the file <file-name>
router.set('/static/*', mount)

// requests to /messages are either a GET or a POST
router.set('/messages', function (req, res) {
  if (req.method === 'GET') {
    getMessages(req, res)
  } else if (req.method === 'POST') {
    postMessage(req, res)
  } else {
    res.statusCode = 400
    res.end('unsupported operation')
  }
})

// this is the POST handler for /messages
// this function should write a new message to the file
function postMessage (req, res) {
  let data = ''
  req.on('data', function (chunk) {
    data += chunk
  })

  req.on('end', function () {
    // at this point, data should be the entire json payload of the request
    // console.log(data)
    const text = data + '\n'
    fs.appendFile(chat, text, function (err) {
      if (err) {
        console.log(err)
      }
      console.log('saved item')
    })
    // After writing to the file, we need to send up a response
    res.statusCode = 200
    res.end('Message posted successfully')
  })
}

// this is the GET handler for /messages
// this function should respond with the list of messages
function getMessages (req, res) {
  // http.get(chat, function(res) {

  // })
  fs.readFile(chat, 'utf8', function (err, data) {
    if (err) {
      console.error(err)
    }
    // do something to data json.parse
    const splitData = data.split('\n')
    console.log(splitData)
    const arr = splitData.filter(function (item) {
      return item.length > 0
    }).map(JSON.parse)


    // arr.push(JSON.parse(splitData))
    console.log(arr, 'this is arr')
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(arr))
  })

  // here is an example of how your messages might be formatted
  // const exampleMessages = [
  //   { text: 'hello! This is an example message.', date: new Date() },
  //   { text: 'This is another message.', date: new Date() }
  // ]

  // here we set the response code to 200 (success), and the content type to json
  // then we send up the response by stringifying the messages array
}

const server = http.createServer((req, res) => {
  router(req, res, {}, function onError (err) {
    if (err) {
      res.statusCode = err.statusCode || 500
      res.end(err.message)
    }
  })
})

server.listen(port)

console.log('Server listening on port:', port)
