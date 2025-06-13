import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppSettings } from '../../service/app-settings.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  // Datos del formulario de registro
  user = {
    firstName: '',
    lastName: '',
    email: '',
    reEmail: '',
    password: '',
    termsAccepted: false
  };

  // Datos de ejemplo para la validación de los campos
  emails: string[] = ['user1@example.com', 'user2@example.com', 'user3@example.com'];

  constructor(public appSettings: AppSettings) {
    this.appSettings.appEmpty = true;
  }

  ngOnInit(): void {
    // Inicialización del componente
    console.log('Register component initialized');
  }

  ngOnDestroy(): void {
    // Limpieza cuando se destruye el componente
    this.appSettings.appEmpty = false;
  }

  onSubmit(): void {
    // Lógica para registrar al usuario
    if (this.validateEmail() && this.validatePassword()) {
      console.log('Registration successful');
      alert('Registration successful');
      // Aquí podrías agregar la lógica para enviar los datos al servidor
    } else {
      console.log('Invalid email or password');
      alert('Invalid email or password');
    }
  }

  // Método para validar el email
  validateEmail(): boolean {
    // Asegúrate de que el email sea válido y no esté en uso
    if (this.user.email !== this.user.reEmail) {
      alert('Emails do not match');
      return false;
    }
    return !this.emails.includes(this.user.email);
  }

  // Método para validar la contraseña
  validatePassword(): boolean {
    // Aquí puedes agregar más reglas de validación de la contraseña
    if (this.user.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return false;
    }
    return true;
  }
}
