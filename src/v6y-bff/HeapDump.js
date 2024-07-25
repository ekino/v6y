import fs from 'fs';
import v8 from 'v8';

// Plus d'informations : https://nodejs.org/api/v8.html et https://nodejs.medium.com/introducing-node-js-12-76c41a1b3f3f
const snapshotStream = v8.getHeapSnapshot();

// It's important that the filename end with `.heapsnapshot`,
// otherwise Chrome DevTools won't open it.
const fileName = `dumps/${Date.now()}.heapsnapshot`;
const fileStream = fs.createWriteStream(fileName);

snapshotStream.pipe(fileStream);
