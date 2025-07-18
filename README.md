# Buckshot Roulette - 2 Player Real-time Game

A real-time multiplayer implementation of Buckshot Roulette built with React, Vite, Supabase, and Rive animations.

## Features

- **Real-time Multiplayer**: Two players can create and join rooms
- **Rive Animations**: Context-aware animations that show different perspectives for each player
- **Turn-based Gameplay**: Players take turns shooting either themselves or their opponent
- **Health System**: Each player starts with 3 health points
- **Random Bullet Generation**: Mix of real and fake bullets generated randomly

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project settings and copy the URL and anon key
3. In the SQL Editor, run the SQL from `supabase-schema.sql` to create the necessary tables
4. Make sure Real-time is enabled for the `game_rooms` table

### 2. Environment Variables

1. Copy `.env` and update with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Rive Animation Setup

1. Place your Rive file in the `public` folder
2. Update the path in `src/components/RiveAnimation.js`:
```javascript
src: '/your-rive-file.riv'
```
3. Update the state machine name and input names to match your Rive file

### 4. Install and Run

```bash
npm install
npm run dev
```

## Game Logic

### Bullet System
- 6 bullets total (configurable)
- 3-4 real bullets, rest are fake
- Bullets are shuffled randomly

### Animation Triggers

The game uses perspective-based animation triggers:

- **Fake_MtoM**: Fake bullet, I shoot myself
- **Real_MtoM**: Real bullet, I shoot myself  
- **Fake_MtoO**: Fake bullet, I shoot opponent
- **Real_MtoO**: Real bullet, I shoot opponent
- **Fake_OtoM**: Fake bullet, opponent shoots me
- **Real_OtoM**: Real bullet, opponent shoots me

### Turn Logic
- If you shoot yourself with a fake bullet, you keep your turn
- If you shoot yourself with a real bullet, turn passes to opponent
- If you shoot opponent (fake or real), turn passes to opponent

### Win Condition
- First player to reach 0 health loses
- Game ends immediately when a player's health reaches 0

## Project Structure

```
src/
├── components/
│   ├── Game.js          # Main game component
│   └── RiveAnimation.js # Rive animation handler
├── hooks/
│   └── useGameState.js  # Game state management
├── lib/
│   └── supabase.js      # Supabase client setup
├── App.jsx              # Main app component
└── main.jsx             # Entry point
```

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Supabase** - Real-time database and backend
- **Rive** - Advanced animations
- **CSS** - Styling (no frameworks)

## Development Notes

### Real-time Synchronization
- Game state is synchronized in real-time using Supabase's real-time subscriptions
- Each action updates the database and triggers updates for both players
- Players see different animation triggers based on their perspective

### Error Handling
- Room validation for joining
- Turn validation for actions
- Connection state management

### Animation System
- Rive animations run continuously
- Triggers are fired based on game events
- Each player sees contextually appropriate animations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this code for your own projects!+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
