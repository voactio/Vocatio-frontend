import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css']
})
export class HomePage {
  private router = inject(Router);

  navigateToTest() {
    this.router.navigate(['/test-vocacional']);
  }

  navigateToCareers() {
    this.router.navigate(['/carreras']);
  }
}
