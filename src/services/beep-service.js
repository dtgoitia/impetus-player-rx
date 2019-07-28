import { countDownTimer } from "./countdown";

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const duration = {
  short: 0.1,
  long: 0.5,
};

const tone = {
  high: 7000,
  low: 6000,
};

class BeepService {
  static beep(frequency, duration) {
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = frequency;
    oscillator.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  static countDown(start) {
    countDownTimer(start)
      .subscribe(count => {
        count === 0
          ? this.beep(tone.high, duration.long)
          : this.beep(tone.low, duration.short);
      });
  }
}

export default BeepService;