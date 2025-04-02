import { Component, Input, OnInit } from '@angular/core';
import { WhatsAppTemplate } from '@core/models';

@Component({
  selector: 'app-whats-app-template-list',
  imports: [],
  templateUrl: './whats-app-template-list.component.html',
  styleUrl: './whats-app-template-list.component.scss'
})
export class WhatsAppTemplateListComponent implements OnInit {
  @Input() templates!: WhatsAppTemplate;

  ngOnInit(): void {
    console.log(this.templates)
  }
}
