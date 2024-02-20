const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const dotenv = require('dotenv')
const path = require('path')
const config = require('config')
const User = require('./models/users.model_me')
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require('./middleware/auth')

const mainRouter = require('./routes/main.router')

const cookieSession = require('cookie-session')

dotenv.config()

// mongodb 연결
mongoose.set('strictQuery', true)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('mongodb connected')
  })
  .catch((err) => {
    console.error(err)
  })

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

/**
 * session을 관리할 떄 cookie-session, express-session 두 가지 방법이 있다.
 * 1. cookie-session
 *  - 서버에서 세션을 관리하지 않고 클라이언트에서 세션을 관리한다.
 *  - 보안 취약, 서버 부하가 적음, 서버 재시작 시 세션 초기화
 * 2. express-session
 *  - 서버에서 세션을 관리한다.
 *  - 보안 강화, 서버 부하가 큼, 서버 재시작 시 세션 유지 (세션 저장소(db)에 저장)
 */

app.use(
  cookieSession({
    name: 'cookie-session-name',
    keys: [process.env.COOKIE_ENCRYPTION_KEY],
  })
)

/**
 * req.session.regenerate is not a function 에러 해결 방법
 * register regenerate & save after the cookieSession middleware initialization
 */
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb()
    }
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb()
    }
  }
  next()
})

/**
 * passport 시작, 세션 사용을 위한 미들웨어 -> passport 전략 import
 */
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport_me')

/**
 * req.body 사용을 위한 미들웨어
 */
app.use(express.json())
/**
 * form(폼)으로 제출되는 값은 x-www-form-urlencoded 형식으로 전송되기 때문에 이를 파싱하기 위해 사용
 * extended: false는 노드의 querystring 모듈을 사용하여 쿼리스트링을 해석하고, true는 qs 모듈을 사용하여 쿼리스트링을 해석한다.
 * @see blog {@link https://kirkim.github.io/javascript/2021/10/16/body_parser.html}
 */
app.use(express.urlencoded({ extended: false }))
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use('/', mainRouter)
app.get('/', checkAuthenticated, (req, res) => {
  res.render('index')
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login')
})

app.post('/login', async (req, res, next) => {
  // 월래 app.post의 두 번째 콜백 함수에 authHandler를 넣어야하지만, app.post의 콜백 인자를 쓰기 위해 authHandler를 선언하여 커링으로 사용
  const authHandler = passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }

    if (!user) {
      return res.json({ msg: info })
    }

    /**
     * 1. req.login() 실행 시 passport.serializeUser() 실행 => 서버에 세션 생성
     * 2. 클라이언트로 보내는 쿠키에 세션 정보가 담김
     * 3. 로그인한 사용자가 요청을 보내면 passport.deserializeUser() 실행 => 세션 정보로 db에서 사용자 정보 조회
     */
    req.login(user, function (err) {
      console.log('LOGIN SUCCESS')
      if (err) return next(err)
      res.redirect('/')
    })
  })

  authHandler(req, res, next)
})

app.get('/signup', checkNotAuthenticated, (req, res) => {
  res.render('signup')
})

app.post('/signup', async (req, res) => {
  // user 객체 생성
  const user = new User(req.body)
  try {
    const result = await user.save()
    console.log('signup success :', result)
  } catch (err) {
    console.error(err)
  }
})

app.post('/logout', (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/login')
  })
})

app.use('/auth', authRouter)

app.get('/auth/google', passport.authenticate('google'))
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
  })
)

app.listen(config.get('server').port, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
