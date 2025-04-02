import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WhatsAppConfig } from '@core/models';
import { FilterRequest } from '@core/requests';
import { PRIME_NG_MODULES } from '@core/utils';
import { WhatsAppRepository } from '@repository/whatsapp.repository';

@Component({
  selector: 'app-channel-list',
  imports: [...PRIME_NG_MODULES],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.scss'
})
export class ChannelListComponent implements OnInit {
  activeEditButton = false;
  loading = false;
  whatsAppConfigList: Array<WhatsAppConfig> = new Array<WhatsAppConfig>();
  selectedWhatsApp!: WhatsAppConfig;

  constructor(private whatsAppRepository: WhatsAppRepository, private router: Router) {
  }

  ngOnInit(): void {
    this.loading = true;
  }

  loadChannels(event: any) {
    this.loading = true;

    const filterRequest = this.buildFilter(event.filters);

    filterRequest.addFilter('CompanyId', 'equals', 'and', 1, 'i');
    const response = this.whatsAppRepository.fetchWhatsAppByRequest(filterRequest);

    response.subscribe(res => {
      for (const integration of res.responseData) {
        // whatsapp
        if (integration.whatsAppConfig)
          this.whatsAppConfigList.push(integration.whatsAppConfig!);

        // other medias ...
      }

      this.loading = false;
      //this.cdr.detectChanges();
    });
  }

  /**
   * Redirect to edit and update company page
   * @returns void
  */
  public editWhatsApp = () => this.router.navigate([`/admin/channel/${this.selectedWhatsApp.id}`]);

  public showEditButton() {
    this.activeEditButton = !!this.selectedWhatsApp;
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
