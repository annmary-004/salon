import { Component, OnInit, inject } from '@angular/core';
import { SalonService } from '../../core/services/salon.service';
import { Stylist } from '../../core/models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  private salonService = inject(SalonService);
  stylists: Stylist[] = [];

  ngOnInit() {
    this.salonService.getStylists().subscribe({
      next: (data) => this.stylists = data,
      error: (err) => console.error(err)
    });
  }
}
