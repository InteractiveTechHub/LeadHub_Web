import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsAppTemplateListComponent } from './whats-app-template-list.component';

describe('WhatsAppTemplateListComponent', () => {
  let component: WhatsAppTemplateListComponent;
  let fixture: ComponentFixture<WhatsAppTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsAppTemplateListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsAppTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
