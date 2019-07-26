import PlayerService from './player-service';
import { SAMPLE_PRESET, SAMPLE_PRESET_INFLATED } from '../constants';
import { calculateDuration } from '../utils';

describe(PlayerService.name, () => {
  let service = new PlayerService(SAMPLE_PRESET);

  beforeEach(() => {
    service = new PlayerService(SAMPLE_PRESET);
  });

  describe('when a new instance is created', () => {
    it('should inflate tasks', () => {
      expect(service.tasks).toEqual(SAMPLE_PRESET_INFLATED);
    });
    it('should calculate preset total duration', () => {
      const presetDuration = calculateDuration(SAMPLE_PRESET_INFLATED);
      expect(service.presetDuration).toEqual(presetDuration);
    });
    it('should assign the first task to the current task', () => {
      expect(service.currentTask).toEqual(SAMPLE_PRESET_INFLATED[0]);
    });
    it('should assign the second task to the next task', () => {
      expect(service.nextTask).toEqual(SAMPLE_PRESET_INFLATED[1]);
    });
  });

  describe('when the player has not started yet', () => {
    describe(`when ${service.play.name} is called`, () => {
      it('should subscribe to a timer', () => {
        service.play();
        expect(service.subscription).toBeDefined();
      });
      test.todo('should subscribe to a timer starting from the current time');
    });

    describe(`when ${service.stop.name} is called`, () => {
      beforeEach(() => {
        service.stop();
      });
      it('should clean up any ongoing subscription', () => {
        expect(service.subscription).toBeNull();
      });
      test.todo(`should call ${service.pause.name}`);
      test.todo(`should call ${service.resetPlayer.name}`);
    });

    test.todo('think about combinations!');
  });

  describe('when the player is playing', () => {
    beforeEach(() => {
      service.play();
    });

    describe(`when ${service.pause.name} is called`, () => {
      beforeEach(() => {
        service.pause();
      });
      it('should clean up any ongoing subscription', () => {
        expect(service.subscription.closed).toEqual(true);
      });
      test.todo('should subscribe to a timer starting from the current time');
    });

    describe(`when ${service.stop.name} is called`, () => {
      beforeEach(() => {
        service.stop();
      });
      it('should clean up any ongoing subscription', () => {
        expect(service.subscription.closed).toEqual(true);
      });
      test.todo(`should call ${service.pause.name}`);
      test.todo(`should call ${service.resetPlayer.name}`);
    });

    test.todo('think about more combinations!');
  });

  describe('when the player is paused', () => {
    beforeEach(() => {
      service.play();
      service.pause();
    });
    test.todo('think about more combinations!');

    describe(`when ${service.play.name} is called`, () => {
      it('should subscribe to a timer', () => {
        service.play();
        expect(service.subscription).toBeDefined();
      });
      test.todo('should subscribe to a timer starting from the current time');
    });

    describe(`when ${service.stop.name} is called`, () => {
      beforeEach(() => {
        service.stop();
      });
      it('should clean up any ongoing subscription', () => {
        expect(service.subscription.closed).toEqual(true);
      });
      test.todo(`should call ${service.pause.name}`);
      test.todo(`should call ${service.resetPlayer.name}`);
    });
  });

  describe(`when ${service.resetPlayer.name} is called`, () => {
    beforeEach(() => {
      service.resetPlayer();
    });
    it('should reset current time to zero', () => {
      expect(service.currentTime).toEqual(0);
    });
    it('should assign the first task to the current task', () => {
      expect(service.currentTask).toEqual(SAMPLE_PRESET_INFLATED[0]);
    });
    it('should assign the second task to the next task', () => {
      expect(service.nextTask).toEqual(SAMPLE_PRESET_INFLATED[1]);
    });
  });

  describe(`when ${service.restart.name} is called`, () => {
    test.todo(`should call ${service.pause.name}`);
    it('should shift the time to the start of the current task', () => {
      service.restart();
      expect(service.currentTime).toEqual(service.currentTask.start);
    });
  });
});
