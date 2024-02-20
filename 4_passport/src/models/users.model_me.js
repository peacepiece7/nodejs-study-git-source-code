const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
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
const saltRounds = 10
userSchema.pre('save', function (next) {
  let user = this
  // 비밀번호가 변경될 때만
  if (user.isModified('password')) {
    // salt를 생성합니다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err)

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // 원래는 bycrpt compare로 암호화를 해야함!
  // if (plainPassword === this.password) {
  //   cb(null, true)
  // } else {
  //   cb(null, false)
  // }
  // return cb({ error: 'error!' })

  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

const User = mongoose.model('User', userSchema)

module.exports = User
