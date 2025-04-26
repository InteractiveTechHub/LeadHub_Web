import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Address, Company } from '@core/models';
import { FilterRequest } from '@core/requests';
import { PRIME_NG_MODULES } from '@core/utils';
import { TranslatePipe } from '@ngx-translate/core';
import { CompanyRepository } from '@repository/index';

@Component({
  selector: 'app-company-form',
  imports: [
    ...PRIME_NG_MODULES,
    ReactiveFormsModule,
    NgClass,
    TranslatePipe
  ],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss'
})
export class CompanyFormComponent implements OnInit {

  formBuilder: FormBuilder = new FormBuilder();
  companyForm: FormGroup = new FormGroup([]);

  panelTitle: string = 'Cadastro de Empresa'

  constructor(private route: ActivatedRoute, private companyRepository: CompanyRepository) { }

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('id');

    this.buildCompanyForm();

    if (companyId) {
      this.panelTitle = 'Editar Empresa'
      const id = Number(companyId);
      this.fetchCompanyById(id);
    }
  }

  public submit() {
    if (!this.companyForm?.valid)
      return;

    const formValues = this.companyForm?.value;

    const company: Company = { ...formValues.companyData };
    company.address = { ...formValues.addressData };

    if (company.id) {
      this.updateComapny(company);

      return;
    }

    this.createCompany(company);
  }

  public createCompany(company: Company) {

    const response = this.companyRepository.createCompany(company);

    response.subscribe(res => {
      this.companyForm.reset();
    });
  }

  public searchCompany() {
    const cnpj = this.companyForm.get('companyData.identificationNumber')?.value;

    this.companyRepository.fetchCompanyDataByCnpj(cnpj).subscribe(response => {
      if (response.model)
        this.populatesCompanyForm(response.model);
    });
  }

  public searchAddressByCEP() {
    const cep = this.companyForm.get('addressData.zipCode')?.value;

    const response = this.companyRepository.fetchCompanyAddressByCEP(cep);

    response.subscribe(resp => {
      if (resp.model) {
        this.populatesAddressForm(resp.model);
      }
    });
  }

  private buildCompanyForm() {
    this.companyForm = this.formBuilder.group({
      companyData: this.formBuilder.group({
        id: [0],
        enabled: [true],
        legalName: ['', Validators.required],
        brandName: ['', Validators.required],
        identificationNumber: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        email: ['', Validators.required],
      }),
      addressData: this.formBuilder.group({
        id: [0],
        companyId: [0],
        zipCode: ['', Validators.required],
        state: ['', Validators.required],
        city: ['', Validators.required],
        street: ['', Validators.required],
        neighborhood: ['', Validators.required],
        number: [''],
      })
    });
  }

  public updateComapny(company: Company) {
    if (!company.address?.companyId) {
      //company.address?.companyId = company.id
    }

    this.companyRepository.updateCompany(company).subscribe();
  }

  /**
   * Fetch company by Id
   * @param companyId company id
   */
  private fetchCompanyById(companyId: number) {
    const filter = new FilterRequest();
    filter.addFilter('Id', 'equals', 'and', companyId, 'c');

    const response = this.companyRepository.fetchCompanyByRequest(filter);

    response.subscribe(res => {
      const model: Company = res.responseData[0];

      if (model) {
        this.populatesCompanyForm(model);
      }

      if (model.address) {
        this.populatesAddressForm(model.address);
      }
    });
  }

  /**
   * Populates address form fields
   * @param address address data
   */
  private populatesAddressForm(address: Address) {
    this.companyForm.get('addressData')?.setValue(address);
  }

  /**
   * Populates company form fields
   * @param company company data
   */
  private populatesCompanyForm(company: Company) {
    const { address, ...companyData } = company;

    companyData.enabled = this.companyForm.get('companyData')?.get('enabled')?.value
    this.companyForm.get('companyData')?.setValue(companyData)
  }
}
