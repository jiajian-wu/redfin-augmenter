
// <meta property="og:url" content="https://www.opentable.com/r/mera-restaurant-brooklyn">
// <meta property="place:location:latitude" content="40.604976">
// <meta property="place:location:longitude" content="-73.980282">


// var latitude = document.querySelector("meta[property='place:location:latitude']").getAttribute("content");
// var longitude = document.querySelector("meta[property='place:location:longitude']").getAttribute("content");
// var phone = document.querySelector("meta[property='business:contact_data:phone_number']").getAttribute("content");

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        let script = document.getElementsByClassName("AddressBannerSectionV2")[0].getElementsByTagName("script")[0]
        let json = JSON.parse(script.textContent)

        let city = json.address.addressLocality
        let postalCode = json.address.postalCode
        let lat = json.geo.latitude
        let lng = json.geo.longitude
        
        var payload = { city: city, postalCode: postalCode, lat: lat, lng: lng }
        if (message.type === "getInfo") {
            sendResponse(payload)
        }
        return true;
    }
);