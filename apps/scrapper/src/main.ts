import path from 'node:path';
import url from 'node:url';
import * as timeandate from './timeanddate';
import fs from 'node:fs/promises';
import { DateData } from './types';
import { ENV } from './env';

let data: DateData[] = [];
if (ENV.SCRAPPER === 'timeanddate') data = await timeandate.getData();

const filePath = path.resolve(
  url.fileURLToPath(import.meta.url),
  '../../data.json'
);
await fs.writeFile(filePath, JSON.stringify(data, null, 2));

console.log('Scrapping data done');
