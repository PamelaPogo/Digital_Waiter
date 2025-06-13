import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Home
import { HomePage } from './pages/home/home';

// Error
import { ErrorPage } from './pages/error/error';
import { UsersComponent } from './pages/users/users.component';
import { MenuPage } from './pages/menu/menu';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { InventarioPage } from './pages/inventario/inventario';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './mesas/dashboard/dashboard.component';
import { OrdenesComponent } from './mesas/ordenes/ordenes.component';
import { GestionComponent } from './mesas/gestion/gestion.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomePage, data: { title: 'Home'} },
  { path: 'users', component: UsersComponent, data: { title: 'Users'} },
  { path: 'menus', component: MenuPage, data: { title: 'menu'} },
  { path: 'proveedores', component: ProveedoresComponent, data: { title: 'proveedores'} },
  { path: 'personal', component: UsersComponent, data: { title: 'personal'} },
  { path: 'inventarios', component: InventarioPage, data: { title: 'inventarios'} },

  { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard'} },
  { path: 'ordenes', component: OrdenesComponent, data: { title: 'Ordenes'} },
  { path: 'mesas', component: GestionComponent, data: { title: 'Mesas'} },


  
	{ path: '**', component: ErrorPage, data: { title: '404 Error'} }
];

@NgModule({
  imports: [ CommonModule, RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})


export class AppRoutingModule { }
