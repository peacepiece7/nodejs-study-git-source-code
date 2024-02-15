const mongoose = require('mongoose')

// email, password 로그인 => googleId, kakakoid is null
// googleId 로그인 => googleId is not null
// kakaoId 로그인 => googleId nuill

// null이 두 개나 있으면 uniqure : true를 사용할 수 없는데, 이런 경우 sparese : true를 사용하면 된다.

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minLength: 5,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  kakaoId: {
    type: String,
    unique: true,
    sparse: true,
  },
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // 원래는 bycrpt compare로 암호화를 해야함!
  if (plainPassword === this.password) {
    cb(null, true)
  } else {
    cb(null, false)
  }
  return cb({ error: 'error!' })
}

const User = mongoose.model('User', userSchema)

module.exports = User
