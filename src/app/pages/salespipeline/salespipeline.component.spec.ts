import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalespipelineComponent } from './salespipeline.component';

describe('SalespipelineComponent', () => {
  let component: SalespipelineComponent;
  let fixture: ComponentFixture<SalespipelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalespipelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalespipelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
