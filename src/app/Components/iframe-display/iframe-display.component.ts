import { Component, Inject, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { addIcons } from 'ionicons';
import { SafePipe } from '../../safe.pipe';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../service/loader.service';

@Component({
  selector: 'app-iframe-display',
  standalone: true,
  imports: [SafePipe, CommonModule, LoaderComponent],
  templateUrl: './iframe-display.component.html',
  styleUrl: './iframe-display.component.css',
})
export class IframeDisplayComponent {
  isLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { link: string; fileExtension: string },
    private loaderService: LoaderService
  ) {
    const storedLink: { link: string; fileExtension: string } = JSON.parse(
      localStorage.getItem('downLoadLink') || '{}'
    );
  }
  ngOnInit() {
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  // @Input() link: string = '';
  // @Input() fileExtension: string = '';

  get isImage(): boolean {
    return ['jpg', 'jpeg', 'png', 'gif'].includes(
      this.data.fileExtension.toLowerCase()
    );
  }

  get isPdf(): boolean {
    return this.data.fileExtension.toLowerCase() === 'pdf';
  }

  get iframeSrc(): string {
    return this.data.link;
  }
}
