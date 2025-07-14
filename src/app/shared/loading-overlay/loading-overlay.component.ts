import { Component, Input, Output, EventEmitter, HostListener, ViewEncapsulation  } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class LoadingOverlayComponent {
  @Input()  state: 'hidden' | 'visible' | 'loaded' = 'hidden';
  @Output() finished = new EventEmitter<void>();

  @HostListener('transitionend', ['$event'])
  onTransitionEnd(e: TransitionEvent) {
    if (e.propertyName === 'transform' && this.state === 'loaded') {
      this.finished.emit();
    }
  }
}