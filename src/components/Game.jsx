import { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import RiveAnimation from './RiveAnimation';
import HomeBg from '../assets/HomeBg.png';
import Logo from '../assets/Logo.png';
import Heart from '../assets/Heart.svg';


// HealthDisplay component moved to the top level
const HealthDisplay = ({ myHealth, opponentHealth }) => {
  // Calculate the translateX percentage
  // Max health is 3, so:
  // health 3: 0%
  // health 2: -33.33%
  // health 1: -66.66%
  const calculateTransform = (currentHealth) => {
    const maxHealth = 3; // Assuming max health is 3
    if (currentHealth === maxHealth) {
      return 'translateX(0%)';
    } else if (currentHealth === 0) {
      return 'translateX(-100%)'; // Health is 0, bar is fully hidden
    } else {
      const percentage = ((maxHealth - currentHealth) / maxHealth) * 100;
      return `translateX(-${percentage}%)`;
    }
  };

  const myHealthBarStyle = {
    transform: calculateTransform(myHealth),
  };

  const oppHealthBarStyle = {
    transform: calculateTransform(opponentHealth),
  };

  return (
    <div className="health-display">
      <div className='my-health-container'>
        <div className='my-health-bar'>
          <div className='my-health-fill' style={myHealthBarStyle}></div>
        </div>
        <img src={Heart} className="health-heart-svg" alt="Heart icon" />
        <div className="my-health">
          My Health: {myHealth}
        </div>
      </div>
      <div className='my-health-container'>
        <div className='opp-health-bar'>
          <div className='opp-health-fill' style={oppHealthBarStyle}></div>
        </div>
        <img src={Heart} className="health-heart-svg" alt="Heart icon" />
        <div className="opponent-health">
          Opponent Health: {opponentHealth}
        </div>
      </div>
    </div>
  );
};

// Game component starts here
const Game = () => {
  const [roomInput, setRoomInput] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [lastAction, setLastAction] = useState(null);

  const {
    gameState,
    playerId,
    createRoom,
    joinRoom,
    shoot,
    subscribeToRoom,
    hideBullets,
    regenerateBullets
  } = useGameState();

  useEffect(() => {
    if (gameState.room) {
      const unsubscribe = subscribeToRoom(gameState.room.room_id);
      return unsubscribe;
    }
  }, [gameState.room, subscribeToRoom]);

  useEffect(() => {
    // Update last action when room state changes
    if (gameState.room?.last_action) {
      setLastAction(gameState.room.last_action);
    }
  }, [gameState.room?.last_action]);

  useEffect(() => {
    // Auto-hide bullet composition after 3 seconds when bullets are shown
    if (gameState.showBullets && gameState.bulletComposition) {
      const timer = setTimeout(() => {
        hideBullets();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [gameState.showBullets, hideBullets]);

  const handleCreateRoom = async () => {
    const roomId = await createRoom();
    if (roomId) {
      setCurrentRoom(roomId);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomInput.trim()) return;
    const success = await joinRoom(roomInput.toUpperCase());
    if (success) {
      setCurrentRoom(roomInput.toUpperCase());
    } else {
      // Replaced alert with a console log or a custom modal in a real app
      console.log('Room not found or room is full!');
    }
  };

  const handleShoot = async (target) => {
    const result = await shoot(target);
    if (result) {
      console.log('Shot result:', result);
      if (result.bulletsRegenerated) {
        console.log('New round started! Bullets regenerated.');
      }
    }
  };

  const isMyTurn = gameState.currentTurn === playerId;
  const isPlayer1 = playerId === gameState.room?.player1_id;
  const opponentHealth = isPlayer1 ? gameState.playerHealth.player2 : gameState.playerHealth.player1;
  const myHealth = isPlayer1 ? gameState.playerHealth.player1 : gameState.playerHealth.player2;

  if (!gameState.room) {
    return (
      <>
        <div className='bgImg-container'>
          <img src={HomeBg} className='bgImg' alt="Home Background"></img>
          <div className='logo'>
            <img src={Logo} alt="Logo"></img>
          </div>
        </div>

        <div className="lobby">
          <div className="lobby-section">
            <h2>Create Room</h2>
            <button onClick={handleCreateRoom}>
              Create New Room
            </button>
          </div>

          <div className="lobby-section">
            <h2>Join Room</h2>
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              maxLength={6}
            />
            <button onClick={handleJoinRoom}>
              Join Room
            </button>
          </div>
        </div>
      </>
    );
  }

  if (gameState.gameStatus === 'waiting') {
    return (
      <div className="waiting">
        <h2>Room: {currentRoom}</h2>
        <p>Waiting for another player to join...</p>
        <p>Share this room ID with your friend!</p>
      </div>
    );
  }

  if (gameState.gameStatus === 'finished') {
    const winner = gameState.playerHealth.player1 <= 0 ? 'Player 2' : 'Player 1';
    const iWon = (winner === 'Player 1' && isPlayer1) || (winner === 'Player 2' && !isPlayer1);

    return (
      <div className="game-over">
        <h2>{iWon ? 'You Won!' : 'You Lost!'}</h2>
        <p>Final Score:</p>
        <p>Your Health: {myHealth}</p>
        <p>Opponent Health: {opponentHealth}</p>
        <p>Rounds Played: {gameState.roundNumber}</p>
        <button onClick={() => window.location.reload()}>
          Play Again
        </button>
      </div>
    );
  }

  // Show bullet composition overlay when bullets are revealed
  if (gameState.showBullets && gameState.bulletComposition) {
    const isNewRound = gameState.roundNumber > 1;

    return (
      <div className="bullet-reveal">
        <h2>{isNewRound ? `Round ${gameState.roundNumber}!` : 'Round Starting!'}</h2>
        {isNewRound && (
          <p className="new-round-text">Rocks exhausted! New Rocks generated.</p>
        )}
        <div className="bullet-composition">
          <h3>Rock Composition:</h3>
          <div className="bullet-counts">
            <div className="real-bullets">
              🔴 Real Rocks: {gameState.bulletComposition.real}
            </div>
            <div className="fake-bullets">
              ⚪ Fake Rocks: {gameState.bulletComposition.fake}
            </div>
          </div>
          <p>Good luck! The Rocks have been shuffled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game">
      <div className="game-header">
        <h2>Room: {currentRoom}</h2>
        <div className="round-info">
          <span>Round: {gameState.roundNumber}</span>
        </div>
        <div className="bullet-info">
          Rocks remaining: {gameState.bullets.length - gameState.currentBulletIndex}
        </div>
        {/* HealthDisplay component used here */}
        <HealthDisplay myHealth={myHealth} opponentHealth={opponentHealth} />
      </div>

      <div className="game-content">
        <div className="animation-container">
          <RiveAnimation
            lastAction={lastAction}
            playerId={playerId}
            onAnimationTrigger={(trigger) => console.log('Animation triggered:', trigger)}
          />
        </div>

        <div className="game-info">
          <div className="turn-indicator">
            {isMyTurn ? "Your Turn" : "Opponent's Turn"}
          </div>

          {isMyTurn && (
            <div className="action-buttons">
              <button
                onClick={() => handleShoot('self')}
                className="shoot-self-btn"
              >
                Shoot Myself
              </button>
              <button
                onClick={() => handleShoot('opponent')}
                className="shoot-opponent-btn"
              >
                Shoot Opponent
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
