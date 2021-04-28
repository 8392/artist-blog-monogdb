const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  avataUrl: { type: String },
  gender: { type: Number, enum: [0, 1], default: 0, required: true },
  follow: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }] }
})

module.exports = model('User', userSchema)

