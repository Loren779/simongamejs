import { buttonIds as buttons, tones, ERROR_MOVE_DURATION } from '../constants';

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const createOscillator = (button, ctx, gain, type = 'triangle') => {
  const oscillator = ctx.createOscillator();
  oscillator.connect(gain);
  oscillator.type = type;
  oscillator.frequency.value = tones[button];

  return oscillator;
};

const createGainNode = (ctx) => {
  const gainNode = ctx.createGain();
  gainNode.connect(ctx.destination);

  return gainNode;
};

const buttonSound = (button) => {
  const btn = button;
  let oscillator; // oscillator needs to be created each time

  const start = () => {
    // A gain node for each sound, to avoid unwanted mix of the soundwaves
    const gainNode = createGainNode(audioCtx);
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    oscillator = createOscillator(btn, audioCtx, gainNode);
    oscillator.start();
    return gainNode;
  };

  const stop = (gainNode, time) => {
    // This avoid the unpleasant ticking noise that happens if the oscillator
    // stops suddenly: gain (volume) decreases gradually, in the given time
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001, audioCtx.currentTime + (time - 0.1),
    );
    oscillator.stop(audioCtx.currentTime + time);
    return oscillator;
  };

  const playError = (onEnded) => {
    const gainNode = createGainNode(audioCtx);
    gainNode.gain.value = 0.5;
    oscillator = createOscillator('error', audioCtx, gainNode, 'sawtooth');
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + ERROR_MOVE_DURATION);
    oscillator.onended = onEnded;
  };

  const disconnect = (gainNode) => {
    gainNode.disconnect(audioCtx.destination);
  };

  return { start, stop, playError, disconnect };
};

/*
  Return an object with button colors as keys and a function to generate and
  manage that sound as value
*/
const oscillators = buttons.map(button => ({ [button]: buttonSound(button) }));
export default Object.assign({}, ...oscillators);
