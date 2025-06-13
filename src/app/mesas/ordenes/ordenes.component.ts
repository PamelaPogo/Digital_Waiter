import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import * as bootstrap from 'bootstrap';

interface Order {
  id: string;
  table: number;
  client: string;
  status: string;
  mensaje: string;
}

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss'],
  standalone: false
})
export class OrdenesComponent implements OnInit {
 
  
  @ViewChild('editModal', { static: true }) editModal!: ElementRef;
  @ViewChild('deleteModal', { static: true }) deleteModal!: ElementRef;

  // Datos
  orders: Order[] = [
    {
      id: 'ORD-001',
      table: 5,
      client: 'Juan Pérez',
      status: 'ENVIADO A COCINA',
      mensaje: 'Sin cebolla por favor'
    },
    {
      id: 'ORD-002',
      table: 12,
      client: 'María García',
      status: 'LISTO PARA DESPACHO',
      mensaje: 'Urgente'
    },
    {
      id: 'ORD-003',
      table: 8,
      client: 'Carlos López',
      status: 'ENTREGADO',
      mensaje: 'Todo perfecto'
    },
    {
      id: 'ORD-004',
      table: 3,
      client: 'Ana Martínez',
      status: 'ENVIADO A COCINA',
      mensaje: 'Extra queso'
    }
  ];

  filteredOrders: Order[] = [];
  selectedFilter: string = '';
  currentEditingOrder: Order | null = null;
  currentDeletingOrder: Order | null = null;
  isLoading: boolean = false;

  // Formulario de edición
  editForm = {
    id: '',
    table: 0,
    client: '',
    status: 'ENVIADO A COCINA' as Order['status'],
    mensaje: ''
  };

  ngOnInit(): void {
    this.filteredOrders = [...this.orders];
  }

  // Obtener clase CSS para el estado
  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
  }

  // Obtener icono para el estado
  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'ENVIADO A COCINA': 'fas fa-utensils',
      'LISTO PARA DESPACHO': 'fas fa-check-circle',
      'ENTREGADO': 'fas fa-truck'
    };
    return icons[status] || 'fas fa-info-circle';
  }

  // Filtrar órdenes
  filterOrders(): void {
    if (this.selectedFilter) {
      this.filteredOrders = this.orders.filter(order => 
        order.status === this.selectedFilter
      );
    } else {
      this.filteredOrders = [...this.orders];
    }
  }

  // Actualizar órdenes
  refreshOrders(): void {
    this.isLoading = true;
    
    // Simular llamada a API
    setTimeout(() => {
      // Aquí harías la llamada real a tu servicio
      // this.orderService.getOrders().subscribe(orders => {
      //   this.orders = orders;
      //   this.filterOrders();
      //   this.isLoading = false;
      // });
      
      this.filterOrders();
      this.isLoading = false;
    }, 1000);
  }

  // Abrir modal de edición
  openEditModal(order: Order): void {
    this.currentEditingOrder = { ...order };
    
    this.editForm = {
      id: order.id,
      table: order.table,
      client: order.client,
      status: order.status,
      mensaje: order.mensaje
    };

    this.showModal('editModal');
  }

  // Abrir modal de eliminación
  openDeleteModal(order: Order): void {
    this.currentDeletingOrder = order;
    this.showModal('deleteModal');
  }

  // Cerrar modal
  closeModal(modalId: string): void {
    this.hideModal(modalId);
    this.currentEditingOrder = null;
    this.currentDeletingOrder = null;
  }

  // Guardar cambios en la orden
  updateOrder(): void {
    if (!this.currentEditingOrder) return;

    const index = this.orders.findIndex(o => o.id === this.currentEditingOrder!.id);
    
    if (index > -1) {
      this.orders[index] = {
        ...this.currentEditingOrder,
        table: this.editForm.table,
        client: this.editForm.client,
        status: this.editForm.status,
        mensaje: this.editForm.mensaje
      };

      // Aquí harías la llamada a tu servicio para actualizar en el backend
      // this.orderService.updateOrder(this.orders[index]).subscribe(
      //   response => {
      //     console.log('Orden actualizada exitosamente');
      //   },
      //   error => {
      //     console.error('Error al actualizar la orden', error);
      //   }
      // );

      this.filterOrders();
      this.closeModal('editModal');
      this.showSuccessMessage('Orden actualizada exitosamente');
    }
  }

  // Eliminar orden
  deleteOrder(): void {
    if (!this.currentDeletingOrder) return;

    const index = this.orders.findIndex(o => o.id === this.currentDeletingOrder!.id);
    
    if (index > -1) {
      // Aquí harías la llamada a tu servicio para eliminar en el backend
      // this.orderService.deleteOrder(this.currentDeletingOrder.id).subscribe(
      //   response => {
      //     this.orders.splice(index, 1);
      //     this.filterOrders();
      //     this.closeModal('deleteModal');
      //     this.showSuccessMessage('Orden eliminada exitosamente');
      //   },
      //   error => {
      //     console.error('Error al eliminar la orden', error);
      //   }
      // );

      this.orders.splice(index, 1);
      this.filterOrders();
      this.closeModal('deleteModal');
      this.showSuccessMessage('Orden eliminada exitosamente');
    }
  }

  // Validar formulario
  isFormValid(): boolean {
    return this.editForm.table > 0 && 
           this.editForm.client.trim() !== '' && 
           this.editForm.mensaje.trim() !== '';
  }

  // Utilidades para manejo de modales
  private showModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  }

  private hideModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  }

  // Mostrar mensaje de éxito (puedes reemplazar con tu sistema de notificaciones)
  private showSuccessMessage(message: string): void {
    // Implementa tu sistema de notificaciones aquí
    // Por ejemplo, usando Angular Material Snackbar:
    // this.snackBar.open(message, 'Cerrar', { duration: 3000 });
    
    // Por ahora, usamos alert (reemplaza esto)
    alert(message);
  }

  // Manejar clics fuera del modal
  onModalOverlayClick(event: Event, modalId: string): void {
    if (event.target === event.currentTarget) {
      this.closeModal(modalId);
    }
  }

  // Obtener número total de órdenes
  getTotalOrders(): number {
    return this.orders.length;
  }

  // Obtener órdenes por estado
  getOrdersByStatus(status: string): number {
    return this.orders.filter(order => order.status === status).length;
  }

  // Verificar si hay órdenes filtradas
  hasFilteredOrders(): boolean {
    return this.filteredOrders.length > 0;
  }

  // Limpiar filtros
  clearFilters(): void {
    this.selectedFilter = '';
    this.filterOrders();
  }
  
}
