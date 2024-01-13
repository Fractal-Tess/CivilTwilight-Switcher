import { ENV } from './env';
import * as cheerio from 'cheerio';
import { DateData } from './types';

export async function getData() {
  const year = new Date().getFullYear();
  const data: DateData[] = [];

  for (let m = 1; m < 12; m++) {
    const url = `https://www.timeanddate.com/sun/${ENV.COUNTRY}/${ENV.CITY}?month=${m}&year=${year}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Error fetching url - ${url}`);
    }
    const html = await res.text();

    const $ = cheerio.load(html);

    const monthlyData = $('#as-monthsun > tbody > tr')
      .map((_, e) => {
        if ($(e).find('td').length < 5) return;
        return {
          month: m,
          day: +$(e).attr('data-day')!,
          start: $(e)
            .find('td:nth-child(10)')
            .text()
            .replace(/[^\d+.\d+].*/, ''),
          end: $(e)
            .find('td:nth-child(11)')
            .text()
            .replace(/[^\d+.\d+].*/, '')
        } as DateData;
      })
      .get();

    data.push(...monthlyData);
  }
  return data;
}
