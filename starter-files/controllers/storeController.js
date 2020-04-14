const mongoose = require('mongoose')
const Store = mongoose.model('Store')

exports.homePage = (req, res) => {
    req.flash('error', 'Something Happened')
    req.flash('info', 'Something Happened')
    req.flash('warning', 'Something Happened')
    req.flash('success', 'Something Happened')
    res.render('index', {title: 'Home'})
}

exports.addStore = (req, res) => {
    res.render('editStore', {title: 'Add Store'})
}

exports.createStore = async (req, res) => {
        const store = await (new Store(req.body)).save()
        req.flash('success', `Successfully Created ${store.name}. Care to leave a Review?`)
        res.redirect(`/store/${store.slug}`)
}

exports.getStores = async (req, res) => {
   const stores = await Store.find()
   res.render('stores', {title: 'Stores', stores})
}


// router.get('/store/:storeName', storeController.getStore);