import { NodeType } from './constants';

export default function jsonToFlatJson(json) {
  switch (json.type) {
    case NodeType.BTIMER: {
      return json;
    }

    case NodeType.LOOP: {
      const flatExpandedLoop = Array(json.rounds)
        .fill(null)  // Array(X) initialises with `undefine`s, which stops iterations
        .flatMap((_, round) => {                         // per loop round
          const tasksPerRound = json.plan.map(task => {  // per task inside loop
            return {
              ...task,
              loop: {
                description: json.description,
                totalRounds: json.rounds,
                round,
              }
            };
          });
          return tasksPerRound;
        })
      return flatExpandedLoop;
    }

    case NodeType.PRESET: {
      const plan = json.plan
        .flatMap((task) => jsonToFlatJson(task));
      return { ...json, plan };
    }
    
    default: {
      return json;
    }
  }
}
