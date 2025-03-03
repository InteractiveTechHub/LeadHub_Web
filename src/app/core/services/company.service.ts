import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from '@core/models';
import { FilterRequest } from '@core/requests';
import { AddressResponse, CompanyResponse, ModelResponse } from '@core/responses';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}/company`;

  constructor(private httpClient: HttpClient) { }

  createCompany(company: Company) : Observable<any> {
    return this.httpClient.post(this.baseUrl, company);
  }

  /**
   * Fetch companies by request
   * @param filterRequest
   * @returns companies found
   */
  fetchCompanyByRequest(filterRequest: FilterRequest) : Observable<CompanyResponse> {
    return this.httpClient.post<CompanyResponse>(`${this.baseUrl}/fetchall`, filterRequest);
  }

  /**
   * Fetch Brazilian company info by cnpj
   * @param cnpj company CNPJ
   * @returns Brazilain company info
   */
  fetchCompanyDataByCnpj(cnpj: string) : Observable<CompanyResponse> {
    const params = new HttpParams()
      .set('cnpj', cnpj);

    return this.httpClient.get<CompanyResponse>(`${this.baseUrl}/comapnyData`, { params });
  }

  /**
   * Fetch braziliand address by CEP
   * @param cep Address CEP
   * @returns Brazilain address
   */
  fetchCompanyAddressByCEP(cep: string) : Observable<AddressResponse> {
    const params = new HttpParams()
      .set('cep', cep);

    return this.httpClient.get<AddressResponse>(`${this.baseUrl}/companyAddress`, { params });
  }

  /**
   * Update the company
   * @param company company for updating
   * @returns response
   */
  updateCompany(company: Company) {
    return this.httpClient.put<ModelResponse>(`${this.baseUrl}`, company);
  }
}
