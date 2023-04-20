const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const port = 3000
const mongoURI = 'mongodb+srv://adrien:bob@cluster0.c3bofco.mongodb.net/index'

// Options pour la connexion

// Se connecter à la base de données
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

// Définition du modèle de product à partir du schéma
const Product = mongoose.model('Product', productSchema)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
    // Route pour créer un nouveau product
app.post('/products', (req, res) => {
    const { name, price } = req.body

    // Validation des données
    if (!name || !price) {
        return res.status(400).json({ message: 'Nom et prix sont requis' })
    }

    // Création d'un nouvel objet product
    const nouveauproduct = new Product({ name, price })

    // Sauvegarde du product dans la base de données
    nouveauproduct
        .save()
        .then(() => {
            res.status(201).json(nouveauproduct)
        })
        .catch((err) => {
            res.status(500).json({ message: 'Erreur lors de la création du product', error: err })
        })
})

// Route pour récupérer tous les products
app.get('/products', (req, res) => {
    Product.find()
        .then((products) => {
            res.status(200).json(products)
        })
        .catch((err) => {
            res.status(500).json({ message: 'Erreur lors de la récupération des products', error: err })
        })
})

// Route pour récupérer un product par son ID
app.get('/products/:id', (req, res) => {
    const { id } = req.params

    Product.findById(id)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: 'product non trouvé' })
            }
            res.status(200).json(product)
        })
        .catch((err) => {
            res.status(500).json({ message: 'Erreur lors de la récupération du product', error: err })
        })
})

// Route pour mettre à jour un product par son ID
app.put('/products/:id', (req, res) => {
        const { id } = req.params
        const { nom, prix } = req.body

        // Validation des données
        if (!nom || !prix) {
            return res.status(400).json({ message: 'Nom et prix sont requis' })
        }

        Product.findByIdAndUpdate(id, { nom, prix }, { new: true })
            .then((product) => {
                if (!product) {
                    return res.status(404)
                }
                return res.status(200).json({ product })
            })
            .catch((err) => {
                res.status(500).json({ message: 'Erreur lors de la mise à jour du product', error: err })
            })
    })
    // Route pour supprimer un product par son ID
app.delete('/products/:id', (req, res) => {
    const { id } = req.params

    Product.findByIdAndRemove(id)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: 'product non trouvé' })
            }
            res.status(200).json({ message: 'product supprimé avec succès' })
        })
        .catch((err) => {
            res.status(500).json({ message: 'Erreur lors de la suppression du product', error: err })
        })
})

app.listen(port, function() {
    console.log('Server listening on port ' + port)
})