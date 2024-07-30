const mongoose = require('mongoose');
const validator = require("validator");
const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    gallery: {
        type: [
          {
            url: {
              type: String,
              default: "https://placehold.co/296x200.png",
              validate: [
                validator.isURL,
                "Please, provide a valid garry photo URL",
              ],
            },
            public_id: {
              type: String,
              default: "N/A",
            },
          },
        ],
        validate: {
          validator: function (value) {
            return value.length <= 5;
          },
          message: "Won't able to add more than 5 gallery",
        },
      },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Product', productSchema)