const mongoose = require('mongoose')
const {Schema} = mongoose

const TagSchema = new mongoose.Schema({
    word: { type: String, required: true },  // The text element
    tag: { type: String, required: true },  // The assigned tag
});

const scrapeDataSchema = new mongoose.Schema({
    url: String,
    scrapedText: String,
    tags: [TagSchema],  // Array of tagged entities
    createdAt: { type: Date, default: Date.now }
});

const ScrapeModel = mongoose.model('Scrape', scrapeDataSchema)

module.exports = ScrapeModel