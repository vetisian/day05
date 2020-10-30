//load required libraries from node modules
const express = require('express')
const handlebars = require('express-handlebars')
const fetch = require("node-fetch")
const path = require('path')
const NewsAPI = require('newsapi')

//configure the environment
const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000 
const API_KEY = process.env.API_KEY || "";


const newsapi = new NewsAPI(API_KEY);
const NEWS_URL = 'https://newsapi.org/v2/top-headlines'


//create an instance ofthe express application
const app = express()

//configure handlebars
app.engine('hbs', handlebars({defaultLayout:'default.hbs'}))
app.set('view engine', 'hbs')


// load/mount the static resources directory
app.use(express.static(__dirname+ '/static'))

// configure app
app.get('/', (req, resp) => {
    resp.status(200)
    resp.type('text/html')
    resp.render('index')
})




app.get('/search', 
    async (req, resp) => {
        const search = req.query['search-term']
        const country  = req.query['country']
        const category = req.query['category']
        console.info(search+ country+ category)

        
        const imgs = await(newsapi.v2.topHeadlines({
                    q:  search,
            category: category,
            country: country
        }))

        console.info(imgs)
           
        const displayNews = imgs.articles
            .map( d => {
                    return { title: d.title, urlToImage: d["urlToImage"], description:d.description, publishedAt:d.publishedAt,url:d.url }
                }
            )
       
        

    console.info(imgs)

    resp.status(200)
    resp.type('text/html')
    resp.render('news', {
         displayNews,
        //hasContent: displayNews.length > 0
        //hasContent: !!displayNews.length
    })

    }
)





 

//start express
if (API_KEY)
    app.listen(PORT, () => {
        console.info(`Application started on port ${PORT} at ${new Date()}`)
        console.info(`with key ${API_KEY}`)
    })
else
    console.error('API_KEY is not set')


     