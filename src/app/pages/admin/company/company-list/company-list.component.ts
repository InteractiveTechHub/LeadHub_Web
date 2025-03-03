import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

import { Company } from '@core/models';
import { FilterRequest } from '@core/requests/filterRequest';
import { CompanyService } from '@core/services';
import { PRIME_NG_MODULES } from '@core/utils';

@Component({
  selector: 'app-company-list',
  imports: [...PRIME_NG_MODULES],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss'
})
export class CompanyListComponent {
  companies: Array<Company> = [];
  totalRecords: number = 0;
  loading: boolean = false;
  selectedCompany!: Company;

  //button control
  activeEditButton: boolean = false;

  constructor(private service: CompanyService,
    private cdr: ChangeDetectorRef,
    private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
  }

  /**
   * Redirect to edit and update company page
   * @returns void
   */
  public editCompany = () => this.router.navigate([`/admin/company/${this.selectedCompany.id}`]);

  /**
   * Load and populate the table.
   * make request to fetch data
   * @param event event from table (filter, sorting, pagination)
   */
  public loadCompanies(event: any): void {
    this.loading = true;

    const filterRequest = this.buildFilter(event.filters);

    const response = this.service.fetchCompanyByRequest(filterRequest);

    response.subscribe(res => {
      this.companies = res.responseData;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  /**
   * Navigates to register company page
   * @returns void
   */
  public registerCompany = () => this.router.navigate(['/admin/company']);

  public showEditButton() {
    this.activeEditButton = !!this.selectedCompany;
  }

  /**
   * Converts table filter to filters request that match with the api filters
   * @param filters table filters to be converted
   * @returns Filter request
   */
  private buildFilter(filters: any) : FilterRequest {
    const filterRequest = new FilterRequest();

    for (const field in filters) {
      for (const filter of filters[field]) {
        if(filter.value) {
          filterRequest.addFilter(field, filter.matchMode, filter.operator, filter.value);
        }
      }
    }

    return filterRequest;
  }
}
