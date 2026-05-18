import {
  Brush,
  Crown,
  Gem,
  HandHeart,
  Scissors,
  Sparkles,
  WandSparkles,
} from 'lucide-react'

export const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=90&w=2200',
    eyebrow: 'Private atelier appointments',
    title: 'Salon Luxe',
    copy: 'A premium beauty house for polished cuts, luminous color, bridal artistry and skin rituals.',
  },
  {
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=90&w=2200',
    eyebrow: 'High-touch styling',
    title: 'Designed Around You',
    copy: 'Book your stylist, choose a private slot and arrive to a calm, elevated experience.',
  },
  {
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=90&w=2200',
    eyebrow: 'Color, care and craft',
    title: 'Luxury In Motion',
    copy: 'Dimensional color, glossy finishing and restorative treatments with concierge-level attention.',
  },
]

export const featuredServices = [
  {
    _id: 'svc-signature-cut',
    name: 'Signature Haircut',
    category: 'Hair',
    price: 1290,
    duration: 45,
    description: 'Face-shape consultation, precision cut, wash and luxury finish.',
    icon: Scissors,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=85&w=900',
  },
  {
    _id: 'svc-gloss-color',
    name: 'Gloss Color Ritual',
    category: 'Color',
    price: 3490,
    duration: 110,
    description: 'Dimensional gloss, toner, bond care and luminous blowout.',
    icon: Brush,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=85&w=900',
  },
  {
    _id: 'svc-keratin',
    name: 'Keratin Luxe',
    category: 'Treatment',
    price: 4990,
    duration: 150,
    description: 'Frizz control, mirror shine and deep smoothing for up to 12 weeks.',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&q=85&w=900',
  },
  {
    _id: 'svc-skin',
    name: 'Glass Skin Facial',
    category: 'Skin',
    price: 2490,
    duration: 70,
    description: 'Cleanse, exfoliation, sculpting massage, mask and serum infusion.',
    icon: Gem,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=85&w=900',
  },
  {
    _id: 'svc-bridal',
    name: 'Bridal Artistry',
    category: 'Bridal',
    price: 14990,
    duration: 210,
    description: 'HD makeup, hair design, draping support and final touch kit.',
    icon: Crown,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=85&w=900',
  },
  {
    _id: 'svc-spa',
    name: 'Scalp Spa Ceremony',
    category: 'Wellness',
    price: 1890,
    duration: 55,
    description: 'Aromatherapy scalp detox, pressure massage and nourishing steam.',
    icon: HandHeart,
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=85&w=900',
  },
]

export const featuredStylists = [
  {
    _id: 'stylist-aria',
    name: 'Aria Mehta',
    role: 'Creative Director',
    specialization: ['Luxury Cuts', 'Editorial Finish'],
    rating: 5,
    reviews: 318,
    experience: 12,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=400',
  },
  {
    _id: 'stylist-noah',
    name: 'Noah Varghese',
    role: 'Color Specialist',
    specialization: ['Balayage', 'Gloss Color'],
    rating: 4.9,
    reviews: 286,
    experience: 9,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=85&w=400',
  },
  {
    _id: 'stylist-mira',
    name: 'Mira Iyer',
    role: 'Bridal Artist',
    specialization: ['Bridal Hair', 'HD Makeup'],
    rating: 5,
    reviews: 241,
    experience: 10,
    avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&q=85&w=400',
  },
  {
    _id: 'stylist-zara',
    name: 'Zara Khan',
    role: 'Skin Therapist',
    specialization: ['Facials', 'Skin Rituals'],
    rating: 4.8,
    reviews: 176,
    experience: 7,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=85&w=400',
  },
]

export const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00']

export const adminBookings = [
  { id: 1, client: 'Nina Joseph', service: 'Gloss Color Ritual', stylist: 'Noah Varghese', date: 'Today', time: '10:00', status: 'confirmed', total: 3490 },
  { id: 2, client: 'Devika Rao', service: 'Bridal Artistry', stylist: 'Mira Iyer', date: 'Today', time: '12:00', status: 'pending', total: 14990 },
  { id: 3, client: 'Alan Mathew', service: 'Signature Haircut', stylist: 'Aria Mehta', date: 'Tomorrow', time: '15:00', status: 'confirmed', total: 1290 },
  { id: 4, client: 'Sara Thomas', service: 'Glass Skin Facial', stylist: 'Zara Khan', date: 'May 05', time: '11:00', status: 'completed', total: 2490 },
]

export const premiumHighlights = [
  { label: 'Private suites', value: '08' },
  { label: 'Average rating', value: '4.9' },
  { label: 'Monthly clients', value: '1.8K' },
  { label: 'Luxury brands', value: '24' },
]

export const navItems = [
  { label: 'Services', id: 'services' },
  { label: 'Stylists', id: 'stylists' },
  { label: 'Experience', id: 'experience' },
  { label: 'Contact', id: 'contact' },
]

export const WandIcon = WandSparkles
