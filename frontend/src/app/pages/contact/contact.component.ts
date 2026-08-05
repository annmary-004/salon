import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  submitForm(event: Event) {
    event.preventDefault();
    alert('Thank you for reaching out! We will get back to you shortly.');
  }
}
