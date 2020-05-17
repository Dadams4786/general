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
        <p>Published By: <i>${item.nickname}</i></p>
        <p>${item.date}</p>
        <span>${item.text}</span>
        </li>`
    })}
    </ul>`
}
// generate the above text ono a page dynamicly with el
target.appendChild(el)

const chatInput = document.getElementById('chatInput')
const nicknames = document.getElementById('nickname')
chatInput.onsubmit = function (evt) {
  evt.preventDefault()
  // this hides the nickname field
  nicknames.style.display = 'none'
  // this grabs the nickname field value
  const nickname = chatInput.children[0].value
  const text = chatInput.children[1].value
  // run the inital page
  initalPage()
  // call post mesage function with the text and the nickname fileds 
  postMessage(text, nickname)
}

// make a new date with this function, format using the below date methods
function currentDate () {
  const date = new Date()
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + (date.getHours() < 12 ? date.getHours() + 'AM' : date.getHours() - 12 + 'PM')
}

// this function posts message to the chat-text file in json format
function postMessage (text, nickname) {
  console.log('posting message')
  fetch('/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nickname: nickname, text: text, date: currentDate() })
  })
    .then(data => {
      console.log('Success:', data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

// get messages from messages route on the server and this reads the file chattext.json and gives us a response that we format to json inorder to use in the render function
function getMessages () {
  fetch('/messages')
    .then(response => response.json())
    .then(data => render(data)) // run the render function with data "json"
    .then(data => console.log(data, 'this is data'))
}

// postMessage('hello')

// runs the get messages function every 2 seconds getting all new messages to post on the page
function initalPage () {
  setInterval(() => {
    getMessages()
  }, 2000)
}

// ** THE BELOW IS AN EXAMPLE THAT I (AUSTEN MADE AND DID NOT USE FOR NICKNAME) **


// this function needs uncomented to run the chat room
// initalPage()

// var element = yo`<form id="nickInput">
// <input type="text" placeholder="Enter your Nickname">
// <button id="nickname" type="submit">Submit</button>
// </form>
// `

// nicknameInput.appendChild(element)

// function check () {
//   const nick = nick1
//   console.log(nick, 'this is nick')
//   initalPage()
//   return nick
// }
// const nickname = document.getElementById('nickname')
// const nickInput = document.getElementById('nickInput')
// nickInput.onsubmit = function (evt) {
//   evt.preventDefault()
//   nicknameInput.style.display = 'none'
//   const nick1 = nickInput.children[0].value
//   check(nick1)
// }
