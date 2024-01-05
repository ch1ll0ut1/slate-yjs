import { Node, RemoveTextOperation } from 'slate';
import { getYTarget } from '../../utils/location';
import { SharedRoot } from '../../model/types';

export function removeText(
  sharedRoot: SharedRoot,
  slateRoot: Node,
  op: RemoveTextOperation
): void {
  const { yParent: target, textRange } = getYTarget(
    sharedRoot,
    slateRoot,
    op.path
  );
  target.delete(textRange.start + op.offset, op.text.length);
}
