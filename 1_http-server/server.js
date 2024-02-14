const http = require('http')
const port = 4000
const server = http.createServer((req, res) => {
  const targetObject = { a: 'A', b: 'B', c: 'C' }
  /**
   * Browser console에 다음 코드 입력해서 테스트
   * fetch("http://localhost:4000/home", {method : "POST", body : JSON.stringify({a : "AA", b : "BB", c : "CC"})})
   */
  if (req.method === 'POST' && req.url === '/home') {
    req.on('data', (data) => {
      console.log('data', data)
      const stringfiedData = data.toString()
      console.log('stringfiedData', stringfiedData)
      Object.assign(targetObject, JSON.parse(stringfiedData))
    })
  } else {
    if (req.url === '/home') {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      res.write(JSON.stringify(targetObject))
      res.end()
    } else if (req.url === '/about') {
      res.setHeader('Content-Type', 'text/html')
      res.write('<html>')
      res.write('<head>')
      res.write('<title>About</title>')
      res.write('</head>')
      res.write('<body>')
      res.write('<h1>About</h1>')
      res.write('<p>This is the about page</p>')
      res.write('</body>')
      res.write('</html>')
      res.end()
    } else {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/plain')
      res.write('Not Found')
      res.end()
    }
  }
})

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})
