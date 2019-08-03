// --- TEST DEFAULT VALUES ----------------------------------------------------

const LOOP_DESCRIPTION = 'loop description';
const PARENT_LOOP_DESCRIPTION = 'parent loop description';
const PRESET_DESCRIPTION = 'preset description';
const PRESET_SUMMARY = 'preset summary';

// --- XML --------------------------------------------------------------------

const xmlBtimer = {
  noWorkNoPause: '<btimer desc="noWorkNoPause" pause="0" time="5000" work="0" />',
  noWorkPause: '<btimer desc="noWorkPause" pause="1" time="5000" work="0" />',
  workNoPause: '<btimer desc="workNoPause" pause="0" time="5000" work="1" />',
  workPause: '<btimer desc="workPause" pause="1" time="5000" work="1" />',
};
const xmlSimple1Entry = `<loop desc="${LOOP_DESCRIPTION}" rounds="3">
  ${xmlBtimer.workNoPause}
</loop>`;
const xmlSimple2Entries = `<loop desc="${LOOP_DESCRIPTION}" rounds="3">
  ${xmlBtimer.workNoPause}
  ${xmlBtimer.noWorkNoPause}
</loop>`;
const xmlNested1Entry = `<loop desc="${PARENT_LOOP_DESCRIPTION}" rounds="3">
  ${xmlBtimer.workNoPause}
  <loop desc="${LOOP_DESCRIPTION}" rounds="3">
    ${xmlBtimer.workNoPause}
  </loop>
</loop>`;
const xmlNested2Entries = `<loop desc="${PARENT_LOOP_DESCRIPTION}" rounds="3">
  ${xmlBtimer.workNoPause}
  <loop desc="${LOOP_DESCRIPTION}" rounds="3">
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
const xmlPreset = `<preset desc="${PRESET_DESCRIPTION}" summary="${PRESET_SUMMARY}">
  ${xmlBtimer.workNoPause}
  ${xmlLoop.simple2Entries}
</preset>`;
export const xml = {
  btimer: xmlBtimer,
  loop: xmlLoop,
  preset: xmlPreset,
};


// --- JSON -------------------------------------------------------------------

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
      jsonBtimer.noWorkNoPause,
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
    jsonLoop.simple2Entries,
  ],
};
export const json = {
  btimer: jsonBtimer,
  loop: jsonLoop,
  preset: jsonPreset,
}


// --- FlatJSON ---------------------------------------------------------------

const flatJsonBtimer = {
  noWorkNoPause: jsonBtimer.noWorkNoPause,
  noWorkPause:   jsonBtimer.noWorkPause,
  workPause:     jsonBtimer.workPause,
  workNoPause:   jsonBtimer.workNoPause,
};
const flatJsonLoop = {
  simple1Entry: [
    { ...flatJsonBtimer.workNoPause, loop: { description: LOOP_DESCRIPTION, totalRounds: 3, round: 0 } },
    { ...flatJsonBtimer.workNoPause, loop: { description: LOOP_DESCRIPTION, totalRounds: 3, round: 1 } },
    { ...flatJsonBtimer.workNoPause, loop: { description: LOOP_DESCRIPTION, totalRounds: 3, round: 2 } },
  ],
  simple2Entries: [
    { ...flatJsonBtimer.workNoPause,   loop: { description: LOOP_DESCRIPTION, totalRounds: 3, round: 0 } },
    { ...flatJsonBtimer.noWorkNoPause, loop: { description: LOOP_DESCRIPTION, totalRounds: 3, round: 0 } },
    { ...flatJsonBtimer.workNoPause,   loop: { description: LOOP_DESCRIPTION, totalRounds: 3, round: 1 } },
    { ...flatJsonBtimer.noWorkNoPause, loop: { description: LOOP_DESCRIPTION, totalRounds: 3, round: 1 } },
    { ...flatJsonBtimer.workNoPause,   loop: { description: LOOP_DESCRIPTION, totalRounds: 3, round: 2 } },
    { ...flatJsonBtimer.noWorkNoPause, loop: { description: LOOP_DESCRIPTION, totalRounds: 3, round: 2 } },
  ],
};
const flatJsonPreset = {
  type: 'preset',
  description: PRESET_DESCRIPTION,
  summary: PRESET_SUMMARY,
  plan: [
    flatJsonBtimer.workNoPause,
    ...flatJsonLoop.simple2Entries,
  ],
};
export const flatJson = {
  btimer: flatJsonBtimer,
  loop: flatJsonLoop,
  preset: flatJsonPreset,
}