function doRequest(url, method, data, callback, errorCallback) {
    var req = new XMLHttpRequest();
    req.open(method, url);
    // The Google image search API responds with JSON, so let Chrome parse it.
    //req.responseType = 'html';
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.onload = function () {
        // Parse and process the response from Google Image Search.
        var response = req.response;
        callback(response);
    };
    req.onerror = function () {
        errorCallback('Network error.');
    };
    req.send(data ? JSON.stringify(data) : undefined);
}

document.addEventListener('AntPost-DoRequest', function (evt) {
    //console.log('AntPost-DoRequest');
    console.log(evt);

    var params = evt.detail;

    doRequest(params.url, params.method, params.data, function (res) {
        console.log(res);
    }, function (error) {
        console.log(error);
    })
});