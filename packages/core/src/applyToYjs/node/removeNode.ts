import { Node, RemoveNodeOperation } from 'slate';
import { getYTarget } from '../../utils/location';
import { SharedRoot } from '../../model/types';

export function removeNode(
  sharedRoot: SharedRoot,
  slateRoot: Node,
  op: RemoveNodeOperation
): void {
  const { yParent: parent, textRange } = getYTarget(
    sharedRoot,
    slateRoot,
    op.path
  );
  parent.delete(textRange.start, textRange.end - textRange.start);
}
