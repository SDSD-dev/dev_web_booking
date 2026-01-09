// src/app/app.ts
import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
// Import depuis './services/hotel'
import { HotelService, Hotel } from './services/hotel.service';
import { Observable } from 'rxjs';
// Import Header/Footer
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
// export class App {
//   protected readonly title = signal('client');
// };
export class AppComponent {}
