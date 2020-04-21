const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs')

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a store name!'
    },
    slug: {
        type: String
    },
    description : {
        type: String,
        trim: true
    },
    tags: [String], 
    created: {
        type: Date,
        default: Date.now
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
    photo: {
        type: String
    }
})

storeSchema.pre('save', function(next) {
    if (!this.isModified('name')) {
        next();
        return;
    }
    this.slug = slug(this.name);
    next()
    //TODO make better slugs so they're unique
})

module.exports = mongoose.model('Store', storeSchema)