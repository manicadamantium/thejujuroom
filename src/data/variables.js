require('dotenv').config()
console.log(process.env.RECEIVER_EMAIL)
module.exports = {
  RECEIVER_EMAIL: process.env.RECEIVER_EMAIL
}