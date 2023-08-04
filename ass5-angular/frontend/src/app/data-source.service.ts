import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService<T> {
  
  constructor(private http: HttpClient) { 
    console.log('data source service');
    
   }

  fetchData(path: string): Observable<T[]> {
    return this.http.get<T[]>(path);
  }

  processFieldNames(data: T[]): string[] {
    const allFieldNames = new Set<string>();

    data.forEach((user: any) => {
      Object.keys(user).forEach((fieldName) => {
        allFieldNames.add(fieldName);
      });
    });

    return Array.from(allFieldNames);
  }

  getData(path: string): Observable<T[]> {
    return this.http.get<T[]>(path);
  }

  updateData(path: string, data: T): Observable<T> {
    return this.http.put<T>(path, data);
  }

  deleteData(path: string): Observable<void> {
    return this.http.delete<void>(path);
  }
}
