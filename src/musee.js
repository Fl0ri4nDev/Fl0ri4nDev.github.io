export default class musee{


constructor (pName, pCity, pLat, pLon, pCode, pAdresse,pVille,pURL, pHistoire, pAtout,pListDomaine)
{
this.name=pName;
this.city=pCity;
this.lat=pLat;
this.lon=pLon;
this.code=pCode;
this.adresse=pAdresse;
this.ville=pVille;
this.url=pURL;
this.histoire=pHistoire;
this.atout=pAtout;
this.listeDomaines=pListDomaine;

}

containsDomaine(pDomaine)

{
  var i=0;
  for(i=0;i<this.listeDomaines.length;i++)
  {
    if(this.listeDomaines[i]==pDomaine) return true;
  }
  return false;
}



}
