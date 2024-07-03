const express = require('express')
const router = express.Router()
const {
    createCollection,
    getCollections,
    deleteCollection,
    getCollectionItems
} = require('../controllers/collectionController')

// Create a new collection
router.post('/', createCollection)

// Get all collections
router.get('/', getCollections)

// Delete a collection
router.delete('/:id', deleteCollection)

// Get collection items
router.get('/:id', getCollectionItems)

module.exports = router