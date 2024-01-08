import { Logger } from '@hocuspocus/extension-logger';
import { SQLite } from '@hocuspocus/extension-sqlite';
import { Server } from '@hocuspocus/server';
import { assignSlateToDoc } from '@slate-yjs/core';
import * as Y from 'yjs';
import initialValue from './data/initialValue.json';

// Minimal hocuspocus server setup with logging. For more in-depth examples
// take a look at: https://github.com/ueberdosis/hocuspocus/tree/main/demos/backend
const server = Server.configure({
  port: parseInt(process.env.PORT ?? '', 10) || 1234,

  extensions: [
    new Logger(),
    new SQLite({
      database: 'db.sqlite',
    }),
  ],

  async onLoadDocument(data) {
    if (data.document.isEmpty('content')) {
      return assignSlateToDoc(initialValue, data.document)
    }

    return data.document;
  },
});

server.enableMessageLogging();
server.listen();
