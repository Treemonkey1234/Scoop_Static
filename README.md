# ScoopSocials 🌟

A beautiful, professional trust-based social networking platform built with Next.js, React, and Tailwind CSS.

## Features ✨

- **Trust-Based Community**: 11-factor trust score system with community validation
- **Beautiful Design**: Modern, mobile-first interface with cyan-based color scheme
- **Interactive Reviews**: Rate and review people across multiple categories
- **Event Management**: Create, discover, and attend local events
- **Social Integration**: Connect with top 11 North American social platforms
- **Real-time Map**: Mapbox integration for event discovery
- **Account Tiers**: Free, Pro ($9.99/month), and Venue ($29.99/month) accounts
- **Responsive Design**: Optimized for mobile and desktop

## Quick Start 🚀

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Your Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Tech Stack 🛠️

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Heroicons
- **Maps**: Mapbox GL JS
- **Authentication**: NextAuth.js (ready for implementation)
- **Animations**: Framer Motion
- **Image Optimization**: Next.js Image component

## Project Structure 📁

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── events/            # Events pages
│   ├── profile/           # Profile pages
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── Layout.tsx         # Main layout wrapper
│   └── TrustBadge.tsx     # Trust score display
├── lib/                   # Utilities and data
│   └── sampleData.ts      # Mock data for development
├── ASCII_designs/         # Original ASCII designs
└── public/               # Static assets
```

## Key Features 🎯

### Trust Score System
- **Excellent** (85+): ⭐ Green badge
- **Good** (70-84): ✅ Cyan badge  
- **Fair** (50-69): ⚠️ Yellow badge
- **Poor** (30-49): ❌ Red badge
- **New** (0-29): 🆕 Gray badge

### Review Categories
- Professional, Social, Roommate, Service Provider
- Financial, Healthcare, Education, Volunteer
- Neighbor, Online Transaction, Event Organizer

### Account Types
- **Free**: Basic access, 20 invitations per event
- **Pro**: Professional reputation management, dual-layer visibility
- **Venue**: Customer relationship management for businesses

## Pages Included 📱

1. **Home Feed** - Reviews and events timeline
2. **Events** - Upcoming, past, and discover tabs
3. **Search** - Find people and locations
4. **Friends** - Network management
5. **Profile** - User profiles with trust breakdown
6. **Create Post** - Review creation
7. **Create Event** - Event planning
8. **Discover** - Interactive map view
9. **Settings** - Account and privacy settings
10. **Sign In/Up** - Authentication pages
11. **Comments** - Post discussion threads

## Customization 🎨

### Colors
The app uses a cyan-based color palette defined in `tailwind.config.js`:
- Primary: Various shades of cyan (#06b6d4)
- Trust colors: Green, cyan, yellow, red, gray
- Background: Gradient from cyan-50 to white

### Components
All components are built with Tailwind CSS classes and include:
- Hover effects and transitions
- Mobile-responsive design
- Accessibility features
- Beautiful animations

## Development 💻

### Adding New Pages
1. Create a new file in the `app/` directory
2. Use the Layout component for consistent navigation
3. Import sample data from `lib/sampleData.ts`

### Styling Guidelines
- Use existing Tailwind classes from `globals.css`
- Follow the established color scheme
- Maintain mobile-first responsive design
- Include hover states and transitions

## Mapbox Setup 🗺️

1. Sign up for a free Mapbox account
2. Get your access token from the dashboard
3. Add it to your `.env.local` file
4. The map will automatically work on the Discover page

## Future Enhancements 🔮

- [ ] Database integration (PostgreSQL/Supabase)
- [ ] Real authentication with NextAuth.js
- [ ] Push notifications
- [ ] Chat messaging system
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] AI-powered trust verification

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License 📄

This project is licensed under the MIT License.

---

**Built with ❤️ for creating trusted communities** 