# Utils

`@slate-yjs/core` provides several helpers for converting from and to slate nodes, and for working with locations. They are used for initializing documents and act as a baseline for other by slate-yjs provided packages.

<br/>

**`convertYToSlate(element: Y.XmlFragment): Descendant[]`**

Convert a Y.XmlFragment to a slate element. Useful when serializing documents from shared roots.

**`assignSlateToDoc(nodes: Descendant[], doc: Y.Doc)`**

Convert slate nodes and assign to Doc. Useful when initializing documents.
To initialize in a single update, either wrap in a transaction or create a temporary Doc and then use `Y.encodeStateAsUpdate` and `Y.applyUpdate`

**`slateRangeToRelativeRange(sharedRoot: SharedRoot, slateRoot: Node, range: BaseRange): RelativeRange`**

Get a relative range for a slate range.

**`relativeRangeToSlateRange(sharedRoot: SharedRoot, slateRoot: Node, range: RelativeRange): BaseRange | null`**

Get a slate range for a relative range. Returns null if the anchor/focus or both aren't part of the document anymore.

**`slatePointToRelativePosition(sharedRoot: SharedRoot, slateRoot: Node, point: BasePoint): Y.RelativePosition`**

Get a [relative position](https://docs.yjs.dev/api/relative-positions) for a slate point.

**`relativePositionToSlatePoint( sharedRoot: SharedRoot, slateRoot: Node, pos: Y.RelativePosition ): BasePoint | null`**

Get a slate point for a relative position. Returns null if the relative position isn't part of the document anymore.
