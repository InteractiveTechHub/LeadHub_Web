import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environment/environment";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class SalesPipelineRepository {
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}/salespipeline`;

  constructor(private httpClient: HttpClient) { }

  fetchSalesPepilines() : Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}`);
  }
}
