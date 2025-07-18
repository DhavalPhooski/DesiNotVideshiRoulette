-- Create the game_rooms table for real-time gameplay
CREATE TABLE game_rooms (
  id SERIAL PRIMARY KEY,
  room_id VARCHAR(6) UNIQUE NOT NULL,
  player1_id VARCHAR(50) NOT NULL,
  player2_id VARCHAR(50),
  bullets JSONB NOT NULL DEFAULT '[]',
  bullet_composition JSONB,
  game_status VARCHAR(20) DEFAULT 'waiting',
  current_turn VARCHAR(50),
  player1_health INTEGER DEFAULT 3,
  player2_health INTEGER DEFAULT 3,
  current_bullet_index INTEGER DEFAULT 0,
  last_action JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;

-- Create policies for the game_rooms table
-- Allow anyone to create a room
CREATE POLICY "Anyone can create a room" ON game_rooms
  FOR INSERT WITH CHECK (true);

-- Allow players in the room to view the room
CREATE POLICY "Players can view their room" ON game_rooms
  FOR SELECT USING (
    player1_id IS NOT NULL OR player2_id IS NOT NULL
  );

-- Allow players in the room to update the room
CREATE POLICY "Players can update their room" ON game_rooms
  FOR UPDATE USING (
    player1_id IS NOT NULL OR player2_id IS NOT NULL
  );

-- Create an index for faster room lookups
CREATE INDEX idx_game_rooms_room_id ON game_rooms(room_id);

-- Set up realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE game_rooms;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_game_rooms_updated_at
  BEFORE UPDATE ON game_rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
