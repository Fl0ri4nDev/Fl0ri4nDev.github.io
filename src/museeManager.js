import Musee from "./musee.js";
import Oeuvre from "./oeuvre.js";

export default class museeManager{

constructor()
{
  this.listeMusees = [];
  this.listeDomaines=[];

}

getNextMusee(pCurrentMuseeIdentiant)
{
  var i=0;
  for(i=0;i<this.listeMusees.length;i++)
  {
    if(this.listeMusees[i].code==pCurrentMuseeIdentiant)
    if(i<this.listeMusees.length-1){return this.listeMusees[i+1];}
  }
  return null;
}

getPreviousMusee(pCurrentMuseeIdentiant)
{
  var i=0;
  for(i=0;i<this.listeMusees.length;i++)
  {
    if(this.listeMusees[i].code==pCurrentMuseeIdentiant)
    if(i>0){return this.listeMusees[i-1];}
  }
  return null;
}

getMuseeByID(pIdentifiant)
{
  var i=0;
  for(i=0;i<this.listeMusees.length;i++)
  {
    if(this.listeMusees[i].code==pIdentifiant)return this.listeMusees[i];
  }
  return null;

}

charger_ListeDomaines()
{
  var i=0;
  var j=0;
  for(i=0;i<this.listeMusees.length;i++)
  {
    for(j=0;j<this.listeMusees[i].listeDomaines.length;j++)
    {
    if(!this.listeDomaines.includes(this.listeMusees[i].listeDomaines[j]))
    {this.listeDomaines.push(this.listeMusees[i].listeDomaines[j])}
  }

}
}

async  loadMusees(myOSMmap) {


  // const response = await fetch('../importMusee.json');
  const response = await fetch('https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/musees-de-france-base-museofile/records?limit=50&refine=departement%3A%22Seine-Maritime%22');

  const resp_museee = await response.json();
  const data_musee = resp_museee["results"]
console.log(data_musee);
  var i=0;
  for(i=0;i<data_musee.length;i++)
  {
    var current_musee=new Musee(
      data_musee[i].nom_officiel,
      data_musee[i].ville,
      data_musee[i].coordonnees.lat,
      data_musee[i].coordonnees.lon,
      data_musee[i].identifiant,
      data_musee[i].adresse,
      data_musee[i].ville,
      data_musee[i].url,
      data_musee[i].histoire,
      data_musee[i].atout,
      data_musee[i].domaine_thematique);
    this.listeMusees.push(current_musee);
  }
this.charger_ListeDomaines();
console.log(  this.listeMusees);
console.log(this.listeDomaines);
}




static display_oeuvres(pListoeuvres)
{
  console.log(pListoeuvres);
  var zone_text =  document.getElementById("liste_oeuvre");
  zone_text.innerHTML="";
  var i=0;
  for(i=0;i<pListoeuvres.length;i++)
  {
    zone_text.innerHTML = zone_text.innerHTML + "<a href='https://pop.culture.gouv.fr/notice/joconde/"+pListoeuvres[i].reference + "' target=_blank> "+ pListoeuvres[i].titre +"</a><br>";
  }
}


static async  loadOeuvres(pIdentifiant) {

var listeOeuvres=[];
  console.log('https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/base-joconde-extrait/records?where=code_museofile%3D%22'+ pIdentifiant + '%22&limit=-1');
  const response = await fetch('https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/base-joconde-extrait/records?where=code_museofile%3D%22'+ pIdentifiant + '%22&limit=-1');
  const resp_oeuvres = await response.json();
  const data_oeuvres = resp_oeuvres["results"]
  var i=0;
  for(i=0;i<data_oeuvres.length;i++)
  {
    var current_oeuvre=new Oeuvre(data_oeuvres[i].titre,data_oeuvres[i].code_museofile,data_oeuvres[i].reference);
    listeOeuvres.push(current_oeuvre);

    }

  //this.display_oeuvres(listeOeuvres);
}

 async reloadMusees(pLat, pLon,myOSMmap) {



this.listeMusees=[];
var lat1=pLat-0.25;
var lat2=pLat+0.25;
var lon1=pLon-0.25;
var lon2=pLon+0.25;

 const response = await fetch('https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/musees-de-france-base-museofile/records?where=in_bbox(coordonnees%2C%20'+lat1+'%2C%20'+lon1+'%2C%20'+lat2+'%2C%20'+lon2+')&limit=-1');
 const resp_museee = await response.json();
 const data_musee = resp_museee["results"]

 var i=0;
 for(i=0;i<data_musee.length;i++)
 {
   var current_musee=new Musee(
     data_musee[i].nom_officiel,
     data_musee[i].ville,
     data_musee[i].coordonnees.lat,
     data_musee[i].coordonnees.lon,
     data_musee[i].identifiant,
     data_musee[i].adresse,
     data_musee[i].ville,
     data_musee[i].url,
     data_musee[i].histoire,
     data_musee[i].atout,
     data_musee[i].domaine_thematique);

     this.listeMusees.push(current_musee);
   }

}




}
