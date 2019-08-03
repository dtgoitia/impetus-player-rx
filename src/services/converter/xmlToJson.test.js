import xmlToJson from './xmlToJson';
import { json, xml } from './test-values';

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
  //   expect(xmlToJson(xml.loop.nested1Entry))
  //     .toEqual(json.loop.nested1Entry);
  // });
  // xit('should convert XML nested loop with multiple entries to JSON', () => {
  //   expect(xmlToJson(xml.loop.nested2Entries))
  //     .toEqual(json.loop.nested2Entries);
  // });
  it('should convert XML preset to JSON', () => {
    expect(xmlToJson(xml.preset)).toEqual(json.preset);
  });
});
