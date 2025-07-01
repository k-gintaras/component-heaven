import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColoratorComponent } from './colorator.component';

describe('ColoratorComponent', () => {
  let component: ColoratorComponent;
  let fixture: ComponentFixture<ColoratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColoratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColoratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
