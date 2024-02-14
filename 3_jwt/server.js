const cookieParser = require('cookie-parser')
const express = require('express')
/**
 * @see official-document {@link https://www.npmjs.com/package/jsonwebtoken}
 * @see blog {@link https://www.daleseo.com/js-jwt/}
 */
const jwt = require('jsonwebtoken')
const posts = require('./posts.js')

const app = express()

const secretText = 'superSecret' // secret key
const refreshSecretText = 'supersuperSecret' // refresh secret key

let refreshTokens = []

app.use(express.json()) //  post 요청 body를 사용
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

// fetch("http://localhost:4000/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: "John" }) })
app.post('/login', (req, res) => {
  const username = req.body.username
  const user = { name: username }

  // jwt를 이용해서 토큰 생성하기   payload + secretText
  // 유효기간 추가
  const accessToken = jwt.sign(user, secretText, { expiresIn: '30s' })

  // jwt를 이용해서 refreshToken도 생성
  const refreshToken = jwt.sign(user, refreshSecretText, { expiresIn: '1d' })

  refreshTokens.push(refreshToken)

  // refreshToken을 쿠키에 넣어주기
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  })

  res.json({ accessToken: accessToken })
})

function authMiddleware(req, res, next) {
  // request headers에서 토큰을 가져옵니다.
  const authHeader = req.headers['authorization']
  // Bearer ojgoerkogkerg.oerkgokerokg.okodkodskf
  const token = authHeader && authHeader.split(' ')[1] // .(dot)또는 공백으로 구분된 토큰의 두 번째 요소를 가져옵니다.
  if (token == null) return res.sendStatus(401)

  // 토큰이 있으니 유효한 토큰인지 확인
  jwt.verify(token, secretText, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.get('/refresh', (req, res) => {
  console.log('refresh cookies', req.cookies)
  // body   =>  parsing  =>  req.body
  // cookies  =>  parsing  => req.cookies

  // cookies  가져오기  cookie-parser
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(403)

  const refreshToken = cookies.jwt
  // refreshtoken이 데이터베이스에 있는 토큰인지 확인
  if (!refreshToken.includes(refreshToken)) {
    return res.sendStatus(403)
  }

  // token 이 유효한 토큰인지 확인
  jwt.verify(refreshToken, refreshSecretText, (err, user) => {
    if (err) return res.sendStatus(403)
    // accessToken을 생성하기
    const accessToken = jwt.sign({ name: user.name }, secretText, {
      expiresIn: '30s',
    })
    // 새로 발급한 accessToken을 응답으로 보내주기
    res.json({ accessToken })
  })
})

// 로그인 후 10초 이내에 /posts 요청을 하면 성공적으로 응답을 받을 수 있습니다.
// header.authorization에 `Bearer ${accessToken}`를 넣어서 요청을 보내면 됩니다.
app.get('/posts', authMiddleware, (req, res) => {
  res.json(posts)
})

const port = 4000
app.listen(port, () => {
  console.log('listening on port ' + port)
})
