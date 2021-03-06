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
    }, 
    author: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User',
        required: 'You must supply an author'
    }
}, {
        //mongoose: do these to automatically include virtuals when calling stores
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    
})

//indexes

storeSchema.index({
    name: 'text', 
    description: 'text'
})

storeSchema.index({
    location: '2dsphere'
})


//hooks

//create unique slugs!
storeSchema.pre('save', async function(next) {
    if (!this.isModified('name')) {
        next();
        return;
    }
    this.slug = slug(this.name);

    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
    const storesWithSlug = await this.constructor.find({slug: slugRegEx })
    if(storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`
    }
     next()
   
})

storeSchema.statics.getTagsList = function () {
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } }},
        { $sort: { count: -1 } }
    ])
}

storeSchema.statics.getTopStores = function () {
    return this.aggregate([
        //lookup stores and pop their reviews
        { $lookup: {
            from: 'reviews', localField: '_id', foreignField: 'store', as: 'reviews'}
        },
        //filter for stores that have 2+ reviews
        { $match: {
            'reviews.1': { $exists: true} }
        },
        //add the average of store reviews
        { $project: {
            photo: '$$ROOT.photo',
            name: '$$ROOT.name',
            slug: '$$ROOT.slug',
            reviews: '$$ROOT.reviews',
            averageRating: { $avg: 'reviews.rating' }
        }},
        //sort by new field
        { $sort: { averageRating: -1 }},
        //limit to ten
        { $limit: 10}
    ])
}


//link to reviews **This is Mongoose Specific** 
storeSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'store'
})

function autopopulate(next) {
    this.populate('reviews')
    next()
}

storeSchema.pre('find', autopopulate)
storeSchema.pre('findOne', autopopulate)

module.exports = mongoose.model('Store', storeSchema)