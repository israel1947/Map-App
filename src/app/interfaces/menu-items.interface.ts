import * as mapboxgl from 'mapbox-gl';

export interface MenuItems{
    ruta:string;
    nombre:string
}

export interface MarcadorColors{
    color:string;
    marker?:mapboxgl.Marker;
    centro?:[number,number];
}

export interface Propiedad {
    titulo: string;
    descripcion: string;
    lngLat: [number, number];
  }