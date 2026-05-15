import fs from 'fs';
import path from 'path';
import * as ts from 'typescript';

const enTsPath = path.join('e:', 'New folder (3)', 'wearetisya-63766317', 'src', 'lib', 'i18n', 'translations', 'en.ts');
const componentsDir = path.join('e:', 'New folder (3)', 'wearetisya-63766317', 'src', 'components');

// A simple script to find t.something.something usages and check against en.ts
// Wait, we can just compile the project using tsc to check for errors!
