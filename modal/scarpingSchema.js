const mongoose = require("mongoose")

const amazonDataSchema = new mongoose.Schema({
    products: {
        type: Array
    },
})

const DataModel = mongoose.model('amazonData', amazonDataSchema)
module.exports = DataModel