import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SalonService } from '../../core/services/salon.service';
import { BookingService } from '../../core/services/booking.service';
import { Service, Stylist } from '../../core/models';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {
  salonService = inject(SalonService);
  bookingService = inject(BookingService);
  router = inject(Router);

  step = 1;
  services: Service[] = [];
  stylists: Stylist[] = [];
  availableSlots: string[] = [];

  selectedService: Service | null = null;
  selectedStylist: Stylist | null = null;
  selectedDate: string = '';
  selectedTime: string = '';
  notes: string = '';

  isLoading = false;
  error = '';

  ngOnInit() {
    this.salonService.getServices().subscribe(data => this.services = data);
    this.salonService.getStylists().subscribe(data => this.stylists = data);
    
    // Set min date to today
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  selectService(service: Service) {
    this.selectedService = service;
    this.step = 2;
  }

  selectStylist(stylist: Stylist) {
    this.selectedStylist = stylist;
    this.step = 3;
    this.fetchSlots();
  }

  onDateChange() {
    this.selectedTime = '';
    this.fetchSlots();
  }

  fetchSlots() {
    if (this.selectedStylist && this.selectedDate) {
      this.bookingService.getAvailableSlots(this.selectedStylist.id, this.selectedDate)
        .subscribe(slots => this.availableSlots = slots);
    }
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }

  goToConfirm() {
    if (this.selectedTime) {
      this.step = 4;
    }
  }

  submitBooking() {
    if (!this.selectedService || !this.selectedStylist || !this.selectedDate || !this.selectedTime) {
      return;
    }

    this.isLoading = true;
    this.error = '';

    const payload = {
      serviceId: this.selectedService.id,
      stylistId: this.selectedStylist.id,
      date: this.selectedDate,
      time: this.selectedTime,
      notes: this.notes
    };

    this.bookingService.createBooking(payload).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Booking Confirmed! You will receive an email shortly.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Failed to create booking';
      }
    });
  }

  goBack() {
    if (this.step > 1) {
      this.step--;
    }
  }
}
