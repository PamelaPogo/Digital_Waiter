import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Interfaces para mejor tipado
interface Producto {
  id: number;
  name: string;
  description: string;
  price: string;
  category: 'postres' | 'entradas';
}

interface ValidationErrors {
  numeroMesa?: string;
  nombreCliente?: string;
  numeroOrden?: string;
}

interface OrdenCompleta {
  numeroMesa: string;
  nombreCliente: string;
  numeroOrden: string;
  productos: Array<{
    producto: Producto;
    cantidad: number;
    subtotal: number;
  }>;
  subtotal: number;
  impuestos: number;
  total: number;
  fechaCreacion: Date;
  estado: 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';
}

@Component({
  selector: 'app-gestion',
  standalone: false,
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent implements OnInit {
  // Productos del menú con categorías
  _pedido: Producto[] = [
    // Postres
    { id: 2240, name: 'Mil Hojas', description: 'Delicioso postre de hojaldre con crema pastelera', price: '3.50', category: 'postres' },
    { id: 2241, name: 'Tiramisú', description: 'Clásico postre italiano con café y mascarpone', price: '4.25', category: 'postres' },
    { id: 2242, name: 'Cheesecake', description: 'Tarta de queso cremosa con base de galleta', price: '3.75', category: 'postres' },
    { id: 2243, name: 'Brownie', description: 'Brownie de chocolate con nueces', price: '2.50', category: 'postres' },
    { id: 2244, name: 'Flan', description: 'Flan casero con caramelo', price: '2.25', category: 'postres' },
    
    // Entradas
    { id: 2245, name: 'Bruschetta', description: 'Pan tostado con tomate, albahaca y mozzarella', price: '5.50', category: 'entradas' },
    { id: 2246, name: 'Nachos', description: 'Nachos con queso, guacamole y jalapeños', price: '6.75', category: 'entradas' },
    { id: 2247, name: 'Alitas BBQ', description: 'Alitas de pollo en salsa barbacoa', price: '7.25', category: 'entradas' },
    { id: 2248, name: 'Quesadillas', description: 'Quesadillas de pollo con pico de gallo', price: '5.75', category: 'entradas' },
    { id: 2249, name: 'Calamares', description: 'Anillos de calamar rebozados con salsa tártara', price: '8.50', category: 'entradas' }
  ];

  // Estados del componente
  _totalFactura: number = 0;
  _cantidades: { [key: number]: number } = {};
  _mostrarModal: boolean = false;
  _enviandoOrden: boolean = false;
  _categoriaActiva: 'postres' | 'entradas' = 'postres';

  // Datos de la orden
  _numeroMesa: string = '';
  _nombreCliente: string = '';
  _numeroOrden: string = '';

  // Validaciones
  _validationErrors: ValidationErrors = {};

  // Configuración
  private readonly _tasaImpuesto = 0.12; // 12% IVA
  private readonly _maxCantidadProducto = 99;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this._inicializarComponente();
  }

  /**
   * Inicializa el componente y genera datos automáticos
   */
  private _inicializarComponente(): void {
    this._inicializarCantidades();
    this._generarNumeroOrden();
    this._limpiarValidaciones();
  }

  /**
   * Inicializa las cantidades de todos los productos en 0
   */
  private _inicializarCantidades(): void {
    this._pedido.forEach(producto => {
      if (Number.isInteger(producto.id) && producto.id > 0) {
        this._cantidades[producto.id] = 0;
      } else {
        console.error('ID de producto inválido:', producto.id);
      }
    });
  }

  /**
   * Genera un número de orden único
   */
  private _generarNumeroOrden(): void {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this._numeroOrden = `ORD-${timestamp}-${random}`;
  }

  /**
   * Obtiene productos filtrados por categoría activa
   */
  _getProductosPorCategoria(): Producto[] {
    return this._pedido.filter(producto => producto.category === this._categoriaActiva);
  }

  /**
   * Incrementa la cantidad de un producto
   */
  _incrementarCantidad(productId: number): void {
    if (this._cantidades[productId] < this._maxCantidadProducto) {
      this._cantidades[productId] = (this._cantidades[productId] || 0) + 1;
      this._calcularTotal();
    }
  }

  /**
   * Decrementa la cantidad de un producto
   */
  _decrementarCantidad(productId: number): void {
    if (this._cantidades[productId] > 0) {
      this._cantidades[productId]--;
      this._calcularTotal();
    }
  }

  /**
   * Calcula el total de la factura con validaciones mejoradas
   */
  _calcularTotal(): void {
    try {
      // Limpiar cantidades inválidas
      this._limpiarCantidadesInvalidas();
      
      this._totalFactura = this._pedido.reduce((acc, item) => {
        const price = this._parsePrice(item.price);
        const cantidad = this._cantidades[item.id] || 0;

        if (price === null || cantidad < 0) {
          console.warn(`Valores inválidos para ${item.name}: precio=${item.price}, cantidad=${cantidad}`);
          return acc;
        }

        return acc + (price * cantidad);
      }, 0);

      // Redondear a 2 decimales para evitar problemas de precisión
      this._totalFactura = Math.round(this._totalFactura * 100) / 100;
    } catch (error) {
      console.error('Error calculando total:', error);
      this._totalFactura = 0;
    }
  }

  /**
   * Parsea el precio de string a number con validación
   */
  private _parsePrice(price: string): number | null {
    const parsed = parseFloat(price);
    return isNaN(parsed) || parsed < 0 ? null : parsed;
  }

  /**
   * Limpia cantidades inválidas
   */
  private _limpiarCantidadesInvalidas(): void {
    Object.keys(this._cantidades).forEach(key => {
      const numKey = parseInt(key);
      const cantidad = this._cantidades[numKey];
      
      if (isNaN(cantidad) || cantidad < 0) {
        this._cantidades[numKey] = 0;
      } else if (cantidad > this._maxCantidadProducto) {
        this._cantidades[numKey] = this._maxCantidadProducto;
      }
    });
  }

  /**
   * Limpia todo el pedido
   */
  _limpiarPedido(): void {
    if (confirm('¿Estás seguro de que quieres limpiar todo el pedido?')) {
      this._inicializarCantidades();
      this._calcularTotal();
    }
  }

  /**
   * Valida los campos del formulario
   */
  private _validarFormulario(): boolean {
    this._validationErrors = {};
    let isValid = true;

    // Validar número de mesa
    if (!this._numeroMesa?.trim()) {
      this._validationErrors.numeroMesa = 'El número de mesa es requerido';
      isValid = false;
    } else if (!/^\d+$/.test(this._numeroMesa.trim())) {
      this._validationErrors.numeroMesa = 'El número de mesa debe ser un número válido';
      isValid = false;
    } else if (parseInt(this._numeroMesa) <= 0 || parseInt(this._numeroMesa) > 100) {
      this._validationErrors.numeroMesa = 'El número de mesa debe estar entre 1 y 100';
      isValid = false;
    }

    // Validar nombre del cliente
    if (!this._nombreCliente?.trim()) {
      this._validationErrors.nombreCliente = 'El nombre del cliente es requerido';
      isValid = false;
    } else if (this._nombreCliente.trim().length < 2) {
      this._validationErrors.nombreCliente = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    } else if (this._nombreCliente.trim().length > 50) {
      this._validationErrors.nombreCliente = 'El nombre no puede exceder 50 caracteres';
      isValid = false;
    }

    // Validar que hay productos seleccionados
    if (this._totalFactura === 0) {
      alert('Debes seleccionar al menos un producto para crear la orden');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Limpia las validaciones
   */
  private _limpiarValidaciones(): void {
    this._validationErrors = {};
  }

  /**
   * Crea el objeto de orden completa
   */
  private _crearOrdenCompleta(): OrdenCompleta {
    const productosOrden = this._pedido
      .filter(producto => (this._cantidades[producto.id] || 0) > 0)
      .map(producto => ({
        producto,
        cantidad: this._cantidades[producto.id],
        subtotal: this._cantidades[producto.id] * parseFloat(producto.price)
      }));

    const subtotal = this._totalFactura;
    const impuestos = subtotal * this._tasaImpuesto;
    const total = subtotal + impuestos;

    return {
      numeroMesa: this._numeroMesa.trim(),
      nombreCliente: this._nombreCliente.trim(),
      numeroOrden: this._numeroOrden,
      productos: productosOrden,
      subtotal: Math.round(subtotal * 100) / 100,
      impuestos: Math.round(impuestos * 100) / 100,
      total: Math.round(total * 100) / 100,
      fechaCreacion: new Date(),
      estado: 'pendiente'
    };
  }

  /**
   * Envía la orden con validaciones y manejo de errores mejorado
   */
  async _enviarOrden(): Promise<void> {
    try {
      // Validar formulario
      if (!this._validarFormulario()) {
        return;
      }

      this._enviandoOrden = true;
      this._mostrarModal = false;

      // Simular llamada a API
      await this._simularEnvioOrden();

      const ordenCompleta = this._crearOrdenCompleta();
      
      // Guardar en localStorage para simular persistencia
      this._guardarOrdenEnStorage(ordenCompleta);

      // Mostrar mensaje de éxito
      this._mostrarMensajeExito();

      // Limpiar formulario
      this._reiniciarFormulario();

      // Navegar a la lista de órdenes después de un breve delay
      setTimeout(() => {
        this._navegarAListaOrdenes();
      }, 2000);

    } catch (error) {
      console.error('Error enviando orden:', error);
      alert('Error al enviar la orden. Por favor, intenta nuevamente.');
    } finally {
      this._enviandoOrden = false;
    }
  }

  /**
   * Simula el envío de la orden al servidor
   */
  private _simularEnvioOrden(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular posible error de red (5% de probabilidad)
        if (Math.random() < 0.05) {
          reject(new Error('Error de conexión'));
        } else {
          resolve();
        }
      }, 1500); // Simular delay de red
    });
  }

  /**
   * Guarda la orden en localStorage
   */
  private _guardarOrdenEnStorage(orden: OrdenCompleta): void {
    try {
      const ordenesExistentes = JSON.parse(localStorage.getItem('ordenes') || '[]');
      ordenesExistentes.push(orden);
      localStorage.setItem('ordenes', JSON.stringify(ordenesExistentes));
    } catch (error) {
      console.error('Error guardando orden en storage:', error);
    }
  }

  /**
   * Muestra mensaje de éxito
   */
  private _mostrarMensajeExito(): void {
    // Crear y mostrar notificación de éxito
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="icon">✅</span>
        <span class="message">¡Orden enviada exitosamente!</span>
        <span class="sub-message">Redirigiendo a la lista de órdenes...</span>
      </div>
    `;
    
    // Estilos inline para la notificación
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 2000;
      animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Remover notificación después de 3 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  /**
   * Reinicia el formulario después de enviar la orden
   */
  private _reiniciarFormulario(): void {
    this._numeroMesa = '';
    this._nombreCliente = '';
    this._generarNumeroOrden();
    this._inicializarCantidades();
    this._calcularTotal();
    this._limpiarValidaciones();
    this._categoriaActiva = 'postres';
  }

  /**
   * Navega a la lista de órdenes
   */
  private _navegarAListaOrdenes(): void {
    // Asumiendo que la ruta de la lista de órdenes es '/ordenes'
    this.router.navigate(['/ordenes']).catch(error => {
      console.error('Error navegando a órdenes:', error);
      // Fallback: recargar la página actual o navegar a una ruta conocida
      window.location.href = '/ordenes';
    });
  }

  /**
   * Cancela la creación de la orden
   */
  _cancelarOrden(): void {
    if (this._totalFactura > 0) {
      const confirmar = confirm('¿Estás seguro de que quieres cancelar? Se perderán todos los cambios.');
      if (!confirmar) return;
    }
    
    this._navegarAListaOrdenes();
  }

  /**
   * Cierra el modal de manera segura
   */
  _closeModal(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target?.classList.contains('modal-overlay')) {
      this._mostrarModal = false;
    }
  }

  /**
   * Manejo de cambios en inputs de cantidad
   */
  _onCantidadChange(productId: number, event: any): void {
    const value = parseInt(event.target.value) || 0;
    
    if (value < 0) {
      this._cantidades[productId] = 0;
    } else if (value > this._maxCantidadProducto) {
      this._cantidades[productId] = this._maxCantidadProducto;
    } else {
      this._cantidades[productId] = value;
    }
    
    this._calcularTotal();
  }

  /**
   * Getter para obtener el total con impuestos
   */
  get _totalConImpuestos(): number {
    return Math.round((this._totalFactura * (1 + this._tasaImpuesto)) * 100) / 100;
  }

  /**
   * Getter para obtener solo los impuestos
   */
  get _impuestos(): number {
    return Math.round((this._totalFactura * this._tasaImpuesto) * 100) / 100;
  }

  /**
   * Getter para verificar si hay productos en el pedido
   */
  get _tieneProductos(): boolean {
    return Object.values(this._cantidades).some(cantidad => cantidad > 0);
  }

  /**
   * Getter para obtener el número de productos únicos en el pedido
   */
  get _numeroProductos(): number {
    return Object.values(this._cantidades).filter(cantidad => cantidad > 0).length;
  }

  /**
   * Getter para obtener el número total de items en el pedido
   */
  get _totalItems(): number {
    return Object.values(this._cantidades).reduce((total, cantidad) => total + cantidad, 0);
  }
}