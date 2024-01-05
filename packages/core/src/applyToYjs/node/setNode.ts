import { Node, SetNodeOperation } from 'slate';
import { getYTarget } from '../../utils/location';
import { SharedRoot } from '../../model/types';

export function setNode(
  sharedRoot: SharedRoot,
  slateRoot: Node,
  op: SetNodeOperation
): void {
  const { yTarget, textRange, yParent } = getYTarget(
    sharedRoot,
    slateRoot,
    op.path
  );

  if (yTarget) {
    Object.entries(op.newProperties).forEach(([key, value]) => {
      if (value === null) {
        return yTarget.removeAttribute(key);
      }

      yTarget.setAttribute(key, value);
    });

    return Object.entries(op.properties).forEach(([key]) => {
      if (!op.newProperties.hasOwnProperty(key)) {
        yTarget.removeAttribute(key);
      }
    });
  }

  const unset = Object.fromEntries(
    Object.keys(op.properties).map((key) => [key, null])
  );
  const newProperties = { ...unset, ...op.newProperties };

  yParent.format(
    textRange.start,
    textRange.end - textRange.start,
    newProperties
  );
}
