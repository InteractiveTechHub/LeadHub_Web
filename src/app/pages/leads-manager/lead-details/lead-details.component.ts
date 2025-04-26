import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LeadStatus } from '@core/enums/leadStatus';
import { LeadCard } from '@core/models';
import { PRIME_NG_MODULES } from '@core/utils';
import { LeadManagerRepository } from '@repository/index';

@Component({
  selector: 'app-lead-details',
  imports: [ReactiveFormsModule, ...PRIME_NG_MODULES],
  templateUrl: './lead-details.component.html',
  styleUrl: './lead-details.component.scss'
})
export class LeadDetailsComponent implements OnInit, OnChanges {
  @Input() selectedCard!: LeadCard;

  formBuilder: FormBuilder = new FormBuilder();
  leadForm: FormGroup = new FormGroup([]);

  showCloseLeadOptions = false;
  leadStatusSelect = [
    { key: 0, name: 'Selecionar'},
    { key: LeadStatus.closedWon, name: 'Venda Realizada' },
    { key: LeadStatus.closedLost, name: 'Venda Perdida' }
  ];

  /**
   *
   */
  constructor(private leadManagerRepository: LeadManagerRepository) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.showCloseLeadOptions = false;

    this.buildLeadForm();
  }

  public onCancel() : void {
    this.showCloseLeadOptions = false;

    this.leadForm.reset();
  }

  public onCloseLeadClicked() : void {
    this.showCloseLeadOptions = !this.showCloseLeadOptions;
  }

  public onCloseLead() {
    const { status,  note } = this.leadForm.value;
    this.selectedCard.status = status;
    this.selectedCard.saleNote = note;

    this.leadManagerRepository.closeLead(this.selectedCard).subscribe(response => {
    });
  }

  public onLeadCloseSelectChanges(event: any) {
    const value = event.value.key;

    this.leadForm.get('status')?.setValue(value);
  }

  private buildLeadForm() : void {
    this.leadForm = this.formBuilder.group({
      status: [null],
      note: ['']
    });
  }
}
