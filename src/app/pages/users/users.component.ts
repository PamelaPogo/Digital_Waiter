import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss', '../../../scss/cards/cards.scss'],
  standalone: false,
})
export class UsersComponent implements OnInit {
  // Array de usuarios para mostrar en las tarjetas
  users = [
    {
      name: 'Vegeta',
      description: 'Proveedor de productos para la cocina.',
      profileImage: '../../../assets/img/theme/vegeta.png',
      hoverImage: '../../../assets/img/theme/vegeta2.png',
      Role: 'Administrador'
    },
    {
      name: 'Gohan',
      description: 'Proveedor de productos para el área de servicio.',
      profileImage: '../../../assets/img/theme/gohan.png',
      hoverImage: '../../../assets/img/theme/gohan2.png',
      showFullDescription: false,
      Role: 'Servicio'
    },
  ];

  // Variable para almacenar el usuario seleccionado para edición o nuevo usuario
  selectedUser: any = {};
  isEditMode: boolean = false;

  // Referencia al modal
  @ViewChild('addModal') addModalRef: ElementRef;
  @ViewChild('editModal') editModalRef: ElementRef;
  @ViewChild('deleteModal') deleteModalRef: ElementRef;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  // Función para cambiar la imagen de la tarjeta cuando el mouse entra
  onMouseEnter(i: number): void {
    const cardImage = document.querySelector(`#card-img-${i}`) as HTMLElement;
    cardImage.style.backgroundImage = `url(${this.users[i].hoverImage})`;
  }

  // Función para restaurar la imagen cuando el mouse sale
  onMouseLeave(i: number): void {
    const cardImage = document.querySelector(`#card-img-${i}`) as HTMLElement;
    cardImage.style.backgroundImage = `url(${this.users[i].profileImage})`;
  }

  // Función para abrir el modal de agregar o editar
  openModal(user: any): void {
    if (user) {
      // Editar usuario
      this.isEditMode = true;
      this.selectedUser = { ...user };
      const modal = new bootstrap.Modal(this.editModalRef.nativeElement);
      modal.show();
    } else {
      // Agregar nuevo usuario
      this.isEditMode = false;
      this.selectedUser = {
        name: '',
        description: '',
        profileImage: '',
        hoverImage: '',
        Role: ''
      };
      const modal = new bootstrap.Modal(this.addModalRef.nativeElement);
      modal.show();
    }
  }

  // Cerrar el modal
  closeModal(): void {
    const modal = bootstrap.Modal.getInstance(this.addModalRef.nativeElement) || bootstrap.Modal.getInstance(this.editModalRef.nativeElement);
    modal.hide();
  }

  // Función para agregar un nuevo usuario
  addUser(): void {
    if (this.selectedUser.name && this.selectedUser.description) {
      this.users.push({ ...this.selectedUser });
      this.cdRef.detectChanges();
      this.closeModal();
    } else {
      alert('Debe completar todos los campos.');
    }
  }

  // Función para actualizar un usuario existente
  updateUser(): void {
    if (this.selectedUser.name && this.selectedUser.description) {
      const index = this.users.findIndex(user => user.name === this.selectedUser.name);
      if (index !== -1) {
        this.users[index] = { ...this.selectedUser };
      }
      this.cdRef.detectChanges();
      this.closeModal();
    } else {
      alert('Debe completar todos los campos.');
    }
  }

  // Función para confirmar la eliminación de un usuario
  confirmDelete(user: any): void {
    this.selectedUser = user;
    const modal = new bootstrap.Modal(this.deleteModalRef.nativeElement);
    modal.show();
  }

  // Función para eliminar un usuario
  deleteUser(): void {
    const index = this.users.findIndex(u => u.name === this.selectedUser.name);
    if (index !== -1) {
      this.users.splice(index, 1);
      this.cdRef.detectChanges();
    }
    this.closeDeleteModal();
  }

  // Función para cerrar el modal de eliminación
  closeDeleteModal(): void {
    const modal = bootstrap.Modal.getInstance(this.deleteModalRef.nativeElement);
    if (modal) {
      modal.hide();
    }
  }

  onProfileImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedUser.profileImage = reader.result as string; // Usar el resultado como URL de la imagen
      };
      reader.readAsDataURL(file);
    }
  }
  
  onHoverImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedUser.hoverImage = reader.result as string; // Usar el resultado como URL de la imagen
      };
      reader.readAsDataURL(file);
    }
  }
  
}
