import { timer, concat } from "rxjs";
import { take, map } from "rxjs/operators";

const speechEnabled = window.speechSynthesis.getVoices().length > 0;

class SpeechService {
  static say(message) {
    if (!message) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(message);
    if (speechEnabled) {
      window.speechSynthesis.speak(utterance);
    } else {
      const alternativeMessage = `[NO SPEECH ENABLED] ${message}`;
      console.log(alternativeMessage);
    }
  }

 static countDown(start, zeroMessage = null) {
    const countDown$ = timer(0, 1000)
      .pipe(
        take(start + 1),
        map(time => start - time),
        map(count => {
          return count === 0 && zeroMessage
            ? zeroMessage
            : `${count}`;
        }),
      );
    
    concat(countDown$)
      .subscribe(this.say);
  }
}

export default SpeechService;
