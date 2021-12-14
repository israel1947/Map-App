import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [`
     
  .zoomRange{ 
   width: 100%;
   height: 100%;
  }
  .row{
    background-color:#ffff;
    border-radius:5px;
    bottom:50px;
    left:50px;
    padding:10px;

    position:fixed;
    z-index:9999;
    width:400px;
  }
`
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!:ElementRef//referencia al al ide de referencia local del  HTML
  map!:mapboxgl.Map;
  zoomLavel:number=16;
  ubicacionActual:[number,number]=[ -74.17076778750781, 11.223452534661256];

  constructor() {}

  ngOnDestroy(): void {
    //destruir los eventos para evitar duplicarlos y consumir recursos
    this.map.off('zoom', ()=>{} );
    this.map.off('zoomend', ()=>{} );
    this.map.off('move', ()=>{} );
  }

  ngAfterViewInit(): void {
   // console.log('afterViewInit', this.divMapa)
    this.map = new mapboxgl.Map({
      container:this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.ubicacionActual,
      zoom:this.zoomLavel,
      });
      //mostrar zoom cuando se precione click en los botones o se use el scroll del mouse
      this.map.on('zoom',(event)=>{
        this.zoomLavel = this.map.getZoom();
      });
      //evitar que el usuario haga un zoom mayor a  19
      this.map.on('zoomend',(event)=>{
        if(this.map.getZoom() > 19){
          this.map.zoomTo( 19 );
        }
      });
      //capturar las coordenadas cuando se haga moviemintos en el mapa
      this.map.on('move',(event)=>{
        const target = event.target;
        const {lng ,lat} = target.getCenter();
        this.ubicacionActual = [lng, lat];
      });
  }

  zoomIn(){
    this.map.zoomIn();
  }

  zoomOut(){
    this.map.zoomOut();
  }
  //mostrar los cambios de porcentajes cuando se interactue el range
  zoomChange(valor:string){
    console.log(valor);
    this.map.zoomTo(Number(valor));
  }



}
