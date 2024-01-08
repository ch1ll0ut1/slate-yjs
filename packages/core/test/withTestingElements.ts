import { Editor, Element, Transforms } from 'slate';
import * as Y from 'yjs';
import { wait } from '../../../support/utils';
import { assignSlateToDoc, withYjs } from '../src';

const INLINE_ELEMENTS = ['note-link', 'link'];

export async function withTestingElements(
  editor: Editor,
  doc: Y.Doc = new Y.Doc()
) {
  const { normalizeNode, isInline } = editor;

  // normalizations needed for nested tests
  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // remove empty list
    if (
      Element.isElement(node) &&
      !Editor.isEditor(node) &&
      // @ts-expect-error no type for element is defined since its just a test
      node.type === 'unordered-list'
    ) {
      if (!node.children.length) {
        return Transforms.removeNodes(editor, { at: path });
      }
    }

    normalizeNode(entry);
  };

  editor.isInline = (element) =>
    // @ts-expect-error no type for element is defined since its just a test
    INLINE_ELEMENTS.includes(element.type as string) || isInline(element);

  const sharedType = assignSlateToDoc(editor.children, doc);

  const e = withYjs(editor, sharedType, { autoConnect: true });

  // Wait for editor to be initialized
  await wait();

  return e;
}
