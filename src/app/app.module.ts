// Core Module
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule }               from '@angular/platform-browser/animations';
import { BrowserModule, Title }                  from '@angular/platform-browser';
import { HttpClientModule }                      from '@angular/common/http';
import { AppRoutingModule }                      from './app-routing.module';
import { NgModule }                              from '@angular/core';
import { FormsModule, ReactiveFormsModule }      from '@angular/forms'

// Main Component
import { AppComponent }                    from './app.component';
import { HeaderComponent }                 from './components/header/header.component';
import { SidebarComponent }                from './components/sidebar/sidebar.component';
import { SidebarRightComponent }           from './components/sidebar-right/sidebar-right.component';
import { TopMenuComponent }                from './components/top-menu/top-menu.component';
import { PanelComponent }                  from './components/panel/panel.component';
import { FloatSubMenuComponent }           from './components/float-sub-menu/float-sub-menu.component';
import { ThemePanelComponent }             from './components/theme-panel/theme-panel.component';

// Component Module
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar';

// Pages
import { HomePage }          from './pages/home/home';
import { UsersComponent } from './pages/users/users.component';
// Error
import { ErrorPage }          from './pages/error/error';
import { MenuPage } from './pages/menu/menu';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { InventarioPage } from './pages/inventario/inventario';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './mesas/dashboard/dashboard.component';
import { GestionComponent } from './mesas/gestion/gestion.component';
import { OrdenesComponent } from './mesas/ordenes/ordenes.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    SidebarRightComponent,
    TopMenuComponent,
    PanelComponent,
    FloatSubMenuComponent,
    ThemePanelComponent,
    InventarioPage,
    HomePage,
    UsersComponent,
    ErrorPage,
    MenuPage,
    ProveedoresComponent,
    
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    GestionComponent,
    OrdenesComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    FormsModule,
    
  ],
  providers: [ Title, {
		provide: NG_SCROLLBAR_OPTIONS,
		useValue: {
			visibility: 'hover'
		}
  }],
  bootstrap: [ AppComponent, FormsModule ]
})

export class AppModule {
  constructor(private router: Router, private titleService: Title, private route: ActivatedRoute) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        var title = 'Color Admin | ' + this.route.snapshot.firstChild.data['title'];
        this.titleService.setTitle(title);
      }
    });
  }
}
