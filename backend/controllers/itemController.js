const pool = require('../db');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// Create a new item of some collection
const createItem = async (req, res) => {
  const { collectionid, name, condition, ownership, description } = req.body;

  try {
    // Is file detected
    if (!req.file) {
      throw new Error('Image is required!');
    }

    // File check
    {
      // Allowed ext
      const filetypes = /jpeg|jpg|png|gif/;
      // Check ext
      const extname = filetypes.test(req.file.originalname.toLowerCase());
      // Check mime
      const mimetype = filetypes.test(req.file.mimetype);

      if (!extname || !mimetype) {
        console.log('Image file must be type jpeg|jpg|png|gif!');
        throw new Error('Image file must be type jpeg|jpg|png|gif!');
      }
    }
    const imagepath = req.file.path;
    const imageext = req.file.mimetype.split('/')[1];

    // Check collectionid
    const collectionResult = await pool.query('SELECT * FROM collections WHERE id = $1', [collectionid]);
    const collection = collectionResult.rows[0];
    if (!collection) {
      console.log('No such collection');
      throw new Error('No such collection');
    }

    // Give itemid
    const lastidnumber = collection.lastidnumber + 1;
    const totalitem = collection.totalitem + 1;
    const itemid = `${collection.alias}-${String(lastidnumber).padStart(4, '0')}`;

    // Create item
    const itemResult = await pool.query(
      'INSERT INTO items (collectionid, itemid, name, description, imagepath, imageext, condition, ownership) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [collectionid, itemid, name, description, imagepath, imageext, condition, ownership]
    );

    // Update collection
    await pool.query(
      'UPDATE collections SET lastidnumber = $1, totalitem = $2 WHERE id = $3',
      [lastidnumber, totalitem, collectionid]
    );

    res.status(200).json(itemResult.rows[0]);
  } catch (err) {
    if (req.file) {
      await unlinkAsync(req.file.path);
    }
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
};

// Delete an item
const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if item exists
    const itemResult = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    const item = itemResult.rows[0];
    if (!item) {
      return res.status(404).json({ error: 'No such item' });
    }

    // Update collection total item
    const collectionResult = await pool.query('SELECT * FROM collections WHERE id = $1', [item.collectionid]);
    const collection = collectionResult.rows[0];
    const totalitem = collection.totalitem - 1;
    await pool.query('UPDATE collections SET totalitem = $1 WHERE id = $2', [totalitem, item.collectionid]);

    // Delete item image
    try {
      await unlinkAsync(item.imagepath);
    } catch (error) {
      console.log('Warning, no such item: ' + item.imagepath);
    }

    // Delete item
    await pool.query('DELETE FROM items WHERE id = $1', [id]);

    res.status(200).json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all items
const getItems = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single item
const getItem = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    const item = result.rows[0];
    if (!item) {
      return res.status(404).json({ error: 'No such item' });
    }

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update item
const updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, condition, ownership } = req.body;

  try {
    // Get current item data
    const itemResult = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    const item = itemResult.rows[0];
    if (!item) {
      return res.status(404).json({ error: 'No such item' });
    }

    let imagepath = item.imagepath;
    let imageext = item.imageext;

    // If new image is uploaded, update imagepath and imageext
    if (req.file) {
      // File check
      const filetypes = /jpeg|jpg|png|gif/;
      const extname = filetypes.test(req.file.originalname.toLowerCase());
      const mimetype = filetypes.test(req.file.mimetype);

      if (!extname || !mimetype) {
        throw new Error('Image file must be type jpeg|jpg|png|gif!');
      }

      // Remove old image
      await unlinkAsync(item.imagepath);

      // Update imagepath and imageext
      imagepath = req.file.path;
      imageext = req.file.mimetype.split('/')[1];
    }

    // Update item
    const result = await pool.query(
      'UPDATE items SET name = $1, description = $2, condition = $3, ownership = $4, imagepath = $5, imageext = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
      [name, description, condition, ownership, imagepath, imageext, id]
    );

    const updatedItem = result.rows[0];
    res.status(200).json(updatedItem);
  } catch (err) {
    if (req.file) {
      await unlinkAsync(req.file.path);
    }
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createItem,
  deleteItem,
  getItems,
  getItem,
  updateItem,
};
