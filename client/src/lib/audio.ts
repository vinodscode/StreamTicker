/**
 * Utility for playing alert sounds
 */

// Alert sound base64 encoding (short beep sound)
const ALERT_SOUND_BASE64 = 'data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyK20AVFBFMQAAAAcAAANXYXJuaW5nAFRDT04AAAAHAAADV2FybmluZwBUQUxCAAAABgAAADIyK20AVFNTRQAAAAQAAANQQ00AVFJDSwAAAAIAAAAwAENPTU0AAAAQAAAAZW5nAEJpZyBTb3VuZCAAVENPTQAAAAsAAABlbmcAV2FybmluZwBUQ09NAAAADwAAAGVuZwBCaWdTb3VuZC5jb20AVElUMwAAAAsAAABlbmcAV2FybmluZwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAABAAACCQD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAAA8TEFNRTMuMTAwAZUAAAAAAAAAABQgJAGXQQABmgAAAgkhy551AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//vA5AAAAWUAUiUAAAgAAA/woAABBNQFa5gRQAj8D7ADCjAAAEAQUAAv/CCiB//5MP/yIFD/+RGP/8jJP/kBAoQOAQQQf/kR//kmHK1A4QhzxE4BxiMQMiEgQdAQOQDxM4h8A9JQUhImhIZOf/9xBAEgQkpxYgBISAJAYRAEP///yhYRCQn//JYQ8XCSQCyQoichISGweBGf/wIICDhCggEITyT//+4SEBCAQBBAQDxf//+UPAYIhIQPl///8m7////6RGQEQCIEIHQGNyoAWveLS1at61bYFCBQjEtWJeukr3vX7bt65P///jsBv/8oAgJj9ZJavWkSv/9IEhYaMmmHMvqCYRKEYjkSiWS2X//y+SU7p3LVu1e9vWTCPQcJBAYJKilq9agvr//uBSxIECNSSURr/a3pAoKL2pN2QUqYRmkhX4MKhaKhqRIAHigAQAYYp0GC/0//+GCP//xgWGxpqbWmL//6O9f//9ptYPFRUSDCx4xZGn////JFwJq3S+lqxL1/+1adksasFWkCqvVVYzILCSBgIGDxQs7VLUlquJYl9b11OiUQOLFCYEKLFCxcsULPixU2sLlDZdxqBIDBg5QkLmzpSvWCLODhQmDRoiGHBIEWf/7MMTvg4DsAOv8xIAQAAA0gAAABP/+WLED/ziBYDwWQBB/5AHAYP/LA44DBxguAwceLgYQIgsMDhg44TcOGCZ///5EbB///+XKlzhkoXOHCBUuWNkgICQmCQQELmzpQsWJkzhQmSJEyRc4UJlChQoUKFf/yIqB85///IFQfIlS54qUKlihUoUKFTx8uTJnipQsVOmjZYuYMmzRAQCAYDh///7////18ucJgUgUIhc6fOljho0dPnS5soTJFCRIqcLFzp04UJEgJDBAkLnzpw6cLihY9///9qT//Iqf/yY+PFhYXFzpY6dPHjxwyUJEyJE4TIlSJYuXKkCQOAkIggWFz5wueOlDH//Of/+ZP/5AQAoOQ0qj//ytlBGUhd3//2ZZbM4///Mv////wGP//wBH//AFUP///y3qbEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';

// Cached audio context instance
let audioContext: AudioContext | null = null;

/**
 * Initialize or get the audio context
 */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    try {
      // Modern browsers require user interaction to create AudioContext
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Ensure the context is running (needed for Chrome's autoplay policy)
      if (audioContext.state === 'suspended') {
        const resumeAudio = () => {
          audioContext?.resume();
          // Remove the event listeners once the context is resumed
          document.removeEventListener('click', resumeAudio);
          document.removeEventListener('touchstart', resumeAudio);
          document.removeEventListener('keydown', resumeAudio);
          console.log('Audio context resumed after user interaction');
        };
        
        // Add event listeners to resume audio context on user interaction
        document.addEventListener('click', resumeAudio);
        document.addEventListener('touchstart', resumeAudio);
        document.addEventListener('keydown', resumeAudio);
        console.log('Audio context is suspended - waiting for user interaction');
      }
    } catch (e) {
      console.error('Failed to initialize audio context:', e);
    }
  }
  return audioContext!;
}

/**
 * Play a silent sound to unlock audio playback
 * This should be called on some user interaction like a click event
 */
export function unlockAudio(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const context = getAudioContext();
      
      // Create silent buffer and play it
      const buffer = context.createBuffer(1, 1, 22050);
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
      
      console.log('Audio system unlocked by user interaction');
      resolve();
    } catch (e) {
      console.warn('Could not unlock audio:', e);
      resolve(); // Resolve anyway, don't reject
    }
  });
}

// Try to initialize audio on page load to prepare for sound playback
window.addEventListener('DOMContentLoaded', () => {
  // Initialize the audio context so it's ready to play when needed
  getAudioContext();
  
  // Add click handler to unlock audio on first user interaction
  const unlockOnUserAction = () => {
    unlockAudio().then(() => {
      // Remove event listeners once audio is unlocked
      document.removeEventListener('click', unlockOnUserAction);
      document.removeEventListener('touchstart', unlockOnUserAction);
      document.removeEventListener('keydown', unlockOnUserAction);
    });
  };
  
  document.addEventListener('click', unlockOnUserAction);
  document.addEventListener('touchstart', unlockOnUserAction);
  document.addEventListener('keydown', unlockOnUserAction);
});

/**
 * Play the alert sound
 * @param volume Volume level (0.0 to 1.0)
 * @returns Promise that resolves when the sound starts playing
 */
export function playAlertSound(volume = 0.5): Promise<void> {
  return new Promise((resolve) => {
    try {
      // First try using Audio element
      const audio = new Audio(ALERT_SOUND_BASE64);
      audio.volume = Math.min(1.0, Math.max(0.0, volume));
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Alert sound played successfully');
            resolve();
          })
          .catch(() => {
            // If Audio element fails, try WebAudio API
            tryPlayWithWebAudio(volume).then(resolve).catch(() => {
              // Both methods failed but we resolve anyway to prevent errors
              console.log('All audio playback methods failed');
              resolve();
            });
          });
      } else {
        // For older browsers without promise support
        audio.addEventListener('playing', () => resolve());
        audio.addEventListener('error', () => {
          // Try WebAudio if HTML Audio fails
          tryPlayWithWebAudio(volume).then(resolve).catch(() => resolve());
        });
      }
    } catch (err) {
      console.warn('Error setting up audio playback:', err);
      // Try WebAudio if HTML Audio fails
      tryPlayWithWebAudio(volume).then(resolve).catch(() => resolve());
    }
  });
}

/**
 * Helper function to try playing sound with WebAudio API
 */
function tryPlayWithWebAudio(volume: number): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const context = getAudioContext();
      
      if (context.state === 'suspended') {
        context.resume().catch(e => console.warn('Could not resume audio context:', e));
      }
      
      // Since we can't load the MP3 directly, use oscillator for simplicity
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(440, context.currentTime); // A4 note
      
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
      
      console.log('Alert sound played with WebAudio API');
      setTimeout(() => resolve(), 100); // Resolve after sound begins
    } catch (e) {
      console.warn('WebAudio playback failed:', e);
      reject(e);
    }
  });
}