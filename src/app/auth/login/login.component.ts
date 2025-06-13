import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppSettings } from '../../service/app-settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  // Datos de ejemplo con roles
  usuarios = [
    { email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { email: 'mesero@example.com', password: 'mesero123', role: 'mesero' },
    { email: 'cocinero@example.com', password: 'cocinero123', role: 'cocinero' }
  ];

  constructor(public appSettings: AppSettings, private router: Router) {
    this.appSettings.appEmpty = true;
  }

  ngOnInit(): void {
    console.log('Login component initialized');
  }

  ngOnDestroy(): void {
    this.appSettings.appEmpty = false;
  }

  onSubmit(): void {
    const usuarioEncontrado = this.usuarios.find(
      u => u.email === this.loginData.email && u.password === this.loginData.password
    );

    if (usuarioEncontrado) {
      localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado)); // Guardar usuario en localStorage
      console.log('Login successful:', usuarioEncontrado);
      alert('Login exitoso');
      this.router.navigate(['/home']); // Redirigir a dashboard
    } else {
      console.log('Invalid credentials');
      alert('Credenciales incorrectas');
    }
  }
}
