const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/users.model_me')

// req.login(user)
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// client => session => request
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  })
})

// 로컬 로그인 로직
passport.use(
  'local', // key
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (email, password, done) => {
      User.findOne(
        {
          email: email.toLocaleLowerCase(),
        },
        (err, user) => {
          if (err) return done(err)
          if (!user) {
            return done(null, false, { msg: `Email ${email} not found` })
          }

          user.comparePassword(password, (err, isMatch) => {
            if (err) return done(err)

            if (isMatch) {
              return done(null, user)
            }

            return done(null, false, { msg: 'Invalid email or password.' })
          })
        }
      )
    }
  )
)

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

const googleStrategyConfig = new GoogleStrategy(
  {
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: '/auth/google/callback',
    scope: ['email', 'profile'],
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }, (err, existingUser) => {
      if (err) {
        return done(err)
      }

      if (existingUser) {
        return done(null, existingUser)
      } else {
        const user = new User()
        user.googleId = profile.id
        user.email = profile.emails[0].value
        user.save((err) => {
          if (err) {
            return done(err)
          }
          done(null, user)
        })
      }
    })
  }
)

passport.use('google', googleStrategyConfig)
