import { Descendant, Editor, Element, Node, Text } from 'slate';
import * as Y from 'yjs';
import { DeltaInsert, InsertDelta, SharedRoot } from '../model/types';
import { yTextToInsertDelta } from './delta';
import { getProperties } from './slate';

export function yTextToSlateElement(yText: Y.XmlText): Element {
  const delta = yTextToInsertDelta(yText);

  const children =
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    delta.length > 0 ? delta.map(deltaInsertToSlateNode) : [{ text: '' }];

  return { ...yText.getAttributes(), children };
}

export function deltaInsertToSlateNode(insert: DeltaInsert): Node {
  if (typeof insert.insert === 'string') {
    return { ...insert.attributes, text: insert.insert };
  }

  return yTextToSlateElement(insert.insert);
}

export function slateNodesToInsertDelta(nodes: Node[]): InsertDelta {
  return nodes.map((node) => {
    if (Text.isText(node)) {
      return { insert: node.text, attributes: getProperties(node) };
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return { insert: slateElementToYText(node) };
  });
}

export function slateElementToYText({
  children,
  ...attributes
}: Element): Y.XmlText {
  const yElement = new Y.XmlText();

  Object.entries(attributes).forEach(([key, value]) => {
    yElement.setAttribute(key, value);
  });

  yElement.applyDelta(slateNodesToInsertDelta(children), { sanitize: false });
  return yElement;
}

/////////////////
/////////////////
/////////////////
/////////////////
/////////////////
/////////////////
/////////////////
/////////////////
/////////////////
/////////////////



function slateToY(node: Descendant): Y.XmlText | Y.XmlElement {

  if (Text.isText(node)) {
    const { text, ...attributes } = node;
    const yText = new Y.XmlText(text);

    Object.entries(attributes).forEach(([key, value]) => {
      yText.setAttribute(key, value);
    });

    return yText;
  }

  if (Element.isElement(node)) {
    const { children, ...attributes } = node;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const nodeName = node.type as string;
    const yElement = new Y.XmlElement(nodeName);

    children.forEach((child, index) => {
      yElement.insert(index, [slateToY(child)]);
    });

    Object.entries(attributes).forEach(([key, value]) => {
      // @ts-expect-error wrong type definition: any type is allowed by Yjs
      yElement.setAttribute(key, value);
    });

    return yElement;
  }

  throw new Error('Invalid node');
}

function yToSlate(element: Y.XmlText | Y.XmlElement): Descendant {
  if (element instanceof Y.XmlText) {
    return {
      text: element.toString(),
      ...element.getAttributes(),
    };
  }

  const node: Element = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    type: element.nodeName as Element['type'],
    ...element.getAttributes(),
    children: element.toArray().map((child) => {
      if (child instanceof Y.XmlHook) {
        throw new Error('XmlHook not supported');
      }

      return yToSlate(child);
    }),
  };

  return node;
}

export function assignSlateToDoc(nodes: Descendant[], doc: Y.Doc): SharedRoot {
  const yElement = doc.get('content', Y.XmlElement) as Y.XmlElement;

  if (yElement.length === 0) {
    nodes.forEach((child, index) => {
      yElement.insert(index, [slateToY(child)]);
    });
  }

  return yElement;
}

export function convertYToSlate(element: SharedRoot): Descendant[] {
  return element.toArray().map((child) => {
    if (child instanceof Y.XmlHook) {
      throw new Error('XmlHook not supported');
    }

    return yToSlate(child);
  });
}
