import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
describe('TypeScript Configuration', () => {
    const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');
    let tsconfig;
    beforeAll(() => {
        const content = fs.readFileSync(tsconfigPath, 'utf-8');
        tsconfig = JSON.parse(content);
    });
    describe('Strict mode', () => {
        it('should enable strict mode', () => {
            expect(tsconfig.compilerOptions).toHaveProperty('strict', true);
        });
    });
    describe('Modern JavaScript target', () => {
        it('should target ES2022', () => {
            const compilerOptions = tsconfig.compilerOptions;
            expect(compilerOptions.target).toBe('ES2022');
        });
    });
    describe('Path alias configuration', () => {
        it('should set baseUrl to root', () => {
            const compilerOptions = tsconfig.compilerOptions;
            expect(compilerOptions.baseUrl).toBe('.');
        });
        it('should configure @/* path alias', () => {
            const compilerOptions = tsconfig.compilerOptions;
            const paths = compilerOptions.paths;
            expect(paths).toHaveProperty('@/*');
            expect(paths['@/*']).toContain('./src/*');
        });
    });
    describe('Output directory configuration', () => {
        it('should set outDir to dist', () => {
            const compilerOptions = tsconfig.compilerOptions;
            expect(compilerOptions.outDir).toBe('./dist');
        });
        it('should set rootDir to src', () => {
            const compilerOptions = tsconfig.compilerOptions;
            expect(compilerOptions.rootDir).toBe('./src');
        });
    });
    describe('Source maps', () => {
        it('should enable source maps', () => {
            const compilerOptions = tsconfig.compilerOptions;
            expect(compilerOptions.sourceMap).toBe(true);
        });
    });
});
//# sourceMappingURL=tsconfig.test.js.map