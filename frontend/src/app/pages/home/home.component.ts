import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SalonService } from '../../core/services/salon.service';
import { Service, Stylist } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  salonService = inject(SalonService);
  
  services: Service[] = [];
  stylists: Stylist[] = [];

  ngOnInit() {
    this.salonService.getServices().subscribe({
      next: (data) => this.services = data.slice(0, 2),
      error: (err) => console.error(err)
    });

    this.salonService.getStylists().subscribe({
      next: (data) => this.stylists = data.slice(0, 2),
      error: (err) => console.error(err)
    });
  }
}
