<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Buckshot Roulette Game Project Instructions

This is a React Vite project for a 2-player Buckshot Roulette game with real-time multiplayer functionality.

## Key Technologies:
- React with JavaScript (not TypeScript)
- Vite for build tooling
- Supabase for real-time database and authentication
- Rive for animations
- Regular CSS (no frameworks)

## Game Logic:
- 2-player real-time game
- Players can create or join rooms
- Bullets are randomly generated (mix of real and fake)
- Rive animations with specific triggers:
  - Fake_MtoM: Fake bullet, shooting myself
  - Real_MtoM: Real bullet, shooting myself
  - Fake_MtoO: Fake bullet, shooting opponent
  - Real_MtoO: Real bullet, shooting opponent
  - Fake_OtoM: Fake bullet, opponent shooting me
  - Real_OtoM: Real bullet, opponent shooting me

## Animation System:
- Rive file should be running continuously
- Triggers should be context-aware (ME vs OPPONENT perspective)
- Each player sees different triggers based on their role in the action

## Real-time Features:
- Room creation and joining
- Live game state synchronization
- Turn-based gameplay
- Bullet outcome broadcasting
