import { Component} from '@angular/core';
import { MenuItems } from '../../interfaces/menu-items.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [`
      li{
        cursor:pointer;
      }
  `
  ]
})
export class MenuComponent {

  menuItems:MenuItems[]=[
    {
      ruta:'/mapas/Fullscreen',
      nombre:'Fullscreen'
    },
    {
      ruta:'/mapas/zoom-range',
      nombre:'Zoom range'
    },
    {
      ruta:'/mapas/marcadores',
      nombre:'Marcadores'
    },
    {
      ruta:'/mapas/propiedades',
      nombre:'Propiedades'
    }
  ];
}
