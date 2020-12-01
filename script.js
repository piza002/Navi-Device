var marker;
var map;
var pos;
var GoogleLink;
var SelfLink;
var diDisplay;
function initMap() {
  document.getElementById("btLink").disabled = true;
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -34.397, lng: 150.644 },
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
  var name = document.getElementById("tbSearch").value;
  if(name != "")
  {
    var url = "https://quiet-harbor-07073.herokuapp.com/getalias/"+name;
    fetch(url)
    .then((resp)=>resp.json())
    .then(function(data)
      {
        if(data == null)
        {
          alert("ขออภัยด้วยไม่พบชื่อสถานที่นี้ในฐานข้อมูล");
        }
        else
        {
          lat = JSON.stringify(data[0]["lat"]);
          lng = JSON.stringify(data[0]["lng"]);
          GoogleLink=lat+","+lng;
          gotoMap(lat,lng);
        }
      });
  }
  else alert("โปรดใส่ชื่อสถานที่");
  document.getElementById("btLink").disabled = false;
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
  window.location="https://www.google.com/maps/dir/"+SelfLink+"/"+GoogleLink+"/@"+GoogleLink+",16z";
}
