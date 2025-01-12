import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagxtComponent } from './tagxt.component';

describe('TagxtComponent', () => {
  let component: TagxtComponent;
  let fixture: ComponentFixture<TagxtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagxtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagxtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
