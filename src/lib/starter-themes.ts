import { ITheme } from './models/theme';

export const STARTER_THEMES: Partial<ITheme>[] = [
  {
    title: 'Tropical Sunset Celebration',
    description:
      'A vibrant beach-inspired theme with warm sunset tones and laid-back energy. Perfect for outdoor birthday parties.',
    occasion: 'birthday',
    mood: ['festive', 'vibrant', 'tropical', 'laid-back'],
    colorPalette: ['#f97316', '#f43f5e', '#eab308', '#22c55e'],
    events: ['photo booth', 'limbo contest', 'cocktail hour', 'sunset dance floor'],
    decor: [
      'palm leaf centrepieces',
      'fairy lights',
      'paper lanterns',
      'floral garlands',
      'bamboo accents',
    ],
    music: ['tropical house', 'reggae', 'afrobeats', 'summer pop'],
    food: [
      'tropical cocktails',
      'fresh fruit skewers',
      'BBQ stations',
      'coconut desserts',
    ],
    budgetEstimate: 800,
    budgetNotes: '$300 decor, $300 food & drinks, $200 entertainment',
    checklist: [
      'Book outdoor venue',
      'Arrange DJ or curate playlist',
      'Order tropical decorations',
      'Plan cocktail and mocktail menu',
      'Set up photo booth with props',
      'Arrange lighting for evening',
    ],
    timeline: [
      {
        phase: 'Planning',
        daysBefore: 30,
        tasks: ['Choose venue', 'Send invitations', 'Plan menu', 'Book DJ'],
      },
      {
        phase: 'Preparation',
        daysBefore: 7,
        tasks: ['Order decorations', 'Confirm guest count', 'Buy food supplies'],
      },
      {
        phase: 'Day Before',
        daysBefore: 1,
        tasks: ['Set up decor', 'Prepare food stations', 'Test lighting'],
      },
      {
        phase: 'Day of Event',
        daysBefore: 0,
        tasks: ['Welcome guests', 'Start playlist', 'Run photo booth'],
      },
    ],
  },
  {
    title: 'Elegant Garden Wedding',
    description:
      'Sophisticated garden party theme with soft florals and greenery. Timeless romance in a natural setting.',
    occasion: 'wedding',
    mood: ['romantic', 'elegant', 'whimsical', 'intimate'],
    colorPalette: ['#22c55e', '#ec4899', '#f0fdf4', '#fdf2f8'],
    events: [
      'ceremony procession',
      'first dance',
      'bouquet toss',
      'champagne toast',
      'cake cutting',
    ],
    decor: [
      'floral arches',
      'candlelit tables',
      'draped fairy lights',
      'greenery backdrop',
      'petal aisle',
    ],
    music: ['classical strings', 'acoustic pop', 'jazz standards', 'romantic ballads'],
    food: [
      'canapés',
      'champagne tower',
      'tiered wedding cake',
      'garden salad bar',
      'dessert table',
    ],
    budgetEstimate: 3000,
    budgetNotes: '$1200 venue+decor, $800 catering, $600 entertainment, $400 misc',
    checklist: [
      'Book wedding venue',
      'Hire florist',
      'Arrange catering and cake',
      'Book photographer and videographer',
      'Organise music/live band',
      'Send wedding invitations',
      'Arrange seating plan',
    ],
    timeline: [
      {
        phase: '6 Months Before',
        daysBefore: 180,
        tasks: ['Book venue', 'Set guest list', 'Hire photographer'],
      },
      {
        phase: '3 Months Before',
        daysBefore: 90,
        tasks: ['Book florist', 'Finalise catering', 'Send invitations'],
      },
      {
        phase: '1 Week Before',
        daysBefore: 7,
        tasks: ['Confirm all vendors', 'Prepare seating chart', 'Final fitting'],
      },
      {
        phase: 'Day of Event',
        daysBefore: 0,
        tasks: ['Venue setup', 'Bridal preparation', 'Ceremony run-through'],
      },
    ],
  },
  {
    title: 'Corporate Innovation Summit',
    description:
      'Professional yet engaging corporate event theme for team building, keynotes, and knowledge sharing.',
    occasion: 'corporate',
    mood: ['professional', 'inspiring', 'energetic', 'collaborative'],
    colorPalette: ['#06b6d4', '#8b5cf6', '#14b8a6'],
    events: [
      'keynote speeches',
      'breakout workshops',
      'networking lunch',
      'panel discussion',
      'awards ceremony',
    ],
    decor: [
      'branded banners',
      'round table setups',
      'projection screens',
      'minimalist centrepieces',
      'step-and-repeat',
    ],
    music: ['background jazz', 'ambient beats', 'upbeat intro music'],
    food: [
      'coffee & tea station',
      'working lunch buffet',
      'afternoon snack bar',
      'cocktail reception',
    ],
    budgetEstimate: 5000,
    budgetNotes:
      '$2000 venue+AV, $1500 catering, $800 speakers, $700 materials & printing',
    checklist: [
      'Book conference venue with AV',
      'Confirm keynote speakers',
      'Prepare event agenda',
      'Arrange catering for all sessions',
      'Set up registration desk',
      'Organise name tags and materials',
      'Arrange photography/recording',
    ],
    timeline: [
      {
        phase: 'Planning',
        daysBefore: 60,
        tasks: ['Book venue', 'Invite speakers', 'Create agenda'],
      },
      {
        phase: 'Preparation',
        daysBefore: 14,
        tasks: ['Send final program', 'Confirm attendance', 'Print materials'],
      },
      {
        phase: 'Day Before',
        daysBefore: 1,
        tasks: ['Venue setup', 'AV test', 'Registration prep'],
      },
      {
        phase: 'Day of Event',
        daysBefore: 0,
        tasks: ['Welcome attendees', 'Manage schedule', 'Handle Q&A sessions'],
      },
    ],
  },
] as any[];
