const path = require("path")
const express = require('express');
const hbs = require('hbs');
const app = express();

const geocode = require("./utils/geocode.js");
const weatherApi = require("./utils/weather.js");
String.prototype.escapeDiacritics = function() {
    return this.replace(/ą/g, 'a').replace(/Ą/g, 'A')
        .replace(/ć/g, 'c').replace(/Ć/g, 'C')
        .replace(/ę/g, 'e').replace(/Ę/g, 'E')
        .replace(/ł/g, 'l').replace(/Ł/g, 'L')
        .replace(/ń/g, 'n').replace(/Ń/g, 'N')
        .replace(/ó/g, 'o').replace(/Ó/g, 'O')
        .replace(/ś/g, 's').replace(/Ś/g, 'S')
        .replace(/ż/g, 'z').replace(/Ż/g, 'Z')
        .replace(/ź/g, 'z').replace(/Ź/g, 'Z');
}
// defining paths for files.
const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "./templates/views")
const partialsPath = path.join(__dirname, './templates/partials')

// setup hbs engine and views location.
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
// setup static directory
app.use(express.static(publicPath));
// defining variables to use in templates

const variables = {
    index: {
        tittle: 'weather',
        name: 'Sebastian Gołębiowski',
    },
    about: {
        tittle: "About",
        name: "Sebastian Gołębiowski",
    },
    help: {
        tittle: "Help Page",
        name: "Sebastian Gołębiowski",
        listItems: {
            item1: "item1",
            item2: "item2",
            item3: "item3",
            item4: "item4",
            item5: "item5",
        },

    },
    error404: {

        main: {
            tittle: '404 Page',
            name: 'Sebastian Gołebiowski',
            message: "Error 404 Page not found",
        },
        help: {
            tittle: '404 Page',
            name: 'Sebastian Gołebiowski',
            message: "Error 404 Help article not found",
        }
    }
}

const {
    index,
    about,
    help,
    error404,
} = variables
// defining express routing
app.get('', (req, res) => {
    res.render('index', index)
})
app.get('/about', (req, res) => {
    res.render('about', about)
})
app.get('/help', (req, res) => {
    res.render('help', help)
})

app.get('/weather', (req, res) => {
    if (!req.query.addres) {
        return res.send({
            error: " You must provide an addres!"
        })
    }
    const addres = req.query.addres.escapeDiacritics()
    geocode({
        limit: 1,
        addres
    }, (error, data) => {
        if (error) {
            res.send({
                error: "Unable to find location-try another search",

            })
        } else {
            weatherApi(data, (error, data) => {
                if (error) {
                    res.send({
                        error
                    })
                } else {
                    const forecastToSend = {
                        location: data.data.location,
                        description: `Today is ${data.data.summary}, The temperature is ${data.data.temperature} degrees. There is ${data.data.precipProbability*100}% chance of rain, wind speed is ${data.data.windSpeed}m/s and the pressure ${data.data.pressure}hpa`
                    }


                    res.send(forecastToSend)
                }

            })
        }
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', error404.help)
})
app.get('*', (req, res) => {
    res.render('404', error404.main)
})
const port = process.env.PORT || 8000; // firs part is port for heroku
// setup server listening
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})