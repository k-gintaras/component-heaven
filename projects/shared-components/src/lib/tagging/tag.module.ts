import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagMultipleItemsComponent } from './tag-multiple-items/tag-multiple-items.component';
import { TagPickerComponent } from './tag-picker/tag-picker.component';

@NgModule({
  imports: [
    CommonModule, // Required for Angular directives
    TagMultipleItemsComponent, // Import standalone components
    TagPickerComponent,
  ],
  exports: [TagMultipleItemsComponent], // Export the primary reusable component
})
export class TagManagerModule {}
