import * as fs from 'fs';

export const writeSwaggerJson = (path: string, document) => {
  fs.writeFileSync(`${path}/swagger.json`, JSON.stringify(document, null, 2), {encoding: 'utf8'});
};
