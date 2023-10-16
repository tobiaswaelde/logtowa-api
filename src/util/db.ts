import { ValueTransformer } from 'typeorm';

export const jsonTransformer: ValueTransformer = {
  to: (value: any) => JSON.stringify(value),
  from: (value: any) => JSON.parse(value),
};
