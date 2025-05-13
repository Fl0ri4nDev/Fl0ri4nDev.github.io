import MuseeManager from "./museeManager.js";
export default class OSMmap{

getMaCarte()
{
  return this.macarte;
}

constructor()
  {
    this.myPositionLat=49.54;
    this.myPositionLon=1;
    this.currentPositionLat=this.myPositionLat;;
    this.currentPositionLon=this.myPositionLon;
    this.options = {
      enableHighAccuracy: true,
      timeout: 7000,
      maximumAge: 0
    };
    this.macarte = null;
    this.layerMarkerMusees="";
    this.layerMarkerPosition="";


  }

success(pos) {
  var crd = pos.coords;
  var myPositionLat=crd.latitude;
  var myPositionLon=crd.longitude;

  var myIcon = L.icon({
    iconUrl : '../img/map-marker-circle.png',

    //iconUrl: 'https://icon-library.com/images/geolocation-icon-png/geolocation-icon-png-5.jpg',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

}

error(err) {
  console.warn(`ERREUR (${err.code}): ${err.message}`);
}



getMyPosition()
{
  navigator.geolocation.getCurrentPosition(success, this.error, this.options);
}

cleanMap()
{
  this.layerMarkerMusees.clearLayers();
}




  addMarker_Musees(pMuseeManager)
  {
  this.cleanMap();
  var self=this;
  var myMarker=[];
  var iconMusee = L.icon({
  iconUrl : '../img/location-circle.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40]});
  var i=0;
  for(i=0;i<pMuseeManager.listeMusees.length;i++)
  {
         myMarker[i]=L.marker([pMuseeManager.listeMusees[i].lat, pMuseeManager.listeMusees[i].lon],{icon: iconMusee});
         myMarker[i].bindPopup("<b>"+ pMuseeManager.listeMusees[i].city + " : " + pMuseeManager.listeMusees[i].name + "</b><br>" , {permanent: false, className: "my-label", offset: [0, 0] });
         myMarker[i].id=pMuseeManager.listeMusees[i].code;
         myMarker[i].on('click',function(event){
        //   MuseeManager.loadOeuvres(event.target.id);
});

    myMarker[i].addTo(this.layerMarkerMusees);

  }
this.layerMarkerMusees.addTo(this.macarte);

}


initMap()
{
    // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    this.currentPositionLat=this.myPositionLat;
    this.currentPositionLon=this.myPositionLon;

    this.macarte = L.map('map').setView([this.currentPositionLat, this.currentPositionLon], 15);

    this.layerMarkerMusees=L.layerGroup().addTo(this.macarte);
    this.layerMarkerPosition=L.layerGroup().addTo(this.macarte);


    // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
    var urlLayerOSM="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png";

    L.tileLayer(urlLayerOSM, {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(this.macarte);

    this.macarte.locate({setView: true, maxZoom: 16});
    var self=this;

    this.macarte.on('locationfound', onLocationFound);

    function onLocationFound(e) {


        var myIcon = L.icon({
        iconUrl: 'https://icon-library.com/images/geolocation-icon-png/geolocation-icon-png-5.jpg',
        iconSize: [40, 40],
        iconAnchor: [20, 40],

    });
      self.myPositionLat=e.latlng.lat;
      self.myPositionLon=e.latlng.lng;
      self.currentPositionLat=self.myPositionLat;
      self.currentPositionLon=self.myPositionLon;

      self.layerMarkerPosition.clearLayers();
      var myPositionMarker=L.marker(e.latlng,{icon: myIcon});
      myPositionMarker.addTo(self.layerMarkerPosition);
      self.layerMarkerPosition.addTo(self.macarte);

      }
}





}
