import MuseeManager from "./museeManager.js";
import Musee from "./musee.js";
import OSMmap from "./OSMmap.js";

var myLat=0;
var myLon=0;

var myOSMmap=new OSMmap();
myOSMmap.initMap();


var myMuseeManager = new MuseeManager();


var self=myOSMmap;
myOSMmap.macarte.on('click', function(e) {

    self.currentPositionLat=e.latlng.lat;
    self.currentPositionLon= e.latlng.lng;
    var myIcon = L.icon({

      iconUrl: 'https://icon-library.com/images/geolocation-icon-png/geolocation-icon-png-5.jpg',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      });

    self.layerMarkerPosition.clearLayers();
    var myPositionMarker=L.marker(e.latlng,{icon: myIcon});
    myPositionMarker.addTo(self.layerMarkerPosition);
    self.layerMarkerPosition.addTo(self.macarte);
    reload_museumList(e);


});


async function reload_museumList(e)
{
   await myMuseeManager.reloadMusees(e.latlng.lat, e.latlng.lng,myOSMmap);
   display_musees(myMuseeManager.listeMusees);
   myOSMmap.addMarker_Musees(myMuseeManager);
}


function display_musees(pListMusees)
{
  console.log("...display_Musees");
console.log(pListMusees);
  var div_listMusee =  document.getElementById("liste_musees");
  div_listMusee.innerHTML="";
  var i=0;
var newDivMusee="";
  for(i=0;i<pListMusees.length-1;i++)
  {

  newDivMusee   = document.createElement('div');
    newDivMusee.className="museeDiv";
newDivMusee.id=pListMusees[i].code;
    newDivMusee.addEventListener('click', function(event) {
      console.log(event);

    display_popin(event.target.id);});

    newDivMusee.innerHTML = newDivMusee.innerHTML +
    "<img class='img_musee' src='../img/musee.jpeg'> <br> "+
    "<div class='info_musee'><p class='musee_name'>" + pListMusees[i].name +"</p>"+
    "<p class='musee_adresse'>"+pListMusees[i].adresse +"</p>"+
    "<p class='musee_ville'>"+pListMusees[i].ville +"</p>"+
    "<p class='musee_url'><a href='https://"+pListMusees[i].url +"'target=_blank>Site Web </a></p>"+
    "</div><br>";
    div_listMusee.appendChild(newDivMusee);
  }




  var div_titre_liste_musee =  document.getElementById("titre_liste_musee");
  div_titre_liste_musee.innerHTML="Musées à proximité ("+ pListMusees.length+")" ;
}


function display_popin (pIdentifiant)
{
console.log(pIdentifiant);
  var current_Musee=myMuseeManager.getMuseeByID(pIdentifiant);
  console.log(current_Musee);
    document.getElementById('popin_outside').style.display = 'block';
    document.getElementById('pop-in').style.display = 'block';
  document.getElementById('popin_titre').innerHTML=current_Musee.name;
document.getElementById('popin_description').innerHTML=current_Musee.histoire;

var btn_next=document.getElementById('popin_next');
  btn_next.addEventListener('click', function(event) {
    var next_musee=myMuseeManager.getNextMusee(pIdentifiant);
    display_popin(next_musee.code);});

    var btn_previous=document.getElementById('popin_previous');
      btn_previous.addEventListener('click', function(event) {
        var previous_musee=myMuseeManager.getPreviousMusee(pIdentifiant);
        display_popin(previous_musee.code);});
}

async function loadOeuvres(pIdentifiant) {

  console.log('https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/base-joconde-extrait/records?where=code_museofile%3D%22'+ pIdentifiant + '%22&limit=-1');
  const response = await fetch('https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/base-joconde-extrait/records?where=code_museofile%3D%22'+ pIdentifiant + '%22&limit=-1');
  const resp_oeuvres = await response.json();
  const data_oeuvres = resp_oeuvres["results"]
  console.log(data_oeuvres);
  var i=0;
  for(i=0;i<data_oeuvres.length;i++)
  {

    }
}

async function load_museumList()
{
  await myMuseeManager.loadMusees(myOSMmap);
  myOSMmap.addMarker_Musees(myMuseeManager);
  display_musees(myMuseeManager.listeMusees);

}


load_museumList();






// Fermer le pop-up si l'utilisateur clique en dehors de celui-ci
window.addEventListener('click', function(event) {
    var popup = document.getElementById('pop-in');
    if (event.target == popup) {


        popup.style.display = 'none';
        document.getElementById('popin_outside').style.display = 'none';
    }
});
