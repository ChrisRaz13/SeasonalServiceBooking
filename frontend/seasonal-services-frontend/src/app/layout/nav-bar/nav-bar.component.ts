import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css',]
})
export class NavBarComponent implements AfterViewInit {

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.adjustBodyPadding();
    // If the window resizes, recalculate the padding
    window.addEventListener('resize', this.adjustBodyPadding.bind(this));
  }

  adjustBodyPadding(): void {
    const navbarHeight = this.elRef.nativeElement.querySelector('.navbar').offsetHeight;
    this.renderer.setStyle(document.body, 'padding-top', `${navbarHeight}px`);
  }
}
