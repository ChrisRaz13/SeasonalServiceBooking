import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements AfterViewInit {
  navbarOpen: boolean = false;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.adjustBodyPadding();
    window.addEventListener('resize', this.adjustBodyPadding.bind(this));
  }

  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }

  adjustBodyPadding(): void {
    const navbarHeight = this.elRef.nativeElement.querySelector('.navbar').offsetHeight;
    this.renderer.setStyle(document.body, 'padding-top', `${navbarHeight}px`);
  }
}
