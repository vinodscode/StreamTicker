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
    // Modern browsers require user interaction to create AudioContext
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Play the alert sound
 * @param volume Volume level (0.0 to 1.0)
 * @returns Promise that resolves when the sound starts playing
 */
export function playAlertSound(volume = 0.5): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Create audio element
      const audio = new Audio(ALERT_SOUND_BASE64);
      audio.volume = Math.min(1.0, Math.max(0.0, volume));
      
      // Play the sound
      const playPromise = audio.play();
      
      // Modern browsers return a promise from play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => resolve())
          .catch(err => {
            console.error('Error playing alert sound:', err);
            // Try alternative method if first method fails
            try {
              getAudioContext();
              const source = audioContext!.createBufferSource();
              fetch(ALERT_SOUND_BASE64)
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => audioContext!.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                  source.buffer = audioBuffer;
                  const gainNode = audioContext!.createGain();
                  gainNode.gain.value = volume;
                  source.connect(gainNode);
                  gainNode.connect(audioContext!.destination);
                  source.start(0);
                  resolve();
                })
                .catch(error => {
                  console.error('Failed to play alert sound (alternative method):', error);
                  reject(error);
                });
            } catch (e) {
              console.error('Failed to initialize audio context:', e);
              reject(e);
            }
          });
      } else {
        // For older browsers without promise support
        audio.addEventListener('playing', () => resolve());
        audio.addEventListener('error', err => reject(err));
      }
    } catch (err) {
      console.error('Error setting up audio playback:', err);
      reject(err);
    }
  });
}