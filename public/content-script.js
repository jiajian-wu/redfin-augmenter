chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        // let script = document.getElementsByClassName("AddressBannerSectionV2")[0].getElementsByTagName("script")[0]
        // let json = JSON.parse(script.textContent)
        
        const ldJsonScripts = document.querySelectorAll('script[type="application/ld+json"]');
        const ldJsonData = JSON.parse(ldJsonScripts[1].textContent);

        let lat = ldJsonData.geo.latitude
        let lng = ldJsonData.geo.longitude
        
        var payload = { lat: lat, lng: lng }
        if (message.type === "getInfo") {
            sendResponse(payload)
        }
        return true;
    }
);