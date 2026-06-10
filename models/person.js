const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connectin to MongoDB', error.message)
  })

const personSchema = new mongoose.Schema({
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: function(value) {
        return /^\d{2,3}-\d{7,8}$/.test(value)
      },
      message: 'invalid phonenumber'
    }
  },
  name: {
    type: String,
    minlength: 3,
    require: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString()
    delete returnObject._id
    delete returnObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)