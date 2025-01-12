import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tagxt',
  imports: [NgIf],
  templateUrl: './tagxt.component.html',
  styleUrl: './tagxt.component.scss',
})
export class TagxtComponent {
  @Input() text: string = 'Tag'; // Default text
  @Input() selectable: boolean = true; // Can the pill be selected
  @Input() removable: boolean = false; // Can the pill be removed
  @Input() allowLonger: boolean = false; // Allow longer text without truncation
  @Input() controlledWidth: number = 100; // Width in pixels
  @Input() backgroundColor: string = '#f5f5f5'; // Default background color
  @Input() selected: boolean = false; // Is the pill currently selected
  @Output() remove = new EventEmitter<void>(); // Emit when pill is removed
  @Output() select = new EventEmitter<boolean>(); // Emit when pill is selected/unselected

  onClick(): void {
    if (this.selectable) {
      this.selected = !this.selected;
      this.select.emit(this.selected);
    }
  }

  getTextColor(bgColor: string): string {
    const rgb = this.hexToRgb(bgColor);
    if (!rgb) return '#000'; // Default to black if invalid color

    const brightness = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) / 255;
    return brightness > 0.5 ? '#000' : '#fff'; // Dark text on light bg, light text on dark bg
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    // Expand shorthand hex colors (e.g., #777 -> #777777)
    const expandedHex = hex.replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`,
    );

    // Match full hex colors
    const match = expandedHex.match(
      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
    );
    return match
      ? {
          r: parseInt(match[1], 16),
          g: parseInt(match[2], 16),
          b: parseInt(match[3], 16),
        }
      : null;
  }

  onRemoveClick(event: MouseEvent): void {
    event.stopPropagation(); // Prevent the click from triggering pill selection
    this.remove.emit();
  }

  selectTag(): void {
    this.select.emit();
  }
}
