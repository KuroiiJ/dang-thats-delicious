const mongoose = require('mongoose');
const Schema = mongoose.Schema
mongoose.Promise = global.Promise;
const md5 = require('md5')
const validator = require('validator')
const mongodbErrorHandler = require('mongoose-mongodb-errors')
const passportLocalMongoose = require('passport-local-mongoose');
const { date } = require('faker');
const { text } = require('body-parser');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true, 
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        require: 'Please Supply An Email Address'
    },
    name: {
        type: String, 
        required: 'Please supply a name',
        trim: true
    },
    slug: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    occupation: {
        type: String,
        trim: true,
        required: 'Please enter a store name!'
    },
    phone: {
        type: String,
        unique: true,
        trim: true,
        validate: [validator.isMobilePhone, 'Invalid Phone'],
        require: 'Please Supply A Phone Number'
    },
    birthDate: {
        type: Date,
        required: 'Please enter a date!'
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: 'You Must Supply Coordinates!'
        }],
        address: {
            type: String,
            required: 'You Must Supply An Address'
        }
    },
    allergies : {
        type : Boolean,
        required : "You must answer"
    },
    otherAnimals : {
        type : String,
        required : "You must answer"
    },
    household: {
        type: String,
        required : "You must answer"
    },
    children: {
        type: Boolean,
        required : "You must answer"
    },   
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    
})


//create unique slugs (pulled from store)!
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('name')) {
//         next();
//         return;
//     }
//     this.slug = slug(this.name);

//     const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
//     const storesWithSlug = await this.constructor.find({slug: slugRegEx })
//     if(storesWithSlug.length) {
//         this.slug = `${this.slug}-${storesWithSlug.length + 1}`
//     }
//      next()
   
// })


userSchema.virtual('gravatar').get(function() {
    const hash = md5(this.email)
    return `https://gravatar.com/avatar/${hash}?s=200`
})

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })
userSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('User', userSchema)