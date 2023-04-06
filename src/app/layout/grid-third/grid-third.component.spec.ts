import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridThirdComponent } from './grid-third.component';

describe('GridThirdComponent', () => {
  let component: GridThirdComponent;
  let fixture: ComponentFixture<GridThirdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridThirdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridThirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
