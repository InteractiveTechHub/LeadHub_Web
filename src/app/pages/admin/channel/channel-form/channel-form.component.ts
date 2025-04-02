import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WhatsAppConfig } from '@core/models';
import { FilterRequest } from '@core/requests';
import { PRIME_NG_MODULES } from '@core/utils';
import { WhatsAppTemplateListComponent } from '../shared/whats-app-template-list/whats-app-template-list.component';
import { WhatsAppRepository } from '@repository/whatsapp.repository';

@Component({
  selector: 'app-channel-form',
  imports: [...PRIME_NG_MODULES, ReactiveFormsModule, WhatsAppTemplateListComponent],
  templateUrl: './channel-form.component.html',
  styleUrl: './channel-form.component.scss'
})
export class ChannelFormComponent implements OnInit {

  panelTitle = "Novo WhatsApp";
  whatsAppConfig!: WhatsAppConfig;

  formBuilder: FormBuilder = new FormBuilder();
  whatAppConfigForm: FormGroup = new FormGroup([]);

  /**
   *
   */
  constructor(private route: ActivatedRoute, private whatsAppRepository: WhatsAppRepository) { }

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('id');

    this.buildWhatsAppForm();

    if (companyId) {
      this.panelTitle = 'Editar Configurações'
      const id = Number(companyId);
      this.fetchWhatsAppById(id);
    }
  }

  private buildWhatsAppForm() {
      this.whatAppConfigForm = this.formBuilder.group({
        id: [0],
        name: '',
        businessAccountId: ['', Validators.required],
        phoneNumberId: ['', Validators.required],
        webHookSecret: [''],
        accessToken: ['', Validators.required],
        enabled: [true]
      });
    }

  private fetchWhatsAppById(id: number) {
    const filterRequest = new FilterRequest();
    filterRequest.addFilter('Id', 'equals', 'and', id, 'w');

    const response = this.whatsAppRepository.fetchWhatsAppByRequest(filterRequest);

    response.subscribe(res => {
      if (res.responseData[0].whatsAppConfig) {
        this.whatsAppConfig = res.responseData[0].whatsAppConfig;

        this.populatesCompanyForm(this.whatsAppConfig);
      }
    });
  }

  private populatesCompanyForm(whatsAppConfig: WhatsAppConfig) {
    const { whatsAppTemplates, ...filteredWhatsAppConfig } = whatsAppConfig;

    console.log(filteredWhatsAppConfig)

    this.whatAppConfigForm.setValue(filteredWhatsAppConfig)
  }
}
