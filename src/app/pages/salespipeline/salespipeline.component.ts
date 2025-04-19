import { CdkDragDrop, transferArrayItem, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PRIME_NG_MODULES } from '@core/utils';
import { SalesPipelineRepository } from '@repository/index';
import { PipelineStage, SalesPipeline } from '@core/interfaces';
import { LeadStage } from '@core/interfaces';
import { DateFormaterService } from '@core/services/date-formater.service';
import { DatePipe } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { FilterRequest } from '@core/requests';


@Component({
  selector: 'app-salespipeline',
  imports: [DragDropModule, FormsModule, ScrollingModule, ReactiveFormsModule, ...PRIME_NG_MODULES],
  providers: [DatePipe, DateFormaterService],
  templateUrl: './salespipeline.component.html',
  styleUrl: './salespipeline.component.scss'
})
export class SalespipelineComponent implements OnInit {

  pipelines!: SalesPipeline[];
  selectedPipeline!: SalesPipeline;
  clonedPipelines: { [s: string]: SalesPipeline } = {};
  openPipeEdit = false;

  pipelineStages!: PipelineStage[];
  clonedPipelineStage: { [s: string]: PipelineStage } = {};
  openStageEdit = false;
  openAddStageDialog = false;

  items: MenuItem[] = [];

  pipeline = {};
  enableNewPipelineDialog = false;

  formBuilder: FormBuilder = new FormBuilder();
  pipeForm: FormGroup = new FormGroup([]);

  /**
   *
   */
  constructor(private pipelineRepository: SalesPipelineRepository,
    private dateService: DateFormaterService) {
  }

  ngOnInit(): void {
    //TODO: If consultant, should display only his/her pipelines
    const filterRequest = new FilterRequest();
    filterRequest.addFilter('CompanyId', 'equals', 'and', 1);
    filterRequest.addFilter('ConsultantId', 'equals', 'and', 1)

    this.pipelineRepository.fetchSalesPepilineByRequest(filterRequest).subscribe(response => {
      if(response.responseData.length) {
        this.buildPipeMenuList(response.responseData);

        const { id } = response.responseData[0];
        this.pipelines = response.responseData;

        this.fetchSalesPipelineById(id);
      }
    });
  }

  //#region Pipeline stages
  public DateFormat(date: Date) {
    return this.dateService.getDateLabel(date);
  }

  public drop(event: CdkDragDrop<LeadStage[]>) {
    let targetStageId: number | null = null;

    const sourceStage = this.selectedPipeline.stages.find(
      stage => stage.leads === event.previousContainer.data
    );

    const targetStage = this.selectedPipeline.stages.find(
      stage => stage.leads === event.container.data
    );

    if (event.previousContainer === event.container) {
      // Order within the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {
      // Move between the column
      const movedLead = event.previousContainer.data[event.previousIndex];
      const newStage = this.selectedPipeline.stages.find(stage => stage.leads === event.container.data);

      movedLead.pipelineStageId = newStage!.id;
      targetStageId = newStage!.id;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    // register the change of the order of target stage;
    targetStage!.leads.forEach((lead, index) => {
      lead.position = index;
    });

    // register the change of the order source
    if (sourceStage &&  sourceStage !== targetStage && sourceStage.leads.length) {
      sourceStage.leads.forEach((lead, index) => {
        lead.position = index;
      });

      this.updateLeadStage(sourceStage.leads, sourceStage.id);
    }

    this.updateLeadStage(targetStage!.leads, targetStageId);
  }

  private updateLeadStage(leadStage: LeadStage[], stageId: number | null) {
    this.pipelineRepository.updateLeadStage(leadStage, stageId).subscribe();
  }
  //#endregion

  //#region Pipelines (menu)
  private buildPipeMenuList(pipelines: SalesPipeline[]) {
    this.items = [];

    pipelines.forEach((pipe) => {
      this.items.push({
        label: pipe.name,
        icon: 'pi pi-filter',
        command: () => this.fetchSalesPipelineById(pipe.id)
      });
    })
  }

  private fetchSalesPipelineById(id: number) {
    this.pipelineRepository.fetchSalesPepilineById(id).subscribe(r => {
      this.selectedPipeline = r.model;
    });
  }
  //#endregion

  public editSalesPipelines() {
    this.openPipeEdit = !this.openPipeEdit;
  }

//TODO: Creates a component for this dialogs
  //#region Dialogs
  onRowEditInit(pipeline: SalesPipeline) {
    this.clonedPipelines[pipeline.id] = { ...pipeline };
  }

  public onRowEditSave(pipeline: SalesPipeline) {
    if (pipeline.id == this.selectedPipeline.id)
      this.selectedPipeline.name = pipeline.name;

    this.pipelines.forEach(pipe => {
      if (pipe.id === pipeline.id) {
        pipe = pipeline;
      }
    });

    this.buildPipeMenuList(this.pipelines);

    delete this.clonedPipelines[pipeline.id];

    this.pipelineRepository.updateSalesPepilines([pipeline]).subscribe();
  }

  public onRowEditCancel(pipeline: SalesPipeline, index: number) {
    this.pipelines[index] = this.clonedPipelines[pipeline.id];
    delete this.clonedPipelines[pipeline.id];
  }

  public openDialogNewPipeline() {
    this.pipeline = {};
    this.buildPipelineForm();
    this.enableNewPipelineDialog = true;
  }

  public hideDialog = () => this.enableNewPipelineDialog = false;

  public savePipeline() {
    if (this.pipeForm.invalid) {
      this.pipeForm.markAllAsTouched();

      return;
    }

    const pipeline: SalesPipeline = this.pipeForm.value;

    // TODO: Recover user logged or maybe its possible to address to all consultants or one especific consultant
    // but just the manager could do it.
    pipeline.companyId = 1;
    pipeline.consultantId = 1;

    this.pipelineRepository.createSalesPepilineByRequest(pipeline).subscribe(response => {
      if (response.model) {
        this.pipelines.push(response.model);

        this.buildPipeMenuList(this.pipelines);

        this.enableNewPipelineDialog = false;
      }
    });
  }

  private buildPipelineForm() {
    this.pipeForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }
  //#endregion

  //#region Edit Pipeline Stages
  public openDialogNewStage() {
    this.pipeline = {};
    //this.buildPipelineForm();
    this.openAddStageDialog = true;
  }

  public openEditStage() {
    this.openStageEdit = !this.openStageEdit;
  }

  public onRowEditStageInit(stage: PipelineStage) {
    this.clonedPipelineStage[stage.id] = { ...stage };
  }

  public onRowEditStageSave(stage: PipelineStage) {
    delete this.clonedPipelineStage[stage.id];

    const index = this.selectedPipeline.stages.findIndex(s => s.id === stage.id);
    if (index !== -1) {
      this.selectedPipeline.stages[index] = { ...stage };
    }
  }

  public onRowEditStageCancel(stage: PipelineStage, index: number) {
    this.pipelineStages[index] = this.clonedPipelineStage[stage.id];
    delete this.clonedPipelineStage[stage.id];
  }
  //#endregion

}
