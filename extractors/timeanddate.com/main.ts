import * as cheerio from 'cheerio';
import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

const year = new Date().getFullYear();
const filePath = path.resolve(
  url.fileURLToPath(import.meta.url),
  '../../../data.json'
);

console.log(filePath);
const file = await fs.open(filePath, 'w');

type DateData = {
  civilTwilight: {
    month: number;
    day: number;
    start: string;
    end: string;
  };
};

const dataArr: DateData[] = [];
for (let m = 1; m < 12; m++) {
  const url = `https://www.timeanddate.com/sun/bulgaria/sofia?month=${m}&year=${year}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error fetching url - ${url}`);
  }
  const html = await res.text();

  const $ = cheerio.load(html);

  const data = $('#as-monthsun > tbody > tr')
    .map((_, e) => {
      if ($(e).find('td').length < 5) return;
      return {
        // TODO: maybe add other light states
        civilTwilight: {
          month: m,
          day: +$(e).attr('data-day')!,
          start: $(e)
            .find('td:nth-child(10)')
            .text()
            .replace(/[^\d+.\d+].*/, ''),
          end: $(e)
            .find('td:nth-child(11)')
            .text()
            .replace(/[^\d+.\d+].*/, ''),
        },
      } as DateData;
    })
    .get();

  dataArr.push(...data);
}

file.write(JSON.stringify(dataArr));
