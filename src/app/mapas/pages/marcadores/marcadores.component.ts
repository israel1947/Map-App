import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MarcadorColors } from '../../../interfaces/menu-items.interface';

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`
   .mapa-container{
   width: 100%;
   height: 100%;
  }
  
  .mapboxgl-popup {
    max-width: 200px;
  }
  .list-group{
    position:fixed;
    top:20px;
    right:20px;
    z-index:999;
  }
  li{
    cursor:pointer;
  }
 

  `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!:ElementRef//referencia al al ide de referencia local del  HTML
  map!:mapboxgl.Map;
  zoomLavel:number=16;
  ubicacionActual:[number,number]=[ -74.17076778750781, 11.223452534661256];

  //arreglo que almacena los marcadores
  marcadores:MarcadorColors[]=[];

  constructor() { }


  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container:this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.ubicacionActual,
      zoom:this.zoomLavel,
      });

      this.leerLocalStorage();

      /* create the popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setText(
        'La Universidad Cooperativa de Colombia, también llamada UCC es una institución privada de educación superior que pertenece al sector de la economía solidaria creada en 1983'
        );

      const imgMarker  = document.createElement('div');
      imgMarker.className= 'marker';
      imgMarker.style.backgroundImage=`url(https://upload.wikimedia.org/wikipedia/commons/f/f1/Logo_UCC.jpg)`;
      imgMarker.style.zIndex=`99999`;
      imgMarker.style.height=`50px`
      imgMarker.style.width=`50px`
      imgMarker.style.borderRadius=`50%`
      imgMarker.style.backgroundSize=`cover`
      imgMarker.style.cursor=`pointer`

      // crear un marcador, y agregarlo en el mapa
       new mapboxgl.Marker(imgMarker)
        .setLngLat(this.ubicacionActual)
        .setPopup(popup)
        .addTo(this.map);*/
  }
  agregarMarcador(){
    //genera colores hexadecimales aleatoreamente 
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    //agregar nuevos marcadores y que estos a su vez se puedar mover y tengan colores diferentes
    const nuevoMarcador = new mapboxgl.Marker({
      draggable:true,
      color:color,
    })
      .setLngLat(this.ubicacionActual)
      .addTo(this.map)

      this.marcadores.push({
        color:color,
        marker:nuevoMarcador
      });

      this.guardarMarcadores();

      //guardar movimientos de los marcadores en el localStorage y que se mantengan al recargar el navegador
      nuevoMarcador.on('dragend', ()=>{
        this.guardarMarcadores();
      })

  }

  //desplazarse hasta los marcadores haciendo click sobre su cuadro
  irMarcador(marker?:mapboxgl.Marker){
    this.map.flyTo({
      center:marker?.getLngLat()
    });
  }

  guardarMarcadores(){
    const lngLatArr:MarcadorColors[]=[];

    this.marcadores.forEach(m =>{
      const color = m.color;
      const {lng, lat} = m.marker!.getLngLat();

      lngLatArr.push({
        color:color,
        centro:[lng, lat]
      });

    });
    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }
  
  //leeara los marcadores que se encuentran almacenados en el localStorage y evitara que se pierdan al recargar la pagina
  leerLocalStorage(){
    //si no hay nada que almacenar en el localStorage, enrtonces solo retornara
    if(!localStorage.getItem('marcadores') ){
      return ;
    }
    const lngLatArr :MarcadorColors[]= JSON.parse(localStorage.getItem('marcadores')! );
    //console.log(lngLatArr);

    lngLatArr.forEach( m=>{

      const newMarker = new mapboxgl.Marker({
        color:m.color,
        draggable:true,
      })
      .setLngLat(m.centro!)
      .addTo(this.map);

      this.marcadores.push({
        marker:newMarker,
        color:m.color
      });

      //guardar movimientos de los marcadores en el localStorage y que se mantengan al recargar el navegador
      newMarker.on('dragend', ()=>{
        this.guardarMarcadores();
      })

    });
  }
  
  //borrar marcador dando doble click sobre el mismo
  eliminarMarcador(i:number){
    //elimina el marcador fisicamente del mapa
    this.marcadores[i].marker?.remove();
    //eliminar el marcador del arreglo de marcadores 
    this.marcadores.splice(i,1);
    this.guardarMarcadores();
  }
}
