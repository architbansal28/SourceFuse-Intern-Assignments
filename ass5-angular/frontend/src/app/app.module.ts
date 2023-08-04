import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from '../table/table.module';

import { AppComponent } from './app.component';
import { DataSourceService } from './data-source.service';
import { BaseComponent } from './base/base.component';
import { TableComponent } from 'src/table/table.component';

const routes: Routes = [
  { path: 'users', component: TableComponent, data: { tableType: 'users' } },
  { path: 'customers', component: TableComponent, data: { tableType: 'customers' } }
];

@NgModule({
  declarations: [
    AppComponent, 
    BaseComponent
  ],
  imports: [
    BrowserModule,
    TableModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  //providers: [DataSourceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
