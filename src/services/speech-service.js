import { concat } from "rxjs";
import { countDownTimer } from "./countdown";
import { map } from "rxjs/operators";

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
   const countDownWithZeroMessage$ = countDownTimer(start)
      .pipe(
        map(count => {
          return count === 0 && zeroMessage
            ? zeroMessage
            : `${count}`;
        }),
      );
    
    concat(countDownWithZeroMessage$)
      .subscribe(this.say);
  }
}

export default SpeechService;
