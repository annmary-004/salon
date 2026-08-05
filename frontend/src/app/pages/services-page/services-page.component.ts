import { Component, OnInit, inject } from '@angular/core';
import { SalonService } from '../../core/services/salon.service';
import { Service } from '../../core/models';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.scss'
})
export class ServicesPageComponent implements OnInit {
  private salonService = inject(SalonService);
  services: Service[] = [];

  ngOnInit() {
    this.salonService.getServices().subscribe({
      next: (data) => this.services = data,
      error: (err) => console.error(err)
    });
  }
}
