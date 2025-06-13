import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.html',
  styleUrls: ['./inventario.component.scss'],
  standalone: false
})
export class InventarioPage implements OnInit {
  products: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  paginatedProducts: any[] = [];

  showAddProductForm: boolean = false;
  newProduct: any = {};

  constructor() {
    console.log('Constructor de InventarioPage ejecutado');
  }

  ngOnInit(): void {
    console.log('ngOnInit de InventarioPage ejecutado');
    this.loadProducts();
  }

  loadProducts() {
    console.log('loadProducts() ejecutado y cargando datos...');
    const simulatedProducts = [
      {
        id: 1,
        name: 'Arroz Rico',
        inventory: 10,
        type: 'Carbohidratos',
        vendor: 'Juan Pérez',
        image: 'https://ricoarroz.ec/wp-content/uploads/2024/06/Rico-Arroz-100libs-Mockup-2024-1-1.png'
      },
      {
        id: 2,
        name: 'Pollo',
        inventory: 5,
        type: 'Proteína',
        vendor: 'Pedro González',
        image: 'https://avinews.com/wp-content/uploads/2023/07/EEUU-precio-pollo-de-engorde.png'
      },
      {
        id: 3,
        name: 'Leche Entera',
        inventory: 15,
        type: 'Lácteos',
        vendor: 'María López',
        image: 'https://trualimentos.com/images/_/leche-entera/leche-entera-es-generacion-tru-en-ecuador.png'
      },
      {
        id: 4,
        name: 'Manzanas Rojas',
        inventory: 20,
        type: 'Frutas',
        vendor: 'Frutas Frescas',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI_MiKtrXN9ui2ld0S_BjjHQ7JvByr1R5ZbA&s'
      },
      {
        id: 5,
        name: 'Pan Integral',
        inventory: 8,
        type: 'Panadería',
        vendor: 'Panadería La Espiga',
        image: 'https://www.infobae.com/resizer/v2/PK77XOCX4ZAVFI5AUF3DZRBJNY.jpg?auth=76e68dbb00155c439af1eac05a63dda69fdeef55b11e7a7a33353066e2844d20&smart=true&width=350&height=197&quality=85'
      },
      {
        id: 6,
        name: 'Aceite de Girasol',
        inventory: 7,
        type: 'Aceites',
        vendor: 'El Buen Sabor',
        image: 'https://www.lafabril.com.ec/wp-content/uploads/2017/07/Girasol-Clasico-1L.png'
      }
    ];

    this.products = simulatedProducts;
    this.totalItems = this.products.length;
    this.calculateTotalPages();
    this.paginateProducts();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  paginateProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedProducts = this.products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateProducts();
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  cancelar(): void {
    if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los cambios no guardados.')) {
      console.log('Operación cancelada');
    }
  }

  Agregar(): void {
    this.showAddProductForm = true;
    this.newProduct = {
      name: '',
      inventory: null,
      type: '',
      vendor: '',
      image: 'https://placehold.co/50x50/6c757d/ffffff?text=Nuevo'
    };
  }

  saveProduct(form?: NgForm): void {
    console.log('Form válido:', form?.valid);
    console.log('Datos del producto:', this.newProduct);

    if (form && !form.valid) {
      alert('Por favor, completa todos los campos del producto.');
      return;
    }

    if (this.newProduct.id) {
      const index = this.products.findIndex(p => p.id === this.newProduct.id);
      if (index !== -1) {
        this.products[index] = { ...this.newProduct };
        alert('Producto actualizado correctamente');
      }
    } else {
      const nextId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
      const newProd = {
        id: nextId,
        name: this.newProduct.name,
        inventory: this.newProduct.inventory,
        type: this.newProduct.type,
        vendor: this.newProduct.vendor,
        image: this.newProduct.image || 'https://placehold.co/50x50/6c757d/ffffff?text=Nuevo'
      };

      this.products.push(newProd);
      alert('Producto agregado correctamente');

      this.totalItems = this.products.length;
      this.calculateTotalPages();
      this.currentPage = this.totalPages;
      this.paginateProducts();
    }

    this.showAddProductForm = false;
    this.newProduct = {
      name: '',
      inventory: null,
      type: '',
      vendor: '',
      image: ''
    };
  }

  cancelAddProduct(): void {
    if (confirm('¿Estás seguro de que deseas cancelar la operación? Los datos no se guardarán.')) {
      this.showAddProductForm = false;
      this.newProduct = {};
    }
  }

  editProduct(product: any): void {
    console.log('Editando producto:', product);
    this.newProduct = { ...product };
    this.showAddProductForm = true;
    alert(`Editando producto: ${product.name}`);
  }

  deleteProduct(productId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const initialProductsLength = this.products.length;
      this.products = this.products.filter(p => p.id !== productId);

      if (this.products.length < initialProductsLength) {
        this.totalItems = this.products.length;
        this.calculateTotalPages();

        if (this.currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPage = this.totalPages;
        } else if (this.totalPages === 0) {
          this.currentPage = 1;
        }

        this.paginateProducts();
        alert('Producto eliminado correctamente');
      }
    }
  }

  Math = Math;
}
