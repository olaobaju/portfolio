var map;
var sf = new google.maps.LatLng(37.762656, -122.440742);
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

var MY_MAPTYPE_ID = 'custom_style';

function initialize() {

  var featureOpts = [
    {
      stylers: [
        { hue: '#EA2C91' },
        { visibility: 'simplified' },
        { gamma: 0.5 },
        { weight: 0.5 }
      ]
    },
    {
      elementType: 'labels',
      stylers: [
        { visibility: 'off' }
      ]
    },
    {
      featureType: 'water',
      stylers: [
        { color: '#323D47' }
      ]
    }
  ];

  var mapOptions = {
    zoom: 12,
    center: sf,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
    },
    mapTypeId: MY_MAPTYPE_ID,
    disableDefaultUI: true
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setOptions( { suppressMarkers: true } );

  var styledMapOptions = {
    name: 'Custom Style'
  };

  var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

  map.mapTypes.set(MY_MAPTYPE_ID, customMapType);

  var labels = ['A', 'B', 'C', 'D'];
  var prompts = ['Click map for point A', 'Now choose point B', 'Click for point C', 'Finally choose point D', 'Calculating Route...'];
  var index = 0;
  var prompt = document.getElementById('prompt');
  var locations = [];
  var markers = [];

  function addLocation(location){
      locations[index] = location;
      markers[index] = new google.maps.Marker({
              position: location,
              label: labels[index],
              map: map
      });
      index++;
      prompt.innerHTML = prompts[index];
  }

  function calcTwoRoutes(locations){
    directionsDisplay.setMap(map);
    var start = locations[0];
    var waypts = [
          {location: locations[2], stopover:true},
          {location: locations[3], stopover:true},
          {location: locations[1], stopover:true}
    ];
    var end = locations[0];
    var request = {
          origin: start,
          destination: end,
          waypoints: waypts,
          optimizeWaypoints: false,
          travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        var legs = response.routes[0].legs;
        var driver = "";
        if(legs[1].distance.value <= legs[3].distance.value){
          driver = "Driver one";
          legs.splice(3, 1);
        }else{
          driver = "Driver two";
          legs.splice(1, 1);
        }
        directionsDisplay.setDirections(response);
        prompt.innerHTML = driver + " has the more efficient route";
      }
    });
  }

  function showRoute(start, waypts, end, driver){
    directionsDisplay.setMap(map);
    var request = {
          origin: start,
          destination: end,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          prompt.innerHTML = driver + " has the more efficient route";

        }
      });
  }

  function calcAllRoutes(locations){
    var start1 = locations[0];
    var waypts1 = [
              {location: locations[1], stopover:true},
              {location: locations[2], stopover:true},
              {location: locations[3], stopover:true},
              {location: locations[0], stopover:true},
              {location: locations[2], stopover:true}
    ];
    var end1 = locations[1];
    var response1;

    var start2 = locations[2]
    var waypts2 = [
              {location: locations[0], stopover:true},
              {location: locations[3], stopover:true},
              {location: locations[1], stopover:true}
    ];
    var end2 = locations[3];
    var response2;

    var request1 = {
          origin: start1,
          destination: end1,
          waypoints: waypts1,
          optimizeWaypoints: false,
          travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService.route(request1, function(response1, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          var legs1 = response1.routes[0].legs;

          var request2 = {
                origin: start2,
                destination: end2,
                waypoints: waypts2,
                optimizeWaypoints: false,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request2, function(response2, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                var legs2 = response2.routes[0].legs;

                // 6 options for route:
                // AB BC CD
                // AC CB BD
                // AC CD DB
                // CD DA AB
                // CA AD DB
                // CA AB BD
                if(document.getElementById('duration').checked){
                  var AB = {dist: legs1[0].duration.value, start: locations[0], end: locations[1]};
                  var AC = {dist: legs1[4].duration.value, start: locations[0], end: locations[2]};
                  var AD = {dist: legs2[1].duration.value, start: locations[0], end: locations[3]};
                  var BC = {dist: legs1[1].duration.value, start: locations[1], end: locations[2]};
                  var BD = {dist: legs2[3].duration.value, start: locations[1], end: locations[3]};
                  var CA = {dist: legs2[0].duration.value, start: locations[2], end: locations[0]};
                  var CB = {dist: legs1[5].duration.value, start: locations[2], end: locations[1]};
                  var CD = {dist: legs1[2].duration.value, start: locations[2], end: locations[3]};
                  var DA = {dist: legs1[3].duration.value, start: locations[3], end: locations[0]};
                  var DB = {dist: legs2[2].duration.value, start: locations[3], end: locations[1]};
                }else{
                  var AB = {dist: legs1[0].distance.value, start: locations[0], end: locations[1]};
                  var AC = {dist: legs1[4].distance.value, start: locations[0], end: locations[2]};
                  var AD = {dist: legs2[1].distance.value, start: locations[0], end: locations[3]};
                  var BC = {dist: legs1[1].distance.value, start: locations[1], end: locations[2]};
                  var BD = {dist: legs2[3].distance.value, start: locations[1], end: locations[3]};
                  var CA = {dist: legs2[0].distance.value, start: locations[2], end: locations[0]};
                  var CB = {dist: legs1[5].distance.value, start: locations[2], end: locations[1]};
                  var CD = {dist: legs1[2].distance.value, start: locations[2], end: locations[3]};
                  var DA = {dist: legs1[3].distance.value, start: locations[3], end: locations[0]};
                  var DB = {dist: legs2[2].distance.value, start: locations[3], end: locations[1]};
                }

                var min = [AB, BC, CD, 'Driver one'];
                var minDist = AB.dist + BC.dist + CD.dist;
                
                if((AC.dist + CB.dist + BD.dist) <= minDist){
                  min = [AC, CB, BD, 'Driver one'];
                  minDist = AC.dist + CB.dist + BD.dist;
                  
                }if((AC.dist + CD.dist + DB.dist) <= minDist){
                  min = [AC, CD, DB, 'Driver one'];
                  minDist = AC.dist + CD.dist + DB.dist;
                 
                }if((CD.dist + DA.dist + AB.dist) <= minDist){
                  min = [CD, DA, AB, 'Driver two'];
                  minDist = CD.dist + DA.dist + AB.dist;
                 
                }if((CA.dist + AD.dist + DB.dist) <= minDist){
                  min = [CA, AD, DB, 'Driver two'];
                  minDist = CA.dist + AD.dist + DB.dist;
              
                }if((CA.dist + AB.dist + BD.dist) <= minDist){
                  min = [CA, AB, BD, 'Driver two'];
                  minDist = CA.dist + AB.dist + BD.dist;
        
                }

                waypts = [{location: min[1].start, stopover:true}, {location: min[1].end, stopover:true}];

                showRoute(min[0].start, waypts, min[2].end, min[3]);
              }
            });
        }
      });
  }

  function clear(){
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    directionsDisplay.setMap(null);
    markers = [];
  }

  function start(event){
    event.preventDefault();
    document.getElementById('start').removeEventListener('click', start);
    clear();
    index = 0;
    prompt.innerHTML = "Click map for location A";
    prompt.style.padding = "15px";
    
    var clicklisten = google.maps.event.addListener(map, 'click', function( event ){
      addLocation(event.latLng);
      if(index == 4){
        google.maps.event.removeListener(clicklisten);
        document.getElementById('start').addEventListener('click', start);
        if(document.getElementById('passenger').checked){
          calcAllRoutes(locations);
        }else{
          calcTwoRoutes(locations);
        }
      }
    });
  }

  var infoIndex = 0;
  var informations = [
      "This program will calculate the shortest detour distace for two drivers, the first going from point A to point B, and the second going from point C to point D. <br/><div style = 'text-align: right;''>Click to Continue...</div>",
      "This means that there are two possibilities: that the first driver picks up the second driver at point C and drops him off at point D before continuing on to point B, or that the second driver picks up the first driver at point A and drops him off at point B before continuing on to point D. <br/><div style = 'text-align: right;''>Click to Continue...</div>",
      "This, however, is a pretty simplistic view of a more interesting question.  This problem works for what I'd call a driver-driver model, as opposed to a driver-passenger model. <br/><div style = 'text-align: right;''>Click to Continue...</div>",
      "If we look at the problem from a driver-passenger standpoint, the problem becomes slightly more complex.  Which driver can complete the other drivers ride concurrently with its own more efficiently? <br/><div style = 'text-align: right;''>Click to Continue...</div>",
      "This broadens the possibilities from two to six, as now the only restraints are that point B is reached later than point A, and that point D is reached later than point C.  All in all the possible orderings of the points are ABCD, ACBD, and ACDB if the first driver takes both passengers, and CDAB, CADB, and CABD if the second driver takes both passengers. <br/><div style = 'text-align: right;''>Click to Continue...</div>",
      "This program allows you to calculate either the driver-driver model, or the driver-passenger model.  It also allows the user to control whether the routes will be judged based on distance traveled, or duration of the trip. <br/><div style = 'text-align: right;''>Click to Continue...</div>",
      "Click start to begin!"
  ]

  function nextPrompt(event){
    prompt.innerHTML = informations[infoIndex];
    infoIndex ++;
    if(infoIndex == informations.length){
      prompt.removeEventListener('click', nextPrompt);
      document.getElementById('start').addEventListener('click', start);
      infoIndex = 0;
    }
  }

  function help(event){
    event.preventDefault();
    infoIndex = 0;
    document.getElementById('start').removeEventListener('click', start);
    prompt.innerHTML = informations[infoIndex];
    prompt.style.padding = "15px";
    infoIndex++;
    prompt.addEventListener('click', nextPrompt);
  }

  document.getElementById('start').addEventListener('click', start);
  document.getElementById('help').addEventListener('click', help);
  document.getElementById('clear').addEventListener('click', function(event){
    clear();
    prompt.innerHTML = "";
    prompt.style.padding = "0px"
  });
}

google.maps.event.addDomListener(window, 'load', initialize);