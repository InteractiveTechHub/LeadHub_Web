import { CdkDragDrop, transferArrayItem, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PRIME_NG_MODULES } from '@core/utils';
import { SalesPipelineRepository } from '@repository/index';
import { SalesPipeline } from '@core/interfaces';
import { LeadStage } from '@core/interfaces/LeadStage';
import { DateFormaterService } from '@core/services/date-formater.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-salespipeline',
  imports: [DragDropModule, ...PRIME_NG_MODULES, FormsModule],
  providers: [DatePipe, DateFormaterService],
  templateUrl: './salespipeline.component.html',
  styleUrl: './salespipeline.component.scss'
})
export class SalespipelineComponent implements OnInit {

  pipelines!: SalesPipeline[];
  selectedPipeline!: SalesPipeline;

  /**
   *
   */
  constructor(private pipelineRepository: SalesPipelineRepository,
    private dateService: DateFormaterService) {
  }

  ngOnInit(): void {
    this.pipelineRepository.fetchSalesPepilines().subscribe(r => {
      this.selectedPipeline = r.model;
    });
  }

  DateFormat(date: Date) {
    return this.dateService.getDateLabel(date);
  }

  drop(event: CdkDragDrop<LeadStage[]>) {
    //if (event.previousContainer === event.container) return;

    if (event.previousContainer === event.container) {
      // Order within the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Move between the column
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
