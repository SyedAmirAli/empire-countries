import * as path from 'path';

export const __DIR__ = path.join(__dirname, '../');
export const assetsDir = path.join(__DIR__, 'assets');
export const publicDir = path.join(__DIR__, 'public');
export const jsonDir = path.join(__DIR__, 'json');
export const publicPath = (...endpoints: Array<string>) => path.join(publicDir, ...endpoints);
export const assetsPath = (...endpoints: Array<string>) => path.join(assetsDir, ...endpoints);
export const jsonPath = (...endpoints: Array<string>) => path.join(jsonDir, ...endpoints);
