var app = angular.module('directives');

app.directive('trailsSubheader', ['$ionicPopup', '$ionicModal', function ($ionicPopup, $ionicModal) {
    return {
        templateUrl: 'views/trails/trailsSubheader.html',
        controller: ['$scope', function ($scope) {

            $scope.sortOptions = [
                {text: "Name (A-Z)", sortby: "name"},
                {text: "Time: Lo to Hi", sortby: "time"},
                {text: "Time: Hi to Lo", sortby: "-time"},
                {text: "Distance: Lo to Hi", sortby: "distance"},
                {text: "Distance: Hi to Lo", sortby: "-distance"}
            ];

            $scope.sortby = function () {
                var sortByPopup = $ionicPopup.show({
                    title: 'Sort trails',
                    cssClass: 'sort-trails-popup',
                    templateUrl: 'views/trails/sortby.html',
                    scope: $scope,
                    buttons: [
                        {
                            text: '', //Sort button
                            type: 'button-clear button-small disabled',
                            onTap: function (e) {
                                $scope.scrollToTop();
                            }
                        },
                        {
                            text: '', //Cancel button
                            type: 'button-clear button-small disabled'
                        }
                    ]
                });
                sortByPopup.then(function (res) {
                });
            };

            var filterLocation =
                {
                    key: "filterLocation",
                    name: "Location",
                    items: [
                        { name: "Any", value: []},
                        { name: "North Shore", value: ["north van", "west van"]},
                        { name: "Fraser Valley", value: ["fraser valley"]},
                        { name: "Howe Sound", value: ["howe sound"]},
                        { name: "Ridge Meadows", value: ["ridge meadows"]},
                        { name: "South of Fraser (Delta, Langley)", value: ["south of fraser"]},
                        { name: "Tri-Cities", value: ["tri-cities"]},
                        { name: "Vancouver", value: ["vancouver"]},
                        { name: "Whistler", value: ["whistler"]}
                    ]
                };

            var filterTimeMin =
                {
                    key: "filterTimeMin",
                    name: "Time - Minimum",
                    items: [
                        { name: "No Minimum", value: 0 },
                        { name: "2 hours", value: 2 },
                        { name: "4 hours", value: 4 },
                        { name: "8 hours", value: 8 }
                    ]
                };

            var filterTimeMax =
            {
                key: "filterTimeMax",
                name: "Time - Maximum",
                items: [
                    { name: "2 hours", value: 2 },
                    { name: "4 hours", value: 4 },
                    { name: "8 hours", value: 8 },
                    { name: "No Maximum", value: 999 }
                ]
            };

            var filterDistanceMin =
            {
                key: "filterDistanceMin",
                    name: "Distance - Minimum",
                items: [
                    { name: "No Minimum", value: 0},
                    { name: "2 km", value: 2},
                    { name: "4 km", value: 4},
                    { name: "8 km", value: 8},
                    { name: "16 km", value: 16}
                ]
            };

            var filterDistanceMax =
            {
                key: "filterDistanceMax",
                name: "Distance - Maximum",
                items: [
                    { name: "2 km", value: 2},
                    { name: "4 km", value: 4},
                    { name: "8 km", value: 8},
                    { name: "16 km", value: 16},
                    { name: "No Maximum", value: 999},
                ]
            };

            $scope.filterGroups = [
                filterLocation,
                filterTimeMin,
                filterTimeMax,
                filterDistanceMin,
                filterDistanceMax
            ];

            $scope.saveFilterValue = function(groupKey, item) {
                $scope.data[groupKey] = item;
            };

            var defaultFilters = {
                sortSelected: "name",
                filterLocation: { name: "Any", value: []},
                filterTimeMin: { name: "No Minimum", value: 0 },
                filterTimeMax: { name: "No Maximum", value: 999 },
                filterDistanceMin: { name: "No Minimum", value: 0},
                filterDistanceMax: { name: "No Maximum", value: 999},
                filterDifficultyEasy: true,
                filterDifficultyModerate: true,
                filterDifficultyHard: true,
                filterDogFriendly: false,
                filterTransit: false,
                filterInSeason: false
            };

            $scope.data = angular.copy(defaultFilters);

            var watchCollectionNames = Object.keys(defaultFilters).map(function (obj) {
                return "data." + obj;
            });
            $scope.$watch('trails', function() {
                $scope.filteredTrails = $scope.$eval("trails | filter:searchText | trailsFilter:data | orderBy:data.sortSelected");
            });
            $scope.$watchGroup(watchCollectionNames, function() {
                $scope.filteredTrails = $scope.$eval("trails | filter:searchText | trailsFilter:data | orderBy:data.sortSelected");
            });

            $scope.filterby = function () {
                $scope.closeFilterModal();
            };

            $scope.resetFilters = function () {
                angular.copy(defaultFilters, $scope.data);
                $scope.searchText = '';
                window.plugins.toast.showShortBottom(
                    "Filters reset"
                );
            };

            $ionicModal.fromTemplateUrl('views/trails/filterby.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.filterModal = modal;
            });

            $scope.openFilterModal = function () {
                $scope.filterModal.show();
            };
            $scope.closeFilterModal = function () {
                $scope.filterModal.hide();
                $scope.scrollToTop();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.filterModal.remove();
            });

            $scope.toggleGroup = function(group) {
                if ($scope.isGroupShown(group)) {
                    $scope.shownGroup = null;
                } else {
                    $scope.shownGroup = group;
                }
            };
            $scope.isGroupShown = function(group) {
                return $scope.shownGroup === group;
            };

            $scope.Math = Math;
        }]
    };
}]);