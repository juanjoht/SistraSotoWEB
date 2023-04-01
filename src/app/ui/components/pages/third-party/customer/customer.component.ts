import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/ui/api/product';
import { ProductService } from 'src/app/ui/service/product.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  providers: [MessageService]
})
export class CustomerComponent implements OnInit {
  products: Product[] = [];
  cols: any[] = [];
  statuses: any[] = [];
  selectedProducts: Product[] = [];

  constructor(private productService: ProductService, private messageService: MessageService) { }


  ngOnInit() {
    this.productService.getProducts().then(data => this.products = data);

    this.cols = [
        { field: 'product', header: 'Product' },
        { field: 'price', header: 'Price' },
        { field: 'category', header: 'Category' },
        { field: 'rating', header: 'Reviews' },
        { field: 'inventoryStatus', header: 'Status' }
    ];

    this.statuses = [
        { label: 'INSTOCK', value: 'instock' },
        { label: 'LOWSTOCK', value: 'lowstock' },
        { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];
}
}
