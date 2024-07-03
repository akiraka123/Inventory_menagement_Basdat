const pool = require('../db');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// Create new Collection
const createCollection = async (req, res) => {
  const { name, alias } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO collections (name, alias) VALUES ($1, $2) RETURNING *',
      [name, alias]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all Collections
const getCollections = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM collections');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Collection
const deleteCollection = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if collection exists
    const collectionResult = await pool.query('SELECT * FROM collections WHERE id = $1', [id]);

    if (collectionResult.rowCount === 0) {
      return res.status(404).json({ error: 'No such collection' });
    }

    // Fetch all items in the collection
    const itemsResult = await pool.query('SELECT * FROM items WHERE collectionid = $1', [id]);

    // Delete each item's image file
    for (const item of itemsResult.rows) {
      try {
        await unlinkAsync(item.imagepath);
      } catch (error) {
        console.log('Warning, no such item: ' + item.imagepath);
      }
    }

    // Delete items and collection
    await pool.query('DELETE FROM items WHERE collectionid = $1', [id]);
    await pool.query('DELETE FROM collections WHERE id = $1', [id]);

    res.status(200).json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get collection items
const getCollectionItems = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if collection exists
    const collectionResult = await pool.query('SELECT * FROM collections WHERE id = $1', [id]);

    if (collectionResult.rowCount === 0) {
      return res.status(404).json({ error: 'No such collection' });
    }

    // Get items for the collection
    const itemsResult = await pool.query('SELECT * FROM items WHERE collectionid = $1', [id]);

    res.status(200).json({ collection: collectionResult.rows[0], items: itemsResult.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createCollection,
  getCollections,
  deleteCollection,
  getCollectionItems,
};
