const yo = require('yo-yo')
console.log('hello world!')
// this is called by getmessages and it has data "messages"
// this function updates the chatcomponent "array" and calls chatcompont to make a new "dom node" with that data
function render (messageList) {
  yo.update(el, chatComponent(messageList))
}

// var el = render(getMessages)
// this is the first thing that happens a dom node is made then it goes to the target.appendChild where it gets put on the page
// then we move to the get messages function that some time in the future gets messages and calls the render with those messages
var el = chatComponent([])
const target = document.getElementById('target')

function chatComponent (eachMessage) {
  console.log(eachMessage, 'this is the yo section1')
  return yo`<ul>
    ${eachMessage.map(function (item, index) {
      return yo`
      <li>
        <p>${item.date}</p>
        <span>${item.text}</span>
        </li>`
    })}
    </ul>`
}

target.appendChild(el)

const chatInput = document.getElementById('chatInput')
chatInput.onsubmit = function (evt) {
  evt.preventDefault()
  const text = chatInput.children[0].value
  postMessage(text)
}

function currentDate () {
  const date = new Date()
  
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + (date.getHours() < 12 ? date.getHours() + 'AM' : date.getHours() - 12 + 'PM')
}

function postMessage (text) {
  console.log('posting message')
  fetch('/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: text, date: currentDate() })
  })
    .then(data => {
      console.log('Success:', data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

function getMessages () {
  fetch('/messages')
    .then(response => response.json())
    .then(data => render(data))
    .then(data => console.log(data, 'this is data'))
    //this will get our data better insted of info global
    //render does not do somthing behind the sense it is a function that we need to make 
}

// postMessage('hello')

function initalPage () {
  setInterval(() => {
    getMessages()
  }, 2000)
}

// this function needs uncomented to run the chat room
// initalPage()
// const name = nick('')

// function nick () {
//   return yo` <input type="text" placeholder="Enter your Nickname" id="nickname"></input><button type="submit">Submit</button>`
// }

// target.appendChild(name)

// nickname.onsubmit = function () {
//   const nicknames = nickname.value
// }
