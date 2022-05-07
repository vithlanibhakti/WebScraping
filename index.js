const request = require("request-promise");
const cheerio = require("cheerio");
const amazonDataSchema = require('./modal/scarpingSchema') //modal or schema of mongoDB
const mongoose = require('mongoose');
const webURL = "https://www.amazon.com/s?k=camo+outdoor&dc&ref=a9_sc_1";

(async () => {
    const response = await request({
        uri: webURL,
        headers: {
            "accept": "text / html, application/ xhtml + xml, application/ xml; q = 0.9, image / avif, image / webp, image / apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8"
        },
        gzip: true,
    })
    let title, price,img;

    let $ = cheerio.load(response)
    
    const title1 = $('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(2) > div > div > div > div > div > div > div.a-section.a-spacing-small.s-padding-left-small.s-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style > h2')
    const price1 = $('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(2) > div > div > div > div > div > div > div.a-section.a-spacing-small.s-padding-left-small.s-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > a > span:nth-child(1) > span:nth-child(2)')
    const img1 = $('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(2) > div > div > div > div > div > div > div.s-product-image-container.aok-relative.s-image-overlay-grey.s-text-center.s-padding-left-small.s-padding-right-small.s-spacing-small.s-height-equalized > span > a > div > img')
    const imgBody1 = {
        name: title1.text(),
        images: img1.prop("src")
    }
    
    let productsData = [{ product: {
        title: title1.text(), price: price1.text(),imgSrc:imgBody1
    }}];
    //Fetch all products with selectors
    for (var i = 2; i <= 56; i++) {
        title = $('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(' + i + ') > div > div > div > div > div.a-section.a-spacing-small.s-padding-left-small.s-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style > h2')
        price = $('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(' + i + ') > div > div > div > div > div.a-section.a-spacing-small.s-padding-left-small.s-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > a > span > span:nth-child(2)')
        img = $('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(' + i + ') > div > div > div > div > div.s-product-image-container.aok-relative.s-image-overlay-grey.s-text-center.s-padding-left-small.s-padding-right-small.s-spacing-small.s-height-equalized > span > a > div > img')

        const requestBody = {
            name: title.text(),
            images: img.prop("src")
        }
        
        if(title.text() !== '' && price.text() !== '')
        {
            productsData.push({
                product: {
                    title: title.text(), price: price.text(),imgSrc:requestBody
                }
            })
        }
    }
   console.log(productsData,"Data")
  
   var data = {
        products: productsData,
      };
      
(new amazonDataSchema(data)).save(); //Save data to mongo DB

}
)();

/**
 * Mongo db connection
 */
mongoose.connect('mongodb://127.0.0.1:27017/amazonData', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})
