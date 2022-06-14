const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        validate: {
            validator: value => {
                const re =
                  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re);
              },
            message: "Please enter a valid email address",
        },
    },
    password:{
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema)