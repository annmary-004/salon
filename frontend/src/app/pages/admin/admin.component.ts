import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  bookingService = inject(BookingService);
  
  bookings: Booking[] = [];
  isLoading = true;

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings() {
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  updateStatus(id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') {
    this.bookingService.updateStatus(id, status).subscribe({
      next: () => this.fetchBookings(),
      error: (err) => alert('Failed to update status')
    });
  }
}
