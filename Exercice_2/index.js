const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const port = 3000
const mongoURI = 'mongodb+srv://adrien:bob@cluster0.c3bofco.mongodb.net/index'

// Options for connection

// Connect to the database
mongoose.connect(mongoURI)

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
})

// Definition of the product model from the diagram
const Product = mongoose.model('Product', productSchema)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
    // Route to create a new product
app.post('/products', (req, res) => {
    const { name, price } = req.body

    // Data validation
    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' })
    }

    // Creation of a new product object
    const nouveauproduct = new Product({ name, price })

    // Product backup in the database
    nouveauproduct
        .save()
        .then(() => {
            res.status(201).json(nouveauproduct)
        })
        .catch((err) => {
            res.status(500).json({ message: 'Error when creating the product', error: err })
        })
})

// Route to retrieve all products
app.get('/products', (req, res) => {
    Product.find()
        .then((products) => {
            res.status(200).json(products)
        })
        .catch((err) => {
            res.status(500).json({ message: 'Error while retrieving products', error: err })
        })
})

// Route to retrieve a product by its ID
app.get('/products/:id', (req, res) => {
    const { id } = req.params

    Product.findById(id)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: 'product not found' })
            }
            res.status(200).json(product)
        })
        .catch((err) => {
            res.status(500).json({ message: 'Error while retrieving product', error: err })
        })
})

// Route to update a product by its ID
app.put('/products/:id', (req, res) => {
        const { id } = req.params
        const { name, price } = req.body

        // Data validation
        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' })
        }

        Product.findByIdAndUpdate(id, { name, price }, { new: true })
            .then((product) => {
                if (!product) {
                    return res.status(404)
                }
                return res.status(200).json({ product })
            })
            .catch((err) => {
                res.status(500).json({ message: 'Error while updating the product', error: err })
            })
    })
    // Route to delete a product by its ID
app.delete('/products/:id', (req, res) => {
    const { id } = req.params

    Product.findByIdAndRemove(id)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: 'product not found' })
            }
            res.status(200).json({ message: 'product deleted successfully' })
        })
        .catch((err) => {
            res.status(500).json({ message: 'Error while deleting the product', error: err })
        })
})

app.listen(port, function() {
    console.log('Server listening on port ' + port)
})