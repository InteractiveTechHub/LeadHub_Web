import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Consultant } from '@core/models';
import { FilterRequest } from '@core/requests';
import { PRIME_NG_MODULES } from '@core/utils';
import { ConsultantRepository } from '@repository/consultant.repository';


@Component({
  selector: 'app-consultant-list',
  imports: [
    ...PRIME_NG_MODULES
  ],
  templateUrl: './consultant-list.component.html',
  styleUrl: './consultant-list.component.scss'
})
export class ConsultantListComponent implements OnInit {
  consultants: Array<Consultant> = [];
  selectedConsultant!: Consultant;
  loading = false;

  activeEditButton: boolean = false;
  selectedCompanyId!: number;

  constructor(
    private consultantRepository: ConsultantRepository,
    private cdr: ChangeDetectorRef,
    private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
  }

    /**
   * Redirect to edit and update consultant page
   * @returns void
   */
    public editConsultant() {
      if (this.selectedConsultant) {
        this.router.navigate([`/admin/consultant/${this.selectedConsultant.userIdentity?.id}`]);
      }
    }

  /**
   * Load and populate the table.
   * make request to fetch data
   * @param event event from table (filter, sorting, pagination)
  */
  public loadConsultants(event: any): void {
    this.loading = true;

    const filterRequest = this.buildFilter(event.filters);
    //filterRequest.addFilter('CompanyId', 'equals', 'and', this.selectedCompanyId);

    const response = this.consultantRepository.fetchConsultantByRequest(filterRequest);

    response.subscribe(res => {
      this.consultants = res.responseData;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

    /**
   * Navigates to register consultant page
   * @returns void
   */
    public registerConsultant() {
      this.router.navigate([`/admin/consultant`]);
    }

  public showEditButton() {
    this.activeEditButton = !!this.selectedConsultant;
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
