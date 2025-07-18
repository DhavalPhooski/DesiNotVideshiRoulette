import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { useEffect, useMemo } from 'react';

const RiveAnimation = ({ lastAction, playerId }) => {
  const { rive, RiveComponent } = useRive({
    src: '/DesiGame.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
  });

  // Call useStateMachineInput hooks at the top level
  const fakeMtoM = useStateMachineInput(rive, 'State Machine 1', 'Fake_MtoM');
  const realMtoM = useStateMachineInput(rive, 'State Machine 1', 'Real_MtoM');
  const fakeMtoO = useStateMachineInput(rive, 'State Machine 1', 'Fake_MtoO');
  const realMtoO = useStateMachineInput(rive, 'State Machine 1', 'Real_MtoO');
  const fakeOtoO = useStateMachineInput(rive, 'State Machine 1', 'Fake_OtoO');
  const realOtoO = useStateMachineInput(rive, 'State Machine 1', 'Real_OtoO');
  const realOtoM = useStateMachineInput(rive, 'State Machine 1', 'Real_OtoM');
  const fakeOtoM = useStateMachineInput(rive, 'State Machine 1', 'Fake_OtoM');

  // Map of all state machine inputs for easy access
  const inputs = useMemo(() => ({
    Fake_MtoM: fakeMtoM,
    Real_MtoM: realMtoM,
    Fake_MtoO: fakeMtoO,
    Real_MtoO: realMtoO,
    Fake_OtoO: fakeOtoO,
    Real_OtoO: realOtoO,
    Real_OtoM: realOtoM,
    Fake_OtoM: fakeOtoM,
  }), [
    fakeMtoM,
    realMtoM,
    fakeMtoO,
    realMtoO,
    fakeOtoO,
    realOtoO,
    realOtoM,
    fakeOtoM,
  ]);


  useEffect(() => {
    // Exit if rive isn't ready or there's no action
    if (!rive || !lastAction) return;

    const { shooter, target, bullet } = lastAction;
    let triggerName = '';

    // Determine the animation from the current player's perspective
    const isShooterMe = shooter === playerId;
    const isTargetMe = target === playerId;

    if (isShooterMe) {
      // I am the shooter
      if (isTargetMe) { // Me shooting Myself
        triggerName = bullet === 'real' ? 'Real_MtoM' : 'Fake_MtoM';
      } else { // Me shooting Opponent
        triggerName = bullet === 'real' ? 'Real_MtoO' : 'Fake_MtoO';
      }
    } else {
      // The opponent is the shooter
      if (isTargetMe) { // Opponent shooting Me
        triggerName = bullet === 'real' ? 'Real_OtoM' : 'Fake_OtoM';
      } else { // Opponent shooting Themselves
        triggerName = bullet === 'real' ? 'Real_OtoO' : 'Fake_OtoO';
      }
    }

    console.log(`PLAYER VIEW: ${playerId} | ACTION: ${shooter} shot ${target} | RESULTING TRIGGER: ${triggerName}`);

    // Fire the correct animation using the locally calculated triggerName
    const triggerToFire = inputs[triggerName];
    if (triggerToFire) {
      triggerToFire.fire();
    }

  }, [lastAction, rive, playerId, inputs]); 

  return (
    <div className="rive-container">
      <RiveComponent />
    </div>
  );
};

export default RiveAnimation;