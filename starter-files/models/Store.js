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
    tags: [String]
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