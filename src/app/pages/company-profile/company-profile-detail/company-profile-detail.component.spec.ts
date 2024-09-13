import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileDetailComponent } from './company-profile-detail.component';

describe('CompanyProfileDetailComponent', () => {
  let component: CompanyProfileDetailComponent;
  let fixture: ComponentFixture<CompanyProfileDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyProfileDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyProfileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
