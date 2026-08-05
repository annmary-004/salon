export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  avatar?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  image?: string;
  category: string;
}

export interface Stylist {
  id: string;
  name: string;
  role?: string;
  specialization: string[];
  experience?: number;
  rating: number;
  reviews: number;
  avatar?: string;
  availability: { day: string; startTime: string; endTime: string }[];
}

export interface Booking {
  id: string;
  userId: string;
  user?: User;
  serviceId: string;
  service?: Service;
  stylistId: string;
  stylist?: Stylist;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice?: number;
  notes?: string;
}
