import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseManagerDetailComponent } from './expense-manager-detail.component';

describe('ExpenseManagerDetailComponent', () => {
  let component: ExpenseManagerDetailComponent;
  let fixture: ComponentFixture<ExpenseManagerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseManagerDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpenseManagerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
