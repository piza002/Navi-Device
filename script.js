var marker;
var map;
var pos;
var GoogleLink;
var SelfLink;
var diDisplay;
var recognition;
function initMap()
{
  map = new google.maps.Map(document.getElementById("map"), 
  {
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  fetch('http://127.0.0.1:8888/gps')
  .then((resp)=>resp.json())
  .then(function(data)
  {
    pos={
      lat: parseFloat(data[0]['lat']),
      lng: parseFloat(data[0]['lng'])
    };
    SelfLink = pos.lat + "," + pos.lng;
        map.setCenter(pos);
        Selfmarker = new google.maps.Marker({
          position: pos,
          map: map,
        });
  })  /*if (navigator.geolocation) 
  {
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
  } else 
  {
    handleLocationError(false, infoWindow, map.getCenter());
  }*/
}
  
function getMap()
{
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
        linkmap(data[0]["name"],name);
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

function linkmap(buildname,aliasname)
{
  var maplink="https://www.google.com/maps/dir/"+SelfLink+"/"+GoogleLink+"/@"+GoogleLink+",16z";
  document.getElementById("imgmap").src="https://api.qrserver.com/v1/create-qr-code/?data="+maplink+"&amp;size=100x100";
  document.getElementById("lbQr").innerHTML="Your Destination (Marker B): "+"<br>"+buildname+"<br>"+aliasname;
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
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
  recognition.onstart = function() 
  {
  };  
  recognition.onspeechend = function() 
  {
    recognition.stop();
  };
  recognition.onresult = function(event) 
  {
    var transcript = event.results[0][0].transcript;
    output.value = transcript;
    getMap();
  };
  recognition.start();
}

function takeshot() { 
  let div = document.getElementById("mapall");
  html2canvas(div,
    {
      proxy: "server.js",
      useCORS: true,
    }).then( 
    function (canvas) 
    {
      var dl = document.createElement("a");
      dl.href = canvas.toDataURL();
      dl.download = "imgmap";
      document.body.appendChild(dl);
      console.log(dl.href);
      postdata('http://127.0.0.1:60146/print',{
        "data" : dl.href
      })
      console.log("Complete");
    })
     
}
async function postdata(url='',data = {})
{
  const response = await fetch(url,
  {
    method: "POST",
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body:JSON.stringify(data)
          
  });
}

