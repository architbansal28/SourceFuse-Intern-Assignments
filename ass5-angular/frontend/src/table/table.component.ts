import { Component, OnInit } from '@angular/core';
import { DataSourceService } from '../app/data-source.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  tableType: string = '';
  data: any[] = [];
  fieldNames: string[] = [];
  editMode: { [userId: string]: boolean } = {};

  constructor(
    private dataSourceService: DataSourceService<any>,
    private route: ActivatedRoute
  ) {  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.tableType = data['tableType'];
    });

    this.data.forEach((user) => {
      this.editMode[user.id] = false;
    });

    this.loadData();
  }

  loadData() {
    this.dataSourceService.fetchData(`http://localhost:3000/api/${this.tableType}`).subscribe({
      next: (data) => {
        this.data = data;
        this.fieldNames = this.dataSourceService.processFieldNames(data);
        console.log(this.data);
      },
      error: (error) => {
        console.error('Error loading data:', error);
      }
    });
  }

  formatHeader(header: string): string {
    const words = header.split('_');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  toggleEditMode(id: number): void {
    this.editMode[id] = !this.editMode[id];
  }

  deleteRow(user: any): void {
    const id = user.id;
    this.dataSourceService.deleteData(`http://localhost:3000/api/${this.tableType}/${id}`).subscribe({
      next: () => {
        const index = this.data.indexOf(user);
        this.data.splice(index, 1);
        console.log('User deleted');
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      }
    });
  }

  onCellEdit(user: any, fieldName: string, value: any): void {
    const index = this.data.indexOf(user);
    this.data[index][fieldName] = value;
  }

  saveRow(user: any): void {
    const id = user.id;
    this.toggleEditMode(id);
    
    this.dataSourceService.updateData(`http://localhost:3000/api/${this.tableType}/${id}`, user).subscribe({
      next: (data) => {
        console.log('User updated:', data);
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
  }

  cancelEdit(user: any): void {
    const id = user.id;
    this.dataSourceService.getData(`http://localhost:3000/api/${this.tableType}/${id}`).subscribe({
      next: (data: any) => {
        const index = this.data.indexOf(user);        
        Object.keys(data).forEach((fieldName) => {
          this.data[index][fieldName] = data[fieldName];
        }); 
        this.toggleEditMode(id);
        console.log('Changes cancelled for user:', this.data[index]);
      },
      error: (error) => {
        console.error('Error cancelling edit:', error);
      }
    });
  }

}
