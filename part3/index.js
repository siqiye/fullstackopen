const express = require("express");
const morgan = require('morgan')  // 引入 Morgan
const app = express();

// 使用 JSON 解析中间件
app.use(express.json())

// 创建一个自定义令牌，用于获取请求体并转成字符串
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

// 使用自定义格式，其中包含了 :body 令牌
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),          // 请求方法 (GET, POST, etc.)
    tokens.url(req, res),             // 请求路径
    tokens.status(req, res),          // 响应状态码
    tokens.res(req, res, 'content-length'), '-', 
    tokens['response-time'](req, res), 'ms', 
    tokens.body(req, res)             // 我们自定义的 body 令牌
  ].join(' ')
}))

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const count = persons.length   // 假设你的人名数组或对象列表是 persons
  const currentTime = new Date() // 获取当前时间

  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${currentTime}</p>
  `)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body;

  // 如果请求体中缺少 name 或 number，返回 400 错误
  if(!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  // 如果姓名已经存在于电话簿中，返回 400 错误
  const nameExists = persons.find(p => p.name === body.name)
  if(nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  // 生成一个随机 ID，这里用一个足够大的范围来降低重复几率
  const newId = Math.floor(Math.random() * 1000000)

  const newPerson = {
    id: newId,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
