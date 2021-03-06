var app = angular.module('services');

app.service('GooglePlacesService', ['$http',  function($http){
    var that = this;
    var googlePlacesAPIKey = "AIzaSyB3ihw8Uzd6y6fxDtrJ0dqp96RQaODZ9tQ";

    that.getPhotos = function(trail) {
        return that.getPlaceId(trail.name, trail.lat, trail.long).then(function (placeId) {
                return placeId;
            }).then(function (placeId) {
                return that.getPlaceDetails(placeId);
            }).then(function (placeDetails) {
                // will contain maximum 10 photos
                return placeDetails && placeDetails.result && placeDetails.result.photos ? placeDetails.result.photos : [];
            }).catch(function (error) {
                console.log(error);
            });
    };

    that.getPlaceId = function(trailName, latitude, longitude) {
        var absoluteURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

        var locationString = latitude.toString() + "," + longitude.toString();
        return $http.get(absoluteURL, {
            params : {
                key : googlePlacesAPIKey,
                location : locationString,
                radius : 5000,
                keyword : trailName
            }
        }).then(function successCallback(response) {
            var res = null;

            var responseData = response && response.data;
            var firstResult = responseData && responseData.results && responseData.results.length && responseData.results[0];
            if (firstResult) {
                res = firstResult.place_id;
            }
            return res;
        }, function errorCallback(response) {

        });
    };

    that.getPlaceDetails = function(placeId) {
        var absoluteURL = "https://maps.googleapis.com/maps/api/place/details/json";

        return $http.get(absoluteURL, {
            params : {
                key : googlePlacesAPIKey,
                placeid : placeId
            }
        }).then(function successCallback(response) {
            return response.data;
        }, function errorCallback(response) {

        });
    };

    that.getPhotoURL = function(photoReference) {
        var absoluteURL = "https://maps.googleapis.com/maps/api/place/photo?";
        absoluteURL += "key=" + googlePlacesAPIKey + "&";
        absoluteURL += "maxwidth=480&";
        absoluteURL += "photoreference=" + photoReference;
        return absoluteURL;
    };

    return that;
}]);