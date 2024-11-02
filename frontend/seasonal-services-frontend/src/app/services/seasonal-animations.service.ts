import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SeasonalAnimationsService {
  constructor(private renderer: Renderer2) {}

  createSnowflakes(container: HTMLElement) {
    for (let i = 0; i < 50; i++) {
      const snowflake = this.renderer.createElement('div');
      this.renderer.addClass(snowflake, 'snowflake');

      // Randomize snowflake properties
      const left = Math.random() * 100;
      const animationDuration = 3 + Math.random() * 5;
      const size = Math.random() * 4 + 2;

      this.renderer.setStyle(snowflake, 'left', `${left}%`);
      this.renderer.setStyle(snowflake, 'animation-duration', `${animationDuration}s`);
      this.renderer.setStyle(snowflake, 'width', `${size}px`);
      this.renderer.setStyle(snowflake, 'height', `${size}px`);

      this.renderer.appendChild(container, snowflake);
    }
  }

  createLeaves(container: HTMLElement) {
    const leaves = ['🍁', '🍂', '🌿'];
    for (let i = 0; i < 20; i++) {
      const leaf = this.renderer.createElement('div');
      this.renderer.addClass(leaf, 'leaf');

      // Random leaf properties
      const left = Math.random() * 100;
      const animationDuration = 4 + Math.random() * 6;
      const leafChar = leaves[Math.floor(Math.random() * leaves.length)];

      this.renderer.setProperty(leaf, 'innerHTML', leafChar);
      this.renderer.setStyle(leaf, 'left', `${left}%`);
      this.renderer.setStyle(leaf, 'animation-duration', `${animationDuration}s`);

      this.renderer.appendChild(container, leaf);
    }
  }

  clearEffects(container: HTMLElement) {
    container.innerHTML = '';
  }
}
