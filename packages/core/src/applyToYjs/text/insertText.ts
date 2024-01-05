import { InsertTextOperation, Node, Text } from 'slate';
import { getYTarget } from '../../utils/location';
import { getProperties } from '../../utils/slate';
import { SharedRoot } from '../../model/types';

export function insertText(
  sharedRoot: SharedRoot,
  slateRoot: Node,
  op: InsertTextOperation
): void {
  const { yParent: target, textRange } = getYTarget(
    sharedRoot,
    slateRoot,
    op.path
  );

  const targetNode = Node.get(slateRoot, op.path);
  if (!Text.isText(targetNode)) {
    throw new Error('Cannot insert text into non-text node');
  }

  target.insert(
    textRange.start + op.offset,
    op.text,
    getProperties(targetNode)
  );
}
