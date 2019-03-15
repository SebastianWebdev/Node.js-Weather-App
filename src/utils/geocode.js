const request = require("request")
const geocode = (options = {
    limit: 1,
    addres: "Los Angeles"
}, callback) => {
    const {
        limit,
        addres
    } = options


    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${addres}.json?access_token=pk.eyJ1Ijoic2ViYXN0aWFuLXdlYmRldiIsImEiOiJjanQ3Y2xteXUwY2RxNDNqenZoaTdzd3loIn0.WkiwGmuC_MYUQQYbwVM4RA&limit=${limit}`;
    request({
        url: url,
        json: true,
    }, (error, response) => {
        if (error) {
            const errorData = {
                tittle: "Nie można połączyć się z serwisem",
                error,
                response,
            }
            callback(errorData, undefined)
        } else if (response.statusCode !== 200) {
            const errorData = {
                tittle: "coś poszło nie tak z mapbox API",
                response: response.body.message
            }
            callback(errorData, undefined)

        } else if (!response.body.features.length) {
            const error = {
                message: "Location not found",
                query: response.body.query
            }
            callback(error, undefined);
        } else {
            const {
                features
            } = response.body;
            const geoData = {
                latitude: features[0].center[0],
                longitude: features[0].center[1],
                location: features[0].place_name,
            }
            callback(undefined, geoData)
        }

    })

}
module.exports = geocode