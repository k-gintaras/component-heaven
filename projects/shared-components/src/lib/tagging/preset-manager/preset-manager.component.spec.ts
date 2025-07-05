import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresetManagerComponent } from './preset-manager.component';

describe('PresetManagerComponent', () => {
  let component: PresetManagerComponent;
  let fixture: ComponentFixture<PresetManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresetManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresetManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
