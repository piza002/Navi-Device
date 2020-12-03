var marker;
var map;
var pos;
var GoogleLink;
var SelfLink;
var diDisplay;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    infoWindow = new google.maps.InfoWindow();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          pos = {
            lat: parseFloat(position.coords.latitude),
            lng: parseFloat(position.coords.longitude),
          };
          SelfLink = position.coords.latitude + "," + position.coords.longitude;
          infoWindow.open(map);
          map.setCenter(pos);
          Selfmarker = new google.maps.Marker({
            position: pos,
            map: map,
          });
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }
  
function getMap()
{
  document.getElementById("action").innerHTML="";
  var name = document.getElementById("tbSearch").value;
  Selfmarker.setMap(null);
  if(name != "")
  {
    var url = "https://quiet-harbor-07073.herokuapp.com/getalias/"+name;
    fetch(url)
    .then((resp)=>resp.json())
    .then(function(data)
      {
        if(data == null)
        {
          alert("Sorry We didn't find this building name in our database");
          clearmap();
        }
        else
        {
          lat = JSON.stringify(data[0]["lat"]);
          lng = JSON.stringify(data[0]["lng"]);
          GoogleLink=lat+","+lng;
          gotoMap(lat,lng);
          linkmap();
        }
      });
  }
  else 
  {
    alert("Please enter the building name");
    clearmap();
  }
}

function gotoMap(bdlat,bdlng)
{
  Selfmarker.setMap(null);
  var diService = new google.maps.DirectionsService();
  if(diDisplay != null) 
  {
    diDisplay.setMap(null);
    diDisplay = null;
  }
  diDisplay = new google.maps.DirectionsRenderer();
  diDisplay.setMap(map);
  var request = 
  {
    origin: pos, 
    destination:
    {
      lat: parseFloat(bdlat),
      lng: parseFloat(bdlng)
    },
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };
  diService.route(request, function(response, status) 
  {
    if (status == google.maps.DirectionsStatus.OK) 
    {
      diDisplay.setDirections(response);
    }
  });
}

function linkmap()
{
  var maplink="https://www.google.com/maps/dir/"+SelfLink+"/"+GoogleLink+"/@"+GoogleLink+",16z";
  document.getElementById("imgmap").src="https://api.qrserver.com/v1/create-qr-code/?data="+maplink+"&amp;size=100x100";
}

function clearmap()
{
  document.getElementById("imgmap").src="";
  if(diDisplay != null) 
  {
    diDisplay.setMap(null);
    diDisplay = null;
  }
  Selfmarker = new google.maps.Marker(
  {
    position: pos,
    map: map,
  });
}

function runSpeech() {
  var output = document.getElementById("tbSearch");
  var action = document.getElementById("action");
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
  recognition.onstart = function() 
  {
    action.innerHTML = "<small>listening, please speak...</small>";
  };  
  recognition.onspeechend = function() 
  {
    action.innerHTML = "<small>stopped listening, hope you are done...</small>";
    recognition.stop();
    getMap();

  };
  recognition.onresult = function(event) 
  {
    var transcript = event.results[0][0].transcript;
    var confidence = event.results[0][0].confidence;
    output.value = transcript;
  };
  recognition.start();
}
