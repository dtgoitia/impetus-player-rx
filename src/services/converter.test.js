import { xmlToJson } from './converter';

const xmlBtimer = {
  noWorkNoPause: '<btimer desc="noWorkNoPause" pause="0" time="5000" work="0" />',
  noWorkPause: '<btimer desc="noWorkPause" pause="1" time="5000" work="0" />',
  workNoPause: '<btimer desc="workNoPause" pause="0" time="5000" work="1" />',
  workPause: '<btimer desc="workPause" pause="1" time="5000" work="1" />',
};
const xmlSimple1Entry = `<loop desc="loop description" rounds="3">
  ${xmlBtimer.workNoPause}
</loop>`;
const xmlSimple2Entries = `<loop desc="loop description" rounds="3">
${xmlBtimer.workNoPause}
${xmlBtimer.workNoPause}
</loop>`;
const xmlNested1Entry = `<loop desc="parent loop description" rounds="3">
  ${xmlBtimer.workNoPause}
  <loop desc="loop description" rounds="3">
    ${xmlBtimer.workNoPause}
  </loop>
</loop>`;
const xmlNested2Entries = `<loop desc="parent loop description" rounds="3">
  ${xmlBtimer.workNoPause}
  <loop desc="loop description" rounds="3">
    ${xmlBtimer.workNoPause}
    ${xmlBtimer.workNoPause}
  </loop>
</loop>`;
const xmlLoop = {
  simple1Entry: xmlSimple1Entry,
  simple2Entries: xmlSimple2Entries,
  nested1Entry: xmlNested1Entry,
  nested2Entries: xmlNested2Entries,
};
const xmlPreset = `<preset desc="preset description" summary="preset summary">
  ${xmlBtimer.workNoPause}
  ${xmlLoop.simple1Entry}
</preset>`;
const xml = {
  btimer: xmlBtimer,
  loop: xmlLoop,
  preset: xmlPreset,
};

const jsonBtimer = {
  noWorkNoPause: { type: 'btimer', description: 'noWorkNoPause', pause: false, time: 5000, work: false, },
  noWorkPause:   { type: 'btimer', description: 'noWorkPause',   pause: true,  time: 5000, work: false, },
  workNoPause:   { type: 'btimer', description: 'workNoPause',   pause: false, time: 5000, work: true, },
  workPause:     { type: 'btimer', description: 'workPause',     pause: true,  time: 5000, work: true, },
};
const jsonLoop = {
  simple1Entry: {
    type: 'loop',
    description: 'loop description',
    rounds: 3,
    plan: [
      jsonBtimer.workNoPause,
    ],
  },
  simple2Entries: {
    type: 'loop',
    description: 'loop description',
    rounds: 3,
    plan: [
      jsonBtimer.workNoPause,
      jsonBtimer.workNoPause,
    ],
  },
  nested1Entry: {
    type: 'loop',
    description: 'parent loop description',
    rounds: 3,
    plan: [
      {
        description: 'loop description',
        rounds: 3,
        plan: [
          jsonBtimer.workPause,
        ],
      },
      jsonBtimer.workNoPause,
    ],
  },
  nested2Entries: {
    type: 'loop',
    description: 'parent loop description',
    rounds: 3,
    plan: [
      {
        description: 'loop description',
        rounds: 3,
        plan: [
          jsonBtimer.workPause,
        ],
      },
      jsonBtimer.workNoPause,
    ],
  },
}
const jsonPreset = {
  type: 'preset',
  description: 'preset description',
  summary: 'preset summary',
  plan: [
    jsonBtimer.workNoPause,
    jsonLoop.simple1Entry,
  ],
};
const json = {
  btimer: jsonBtimer,
  loop: jsonLoop,
  preset: jsonPreset,
}

fdescribe('converters', () => {
  describe('XML to JSON converter', () => {
    it('should convert XML noWorkNoPause to JSON', () => {
      expect(xmlToJson(xml.btimer.noWorkNoPause))
        .toEqual(json.btimer.noWorkNoPause);
    });
    it('should convert XML noWorkPause to JSON', () => {
      expect(xmlToJson(xml.btimer.noWorkPause))
        .toEqual(json.btimer.noWorkPause);
    });
    it('should convert XML workNoPause to JSON', () => {
      expect(xmlToJson(xml.btimer.workNoPause))
        .toEqual(json.btimer.workNoPause);
    });
    it('should convert XML workPause to JSON', () => {
      expect(xmlToJson(xml.btimer.workPause))
        .toEqual(json.btimer.workPause);
    });
    it('should convert XML simple loop with a single entry to JSON', () => {
      expect(xmlToJson(xml.loop.simple1Entry))
        .toEqual(json.loop.simple1Entry);
    });
    it('should convert XML simple loop with multiple entries to JSON', () => {
      expect(xmlToJson(xml.loop.simple2Entries))
        .toEqual(json.loop.simple2Entries);
    });
    // NESTED LOOPS NOT SUPPORTED
    // TODO: consider if it's worth adding nested loops after using the app for a few days
    // xit('should convert XML nested loop with a single entry to JSON', () => {
    //   expect(XmlToJson(xml.loop.nested1Entry))
    //     .toEqual(json.loop.nested1Entry);
    // });
    // xit('should convert XML nested loop with multiple entries to JSON', () => {
    //   expect(XmlToJson(xml.loop.nested2Entries))
    //     .toEqual(json.loop.nested2Entries);
    // });
    it('should convert XML preset to JSON', () => {
      expect(xmlToJson(xml.preset)).toEqual(json.preset);
    });
  });
});
