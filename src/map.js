export default class Map{




      //Conversion des degrés en radian
      convertRad(input){
        return (Math.PI * input)/180;
      }


   getDistance(lat_a_degre, lon_a_degre, lat_b_degre, lon_b_degre){

   var R = 6378000 //Rayon de la terre en mètre

  var lat_a = this.convertRad(lat_a_degre);
  var lon_a = this.convertRad(lon_a_degre);
  var lat_b = this.convertRad(lat_b_degre);
  var lon_b = this.convertRad(lon_b_degre);

  var d = R * (Math.PI/2 - Math.asin( Math.sin(lat_b) * Math.sin(lat_a) + Math.cos(lon_b - lon_a) * Math.cos(lat_b) * Math.cos(lat_a)))
  return d;
  }

    displayStationInfo(canvas, cursor_x,cursor_y,pArrayStations)
    {

        // var rect = canvas.getBoundingClientRect();
      var canvas_HEIGHT=canvas.height;
      var canvas_WIDTH=canvas.width;

      var div = document.getElementById("comment");

      var left  = cursor_x  +50+ "px";
      var top  = cursor_y  - 10+"px";


      var i=0;




       div.style.display="none";
      for (i=0;i<pArrayStations.length;i++)
      {

        var station_y=canvas_HEIGHT-(canvas_HEIGHT*(pArrayStations[i].lat-this.MIN_LAT))/(this.MAX_LAT-this.MIN_LAT);
        var station_x=(canvas_WIDTH*(pArrayStations[i].lon-this.MIN_LONG))/(this.MAX_LONG-this.MIN_LONG);

        if(cursor_x>station_x && cursor_x<station_x+canvas_WIDTH/200)
        {
          if(cursor_y>station_y && cursor_y<station_y+canvas_HEIGHT/200)
          {
            div.style.display="block";
            div.style.left = left;
            div.style.top = top;
            document.getElementById("comment").innerHTML = pArrayStations[i]
            break;
          }
        }
      }
    }

    getContext()
    {
        return this._ctx;
    };

    setSize(pHeight, pWidth)
    {
        this.canvas_HEIGHT=pHeight;
        this.canvas_WIDTH=pWidth;
    };

    clearStations(canvas)
    {
        var ctx=canvas.getContext("2d");
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }


    drawMyPosition (canvas,pMyLat,pMyLon)
    {

      var ctx=canvas.getContext("2d");
      var canvas_HEIGHT=canvas.height;
      var canvas_WIDTH=canvas.width;

      if(pMyLat!=0 && pMyLon !=0)
      {
        ctx.fillStyle="#FF0000";
        var y=canvas_HEIGHT-(canvas_HEIGHT*(pMyLat-this.MIN_LAT))/(this.MAX_LAT-this.MIN_LAT);
        var x=(canvas_WIDTH*(pMyLon-this.MIN_LONG))/(this.MAX_LONG-this.MIN_LONG);
        ctx.fillRect(x,y,canvas.width/200,canvas.width/200);
      }
    }

    drawAllStations(canvas,pStationList,pMyLat, pMyLon)
    {
      console.log("[FUNCTION] DrawAllstation() - Lat/Lon : "+ pMyLat +"/"+pMyLon);

        var ctx=canvas.getContext("2d");
        var canvas_HEIGHT=canvas.height;
        var canvas_WIDTH=canvas.width;

         this.MIN_LONG=Math.min.apply(Math, pStationList.map(function(o) {return o.lon; }))
         this.MAX_LONG=Math.max.apply(Math, pStationList.map(function(o) { return o.lon; }))
         this.MIN_LAT=Math.min.apply(Math, pStationList.map(function(o) { return o.lat; }))
         this.MAX_LAT=Math.max.apply(Math, pStationList.map(function(o) { return o.lat; }))
        var i;
        for(i=0;i<pStationList.length;i++)
        {
            var myDistance=this.getDistance(pMyLat,pMyLon,pStationList[i].lat,pStationList[i].lon);
            console.log("[FUNCTION] DrawAllstation() - myDistance : "+ myDistance );

            if((pMyLat==0 && pMyLon==0) || myDistance<1000)
            {
              ctx.fillStyle="#000000";
              if(pStationList[i].type=="metro")ctx.fillStyle="#0000FF";
              if(pStationList[i].type=="rer")ctx.fillStyle="#FF0000";
              if(pStationList[i].type=="tram")ctx.fillStyle="#00FF00";
              var y=canvas_HEIGHT-(canvas_HEIGHT*(pStationList[i].lat-this.MIN_LAT))/(this.MAX_LAT-this.MIN_LAT);
              var x=(canvas_WIDTH*(pStationList[i].lon-this.MIN_LONG))/(this.MAX_LONG-this.MIN_LONG);
              ctx.fillRect(x,y,canvas.width/200,canvas.width/200);
            }


        }



    }

    constructor (canvas,pListeStations)
    {
        //var ctx=canvas.getContext("2d");

        this.MIN_LONG=0;
        this.MAX_LONG=0;
        this.MIN_LAT;
        this.MAX_LAT;
       var self=this;

       canvas.addEventListener('mousemove', function (e){
        var rect = canvas.getBoundingClientRect();
        var x= (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
        var y= (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;

        self.displayStationInfo (canvas,x,y,pListeStations);
      }
      );



    }


    getClickedStationID(canvas,cursor_x,cursor_y,pArrayStations)
    {
        var canvas_HEIGHT=canvas.height;
        var canvas_WIDTH=canvas.width;

        this.MIN_LONG=Math.min.apply(Math, pArrayStations.map(function(o) { return o.lon; }))
        this.MAX_LONG=Math.max.apply(Math, pArrayStations.map(function(o) { return o.lon; }))
        this.MIN_LAT=Math.min.apply(Math, pArrayStations.map(function(o) { return o.lat; }))
        this.MAX_LAT=Math.max.apply(Math, pArrayStations.map(function(o) { return o.lat; }))

        var i=0;
        var stationID=-1;
      for (i=0;i<pArrayStations.length;i++)
      {

        var station_y=canvas_HEIGHT-(canvas_HEIGHT*(pArrayStations[i].lat-this.MIN_LAT))/(this.MAX_LAT-this.MIN_LAT);
        var station_x=(canvas_WIDTH*(pArrayStations[i].lon-this.MIN_LONG))/(this.MAX_LONG-this.MIN_LONG);
        if(cursor_x>station_x && cursor_x<station_x+canvas_WIDTH/200)
        {
          if(cursor_y>station_y && cursor_y<station_y+canvas_HEIGHT/200)
         {
            stationID=i;

            break;
          }
        }

      }
      return stationID;


      }



}
