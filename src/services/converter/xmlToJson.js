import conver from 'xml-js';
import errors from '../errors';
import { objectFromEntries } from '../../utils/iter';
import { stringToNumber, stringToBoolean } from '../../utils/cast';
import { NodeType } from './constants';

const ATTRIBUTES = '_attributes';
export const AttributeType = {
  DESCRIPTION: 'desc',
  PAUSE: 'pause',
  ROUNDS: 'rounds',
  SUMMARY: 'summary',
  TIME: 'time',
  WORK: 'work',
};

function transformObject(obj, fun) {
  // Iterate over each object entry transforming both key and value
  return objectFromEntries(
    Object.entries(obj).map(fun),
  );
}

function attributeMapper(entry) {
  const key = entry[0];
  const value = entry[1];
  switch (key) {
    case AttributeType.DESCRIPTION:
      return [ 'description', value ];
    case AttributeType.PAUSE:
      return [ key, stringToBoolean(value) ];
    case AttributeType.ROUNDS:
      return [ key, stringToNumber(value) ];
    case AttributeType.SUMMARY:
      return [ key, value ];
    case AttributeType.TIME:
      return [ key, stringToNumber(value) ];
    case AttributeType.WORK:
      return [ key, stringToBoolean(value) ];
    default:
      return entry;
  }
};

function getAttributes(json) {
  return transformObject(json[ATTRIBUTES], attributeMapper);
}

function getChildren(json) {
  // Apply `tweakRecursive` to any non-attributes (aka: children)
  return [...Object.keys(json)]
    .filter(key => key !== ATTRIBUTES)
    .flatMap(key => {
      const value = json[key];
      return Array.isArray(value)
        ? value.map(item => tweakRecursive(item, key))
        : tweakRecursive(value, key);
    });
}

function tweakRecursive(json, typeAsArg = null) {
  // Recursivelly tweak JSON spitted by the xml-js library
  const type = typeAsArg
    ? typeAsArg
    : Object.keys(json)[0];

  switch (type) {
    case NodeType.BTIMER: {
      const attributes = typeAsArg
        ? getAttributes(json)
        : getAttributes(json[type]);
      return { type, ...attributes };
    }
    case NodeType.LOOP: {
      const content = typeAsArg
        ? json
        : json[type];
      return {
        type,
        ...getAttributes(content),
        plan: getChildren(content),
      };
    }
    case NodeType.PRESET: {
      const content = json[type];
      return {
        type,
        ...getAttributes(content),
        plan: getChildren(content),
      };
    }
    default:
      errors.push(new Error(`NodeType ${type} is not supported`));
      return null;
  }
}

export default function xmlToJson(xml) {
  const json = conver.xml2js(xml, {compact: true});
  return tweakRecursive(json);
}