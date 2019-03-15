const request = require("request")

const weather = (location = {}, callback) => {
    const {
        longitude,
        latitude
    } = location
    const url = `https://api.darksky.net/forecast/d434935106dd0a8970fec0462c30a9d7/${longitude},${latitude}?units=si `
    request({
        url: url,
        json: true
    }, (error, response) => {
        if (error) {
            const errorData = {
                message: "Nie można nawiązać połączenia"
            }
            callback(errorData, undefined)
        } else if (response.statusCode !== 200) {
            console.log();

            const errorData = {
                message: "Dark Sky Api Error",
                errorResponse: {
                    code: response.statusCode,
                    body: response.body,
                    urlSend: response.request.uri.href
                },
            }
            callback(errorData, undefined)

        } else {
            const {
                temperature,
                precipProbability,
                summary,
                pressure,
                windSpeed,
            } = response.body.currently;

            const weatherData = {
                data: {
                    summary,
                    temperature,
                    precipProbability,
                    location: location.location,
                    pressure,
                    windSpeed
                },

            }
            callback(undefined, weatherData)
        }
    })
}
module.exports = weather