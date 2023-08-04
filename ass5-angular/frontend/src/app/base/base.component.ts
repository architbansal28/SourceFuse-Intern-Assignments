import { Component } from '@angular/core';
import { DataSourceService } from '../data-source.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
  providers: [DataSourceService]
})
export class BaseComponent {
  constructor(
    public dataSourceService: DataSourceService<any>,
    private router: Router
  ) {}

  goToUsers() {
    this.router.navigate(['/users']);
  }

  goToCustomers() {
    this.router.navigate(['/customers']);
  }
  
}
