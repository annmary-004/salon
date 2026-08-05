import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { ServicesService } from '../services/services.service';
import { StylistsService } from '../stylists/stylists.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly servicesService: ServicesService,
    private readonly stylistsService: StylistsService,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
    await this.seedServices();
    await this.seedStylists();
  }

  private async seedAdmin() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    const adminName = this.configService.get<string>('ADMIN_NAME') || 'Salon Admin';

    if (!adminEmail || !adminPassword) {
      console.log('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not configured. Skipping admin seed.');
      return;
    }

    const existing = await this.usersService.findByEmail(adminEmail);
    if (existing) {
      console.log(`✅ Admin user already exists: ${adminEmail}`);
      return;
    }

    await this.usersService.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`✅ Created admin user: ${adminEmail}`);
  }

  private async seedServices() {
    const count = await this.servicesService.count();
    if (count > 0) return;

    const services = [
      {
        name: 'Signature Haircut',
        category: 'Hair',
        price: 1290,
        duration: 45,
        description: 'Face-shape consultation, precision cut, wash and luxury finish.',
      },
      {
        name: 'Gloss Color Ritual',
        category: 'Color',
        price: 3490,
        duration: 110,
        description: 'Dimensional gloss, toner, bond care and luminous blowout.',
      },
      {
        name: 'Keratin Luxe',
        category: 'Treatment',
        price: 4990,
        duration: 150,
        description: 'Frizz control, mirror shine and deep smoothing for up to 12 weeks.',
      },
      {
        name: 'Glass Skin Facial',
        category: 'Skin',
        price: 2490,
        duration: 70,
        description: 'Cleanse, exfoliation, sculpting massage, mask and serum infusion.',
      },
    ];

    for (const s of services) {
      await this.servicesService.create(s);
    }
    console.log('✅ Seeded default services');
  }

  private async seedStylists() {
    const count = await this.stylistsService.count();
    if (count > 0) return;

    const stylists = [
      {
        name: 'Aria Mehta',
        role: 'Creative Director',
        specialization: ['Luxury Cuts', 'Editorial Finish'],
        rating: 5.0,
        reviews: 318,
        experience: 12,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=400',
      },
      {
        name: 'Noah Varghese',
        role: 'Color Specialist',
        specialization: ['Balayage', 'Gloss Color'],
        rating: 4.9,
        reviews: 286,
        experience: 9,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=85&w=400',
      },
      {
        name: 'Mira Iyer',
        role: 'Bridal Artist',
        specialization: ['Bridal Hair', 'HD Makeup'],
        rating: 5.0,
        reviews: 241,
        experience: 10,
        avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&q=85&w=400',
      },
      {
        name: 'Zara Khan',
        role: 'Skin Therapist',
        specialization: ['Facials', 'Skin Rituals'],
        rating: 4.8,
        reviews: 176,
        experience: 7,
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=85&w=400',
      },
    ];

    for (const s of stylists) {
      await this.stylistsService.create(s);
    }
    console.log('✅ Seeded default stylists');
  }
}
