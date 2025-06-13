import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AppMenuService {
  getAppMenus() {
    return [{
        'icon': 'fa fa-home', // Icono para Home
        'title': 'Home',
        'url': '/home'
      },
      {
        'icon': 'fa fa-users-cog', // Icono para Gestión de Personal
        'title': 'Gestión de Personal',
        'url': '/personal'
      },
      {
        'icon': 'fa fa-industry', // Icono para Gestión de Proveedores
        'title': 'Gestión de Proveedores',
        'url': '/proveedores'
      },
      {
        'icon': 'fa fa-utensils', // Icono para Gestión de Menús
        'title': 'Gestión de Menús',
        'url': '/menus'
      },
      {
        'icon': 'fa fa-cogs', // Icono alternativo para Gestión de Menús
        'title': 'Inventarios',
        'url': '/inventarios'
      },
      {
        'icon': 'fa fa-cogs', // Icono alternativo para Gestión de Menús
        'title': 'Dashboard',
        'url': '/dashboard'
      }
      ,
      {
        'icon': 'fa fa-cogs', // Icono alternativo para Gestión de Menús
        'title': 'Gestión de mesas',
        'url': '/mesas'
      }
      ,
      {
        'icon': 'fa fa-cogs', // Icono alternativo para Gestión de Menús
        'title': 'Ordenes',
        'url': '/ordenes'
      }];
  }
}
