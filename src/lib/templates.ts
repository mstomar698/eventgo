import { IEventTemplate } from './models/template';

export const STARTER_TEMPLATES: Partial<IEventTemplate>[] = [
  {
    name: 'Birthday at Home',
    category: 'birthday',
    description: 'Intimate birthday celebration at home for up to 20 people',
    headcount: 15,
    checklist: [
      'Send invitations 2-3 weeks in advance',
      'Plan menu and buy groceries',
      'Decorate the space',
      'Prepare games and activities',
      'Arrange for birthday cake',
      'Set up music playlist',
    ],
    timeline: [
      {
        phase: 'Planning',
        daysBefore: 21,
        tasks: ['Choose date and time', 'Create guest list', 'Send invitations'],
      },
      {
        phase: 'Preparation',
        daysBefore: 7,
        tasks: ['Buy decorations and supplies', 'Plan menu', 'Prepare games'],
      },
      {
        phase: 'Day Of',
        daysBefore: 0,
        tasks: ['Set up decorations', 'Prepare food', 'Welcome guests'],
      },
    ],
    budgetCategories: [
      { category: 'Food and Drinks', estimatedAmount: 200, notes: 'Groceries and cake' },
      {
        category: 'Decorations',
        estimatedAmount: 50,
        notes: 'Balloons, banners, tableware',
      },
      { category: 'Entertainment', estimatedAmount: 30, notes: 'Games, music' },
    ],
    vendorNeeds: [],
    nearbyConsiderations: [
      'Parking availability',
      'Noise restrictions if outdoors',
      'Nearby stores for last-minute items',
    ],
    communicationPlan: [
      'Send paper invitations or digital invites',
      'Follow up with RSVPs',
      'Share event details via group chat',
    ],
  },
  {
    name: 'Birthday at Cafe/Restaurant',
    category: 'birthday',
    description: 'Birthday party at a local cafe or restaurant for up to 20 people',
    headcount: 18,
    checklist: [
      'Book venue 3-4 weeks in advance',
      'Reserve private room if available',
      'Plan menu with venue',
      'Send invitations',
      'Arrange for birthday cake',
      'Coordinate decorations with venue',
    ],
    timeline: [
      {
        phase: 'Booking',
        daysBefore: 28,
        tasks: ['Research and book venue', 'Confirm menu options'],
      },
      {
        phase: 'Planning',
        daysBefore: 14,
        tasks: ['Send invitations', 'Plan decorations and cake'],
      },
      {
        phase: 'Event',
        daysBefore: 0,
        tasks: ['Arrive early for setup', 'Enjoy the celebration'],
      },
    ],
    budgetCategories: [
      {
        category: 'Venue Rental',
        estimatedAmount: 500,
        notes: 'Private room or party package',
      },
      { category: 'Food and Drinks', estimatedAmount: 300, notes: 'Catering from venue' },
      {
        category: 'Cake and Desserts',
        estimatedAmount: 100,
        notes: 'Custom birthday cake',
      },
      {
        category: 'Decorations',
        estimatedAmount: 50,
        notes: 'Table settings and balloons',
      },
    ],
    vendorNeeds: ['Restaurant/Cafe'],
    nearbyConsiderations: [
      'Parking and public transport access',
      'Nearby parking lots',
      'Proximity to guests homes',
    ],
    communicationPlan: [
      'Share venue details and directions',
      'Confirm dietary restrictions',
      'Send reminders about time and location',
    ],
  },
  {
    name: 'Small Community Meetup',
    category: 'community',
    description: 'Informal community gathering for up to 20 people',
    headcount: 20,
    checklist: [
      'Choose meeting location',
      'Set agenda and goals',
      'Send invitations to community members',
      'Prepare materials if needed',
      'Arrange refreshments',
      'Plan icebreaker activities',
    ],
    timeline: [
      {
        phase: 'Organization',
        daysBefore: 14,
        tasks: ['Define purpose and agenda', 'Choose date/location', 'Send invitations'],
      },
      {
        phase: 'Preparation',
        daysBefore: 3,
        tasks: ['Prepare materials', 'Buy refreshments', 'Set up space'],
      },
      {
        phase: 'Meeting',
        daysBefore: 0,
        tasks: ['Welcome attendees', 'Facilitate discussion', 'Wrap up'],
      },
    ],
    budgetCategories: [
      { category: 'Venue', estimatedAmount: 0, notes: 'Often free community spaces' },
      { category: 'Refreshments', estimatedAmount: 50, notes: 'Coffee, snacks, water' },
      { category: 'Materials', estimatedAmount: 20, notes: 'Handouts, markers, etc.' },
    ],
    vendorNeeds: [],
    nearbyConsiderations: [
      'Accessibility for all attendees',
      'Parking availability',
      'Public transport options',
    ],
    communicationPlan: [
      'Use community mailing lists or social media',
      'Send calendar invites',
      'Follow up with meeting notes',
    ],
  },
  {
    name: 'Neighborhood Workshop',
    category: 'community',
    description: 'Educational workshop for neighborhood residents',
    headcount: 15,
    checklist: [
      'Define workshop topic and goals',
      'Find suitable venue',
      'Recruit instructor or facilitator',
      'Create promotional materials',
      'Register participants',
      'Prepare workshop materials',
    ],
    timeline: [
      {
        phase: 'Planning',
        daysBefore: 30,
        tasks: ['Define topic and goals', 'Book venue and facilitator'],
      },
      {
        phase: 'Promotion',
        daysBefore: 14,
        tasks: ['Create flyers and social media posts', 'Open registration'],
      },
      {
        phase: 'Execution',
        daysBefore: 0,
        tasks: ['Set up room', 'Conduct workshop', 'Gather feedback'],
      },
    ],
    budgetCategories: [
      { category: 'Venue', estimatedAmount: 100, notes: 'Community center rental' },
      {
        category: 'Facilitator',
        estimatedAmount: 200,
        notes: 'Expert or instructor fee',
      },
      { category: 'Materials', estimatedAmount: 50, notes: 'Handouts, supplies' },
      { category: 'Promotion', estimatedAmount: 30, notes: 'Flyers and online ads' },
    ],
    vendorNeeds: ['Venue provider', 'Workshop facilitator'],
    nearbyConsiderations: [
      'Easy access for local residents',
      'Parking for attendees',
      'Nearby amenities',
    ],
    communicationPlan: [
      'Local community groups and social media',
      'Email newsletters',
      'Word-of-mouth promotion',
    ],
  },
];
