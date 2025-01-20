import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagManagerComponent } from './tag-manager/tag-manager.component';
import { TagDataComponent } from './tag-data/tag-data.component';

@NgModule({
  imports: [
    CommonModule, // Required for Angular directives
    TagManagerComponent, // Import standalone components
    TagDataComponent,
  ],
  exports: [TagManagerComponent], // Export the primary reusable component
})
export class TagManagerModule {}
