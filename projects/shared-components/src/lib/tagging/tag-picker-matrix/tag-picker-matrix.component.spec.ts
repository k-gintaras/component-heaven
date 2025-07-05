import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagPickerMatrixComponent } from './tag-picker-matrix.component';

describe('TagPickerMatrixComponent', () => {
  let component: TagPickerMatrixComponent;
  let fixture: ComponentFixture<TagPickerMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagPickerMatrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagPickerMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
