const weatherFormSearch = document.querySelector(".search-form")
const errorMessageHtml = document.querySelector("#error-message")
const forecastMessageHtml = document.querySelector("#forecast-message")
const addresMessageHtml = document.querySelector("#addres-message")

// sending querry for weather
weatherFormSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    const addresFromInput = e.target.children[0].value;

    const fetchUrl = `/weather?addres=${addresFromInput}`
    fetch(fetchUrl).then(response => {
        response.json().then(data => {
            if (data.error) {
                forecastMessageHtml.textContent = ""
                addresMessageHtml.textContent = ""
                errorMessageHtml.textContent = data.error

            } else {
                errorMessageHtml.textContent = ""
                addresMessageHtml.textContent = data.location
                forecastMessageHtml.textContent = data.description
            }


        })

    })

    e.target.children[0].value = "";
})