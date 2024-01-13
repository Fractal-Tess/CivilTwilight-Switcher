import { config } from 'dotenv';
import z from 'zod';

const validator = z.object({
  COUNTRY: z.string({ description: 'Country name' }),
  CITY: z.string({ description: 'City name' }),
  SCRAPPER: z.enum(['timeanddate'], {
    required_error: 'SCRAPPER is required',
    description: 'Possible options are: timeanddate'
  })
});

const { parsed } = config({ override: true });
const validated = validator.safeParse(parsed);
if (!validated.success) {
  console.log(validated.error.message);
  process.exit(1);
}

export const ENV = Object.freeze(validated.data);
