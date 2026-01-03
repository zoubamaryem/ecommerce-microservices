const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      enum: {
        values: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Food', 'Other'],
        message: '{VALUE} is not a valid category',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.every((url) => /^https?:\/\/.+/.test(url));
        },
        message: 'All images must be valid URLs',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index pour la recherche
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ price: 1 });

// Virtual pour vérifier la disponibilité
productSchema.virtual('isAvailable').get(function () {
  return this.isActive && this.stock > 0;
});

// Méthode pour mettre à jour le stock
productSchema.methods.updateStock = async function (quantity) {
  this.stock += quantity;
  if (this.stock < 0) {
    throw new Error('Insufficient stock');
  }
  return await this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
