import { Node, Operation } from 'slate';
import { SharedRoot } from '../model/types';

export type ApplyFunc<O extends Operation = Operation> = (
  sharedRoot: SharedRoot,
  slateRoot: Node,
  op: O
) => void;

export type OpMapper<O extends Operation = Operation> = {
  [K in O['type']]: O extends { type: K } ? ApplyFunc<O> : never;
};
