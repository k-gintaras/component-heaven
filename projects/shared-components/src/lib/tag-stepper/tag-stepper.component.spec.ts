import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagStepperComponent } from './tag-stepper.component';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('TagStepperComponent', () => {
  let component: TagStepperComponent;
  let fixture: ComponentFixture<TagStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TagStepperComponent,
        MatChipsModule,
        MatButtonModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TagStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', () => {
    component.matrix = [{ title: 'Row 1', tags: [] }];
    component.ngOnInit();
    expect(component.currentRow.value?.title).toBe('Row 1'); // Correctly access the FormControl value
  });

  it('should add custom tag', () => {
    const event = {
      input: { value: 'custom-tag' },
      value: 'custom-tag',
    } as MatChipInputEvent;

    component.addCustom(event);
    expect(component.custom).toContain('custom-tag');
  });

  it('should remove custom tag', () => {
    component.custom = ['custom-tag'];
    component.removeCustom('custom-tag');
    expect(component.custom).not.toContain('custom-tag');
  });

  it('should add a validated tag to resultsArray', () => {
    component.resultsArray = [];
    component.tryAddValidatedWithGroup(
      'validated-tag',
      component.resultsArray,
      true,
    );
    expect(component.resultsArray).toContain('validated-tag');
  });

  it('should not add duplicate tags to resultsArray', () => {
    component.resultsArray = ['validated-tag'];
    component.tryAddValidatedWithGroup(
      'validated-tag',
      component.resultsArray,
      true,
    );
    expect(component.resultsArray.length).toBe(1);
  });

  it('should add validated tag with group', () => {
    const tag = { name: 'group-tag', group: 'group1' };
    component.selectedGroups = [];
    component.resultsArray = [];
    component.tryAddValidatedWithGroup(tag, component.resultsArray, false);
    expect(component.resultsArray).toContain('group-tag');
    expect(component.selectedGroups).toContain('group1');
  });

  it('should remove non-unique validated tag with group when isRemoveNonUnique is true', () => {
    const tag = { name: 'duplicate-tag', group: 'group1' };
    component.resultsArray = ['duplicate-tag'];
    component.tryAddValidatedWithGroup(tag, component.resultsArray, true);
    expect(component.resultsArray).not.toContain('duplicate-tag');
  });
});
