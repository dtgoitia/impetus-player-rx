import { flatJson, json } from './test-values';
import jsonToFlatJson from './jsonToJsonFlat';

describe('JSON to FlatJSON converter', () => {
  it('should convert JSON noWorkNoPause to FlatJSON', () => {
    expect(jsonToFlatJson(json.btimer.noWorkNoPause))
      .toEqual(flatJson.btimer.noWorkNoPause);
  });
  it('should convert JSON noWorkPause to FlatJSON', () => {
    expect(jsonToFlatJson(json.btimer.noWorkPause))
      .toEqual(flatJson.btimer.noWorkPause);
  });
  it('should convert JSON workNoPause to FlatJSON', () => {
    expect(jsonToFlatJson(json.btimer.workNoPause))
      .toEqual(flatJson.btimer.workNoPause);
  });
  it('should convert JSON workPause to FlatJSON', () => {
    expect(jsonToFlatJson(json.btimer.workPause))
      .toEqual(flatJson.btimer.workPause);
  });
  it('should convert JSON simple loop with a single entry to FlatJSON', () => {
    expect(jsonToFlatJson(json.loop.simple1Entry))
      .toEqual(flatJson.loop.simple1Entry);
  });
  it('should convert JSON simple loop with multiple entries to FlatJSON', () => {
    expect(jsonToFlatJson(json.loop.simple2Entries))
      .toEqual(flatJson.loop.simple2Entries);
  });
  // NESTED LOOPS NOT SUPPORTED
  // TODO: consider if it's worth adding nested loops after using the app for a few days
  // xit('should convert JSON nested loop with a single entry to FlatJSON', () => {
  //   expect(jsonToFlatJson(json.loop.nested1Entry))
  //     .toEqual(flatJson.loop.nested1Entry);
  // });
  // xit('should convert JSON nested loop with multiple entries to FlatJSON', () => {
  //   expect(jsonToFlatJson(json.loop.nested2Entries))
  //     .toEqual(flatJson.loop.nested2Entries);
  // });
  it('should convert JSON preset to FlatJSON', () => {
    expect(jsonToFlatJson(json.preset))
      .toEqual(flatJson.preset);
  });
});
