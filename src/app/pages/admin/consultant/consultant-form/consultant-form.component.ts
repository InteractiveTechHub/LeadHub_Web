import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RegisterModel } from '@authentication/models';
import { AuthService } from '@authentication/services';
import { Company } from '@core/models';
import { FilterRequest } from '@core/requests';
import { PRIME_NG_MODULES } from '@core/utils';
import { TranslatePipe } from '@ngx-translate/core';
import { CompanyRepository } from '@repository/company.repository';
import { ConsultantRepository } from '@repository/consultant.repository';


@Component({
  selector: 'app-consultant-form',
  standalone: true,
  imports: [
    ...PRIME_NG_MODULES,
    NgClass,
    ReactiveFormsModule,
    TranslatePipe
],
  templateUrl: './consultant-form.component.html',
  styleUrl: './consultant-form.component.scss'
})
export class ConsultantFormComponent implements OnInit {
  formBuilder: FormBuilder = new FormBuilder();
  consultantForm: FormGroup = new FormGroup([]);

  sourceCompanies!: Company[];
  targetCompanies!: Company[];

  companyName: string = "";
  roles: Array<any> = [
    { name: 'SysAdmin'},
    { name: 'Support'},
    { name: 'Owner'},
    { name: 'Manager' },
    { name: 'Consultant' },
  ];

  /**
   * Constructor for the ConsultantFormComponent
   * @param consultantRepository - Service for consultant operations
   * @param companyRepository - Service for company operations
   * @param authService - Service for authentication operations
   * @param route - Angular route service
   * @param cdr - Change detector reference
   */
  constructor(
    private consultantRepository: ConsultantRepository,
    private companyRepository: CompanyRepository,
    private authService: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef) {
  }

  /**
   * Initializes the component and sets up the form
   */
  ngOnInit(): void {
    const consultantIdParams = this.route.snapshot.paramMap.get('id');
    this.targetCompanies = [];

    // first it must build the form
    this.buildConsultantForm();
    this.buildRolesDropdDown();

    this.fetchCompanyByRequest();

    if (consultantIdParams) {
      const consultantId = consultantIdParams;
      this.fetchConsultantId(consultantId);
    }
  }

  /**
   * Handles form submission for creating or updating consultants
   */
  public async submitAsync() {
    if (!this.consultantForm?.valid)
      return;

    const formValues = this.consultantForm?.value;
    const consultantId = formValues.consultantData.id;
    const identityId = formValues.authData.id;

    const registerModel: RegisterModel = {
      id: consultantId,
      identityId: identityId,
      companies: this.targetCompanies,
      email: formValues.authData.email,
      enabled: formValues.consultantData.enabled,
      fullName: formValues.consultantData.fullName,
      nickName: '',
      phoneNumber: formValues.authData.phoneNumber,
      roles: formValues.authData.roles.name,
      userName: formValues.authData.userName,
    }


    if (consultantId || identityId) {
      this.updateConsultant(registerModel);

      return;
    }

    this.createConsultantAsync(registerModel);
  }

  /**
   * Creates a new consultant asynchronously
   * @param registerModel - The consultant data to create
   * @private
   */
  private createConsultantAsync(registerModel: RegisterModel) {

    // create credentials
    const response = this.authService.createAuthenticationAsync(registerModel);

    response.subscribe((res: any) => {
      this.consultantForm.get('consultantData')?.reset();
      this.consultantForm.get('authData')?.reset();
      this.targetCompanies = [];

      this.fetchCompanyByRequest();
    });
  }

  /**
   * Builds the consultant form with validation rules
   * @private
   */
  private buildConsultantForm() {
    this.consultantForm = this.formBuilder.group({
      consultantData: this.formBuilder.group({
        id: [0],
        identityId: [null],
        fullName: ['', Validators.required],
      }),
      authData: this.formBuilder.group({
        id: [''],
        email: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        enabled: [true],
        roles: [this.roles[4], Validators.required],
        userName: ['', Validators.required],
      }),
    });
  }

  /**
   * Builds the roles dropdown based on user permissions
   * @private
   */
  private buildRolesDropdDown() {
    const roleExclusions: { [key: string]: string[] } = {
      isSupport: ['SysAdmin'],
      isOwner: ['SysAdmin', 'Support', 'Owner'],
      isManager: ['SysAdmin', 'Support', 'Owner'],
      isConsultant: []
    };

    Object.keys(roleExclusions).forEach((roleCheck) => {
      if ((this.authService as any)[roleCheck]()) {
        const rolesToExclude = roleExclusions[roleCheck];
        this.roles = this.roles.filter(role => !rolesToExclude.includes(role.name));
      }
    });
  }

  /**
   * Fetches companies for the dropdown
   * @private
   */
  private fetchCompanyByRequest() {
    const filterRequest = new FilterRequest();
    //filterRequest.addFilter();

    const response = this.companyRepository.fetchCompanyByRequest(filterRequest);

    response.subscribe(r => {
      this.sourceCompanies = r.responseData;
      this.cdr.markForCheck();
    });
  }

  /**
   * Fetches consultant data by ID for editing
   * @param consultantId - The consultant ID
   * @private
   */
  private fetchConsultantId(consultantId: string) {
    const filter = new FilterRequest();
    filter.addFilter('Id', 'equals', 'and', consultantId, 'u');

    const response = this.consultantRepository.fetchConsultantByRequest(filter);

    response.subscribe(res => {
      const consultantData = res.responseData[0];
      const selectedRole = this.roles.findIndex(r => r.name === consultantData.userIdentity?.roleName);

      this.consultantForm.get('consultantData')?.patchValue({
        id: consultantData.id || 0,
        identityId: consultantData.userIdentity?.id || null,
        fullName: consultantData.fullName || '',
      });

      // Atualizando os campos de 'authData'
      this.consultantForm.get('authData')?.patchValue({
        id: consultantData.userIdentity?.id || null,
        email: consultantData.userIdentity?.email || '',
        enabled: consultantData.userIdentity?.enabled,
        phoneNumber: consultantData.userIdentity?.phoneNumber || '',
        roles: this.roles[selectedRole] || null,
        userName: consultantData.userIdentity?.userName || '',
      });

      this.targetCompanies = [...consultantData.companies!]
      this.sourceCompanies = this.sourceCompanies.filter(sc =>
        !this.targetCompanies.some(tc => tc.id === sc.id));
    });
  }

  /**
   * Updates an existing consultant
   * @param registerModel - The consultant data to update
   * @private
   */
  private updateConsultant(registerModel: RegisterModel) {
    const response = this.authService.updateCuthenticationAndConsultant(registerModel);

    response.subscribe();
  }
}
