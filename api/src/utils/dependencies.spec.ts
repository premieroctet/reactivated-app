import { getPrefixedDependencies, getUpgradedDiff } from './dependencies';

describe('Utils dependencies', () => {
  const outdatedDepsNoPrefix = [
    [
      'formik',
      '2.0.3',
      '2.1.4',
      '2.1.4',
      'dependencies',
      'https://github.com/jaredpalmer/formik#readme',
    ],
    [
      'gatsby',
      '2.21.0',
      '2.21.33',
      '2.21.33',
      'dependencies',
      'https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby#readme',
    ],
  ];

  const outdatedDepsWithSamePrefix = [
    [
      '@nestjs/cli',
      '6.12.2',
      '6.14.2',
      '7.1.5',
      'devDependencies',
      'https://github.com/nestjs/nest-cli#readme',
    ],
    [
      '@nestjs/common',
      '6.10.5',
      '6.11.11',
      '7.0.13',
      'dependencies',
      'https://nestjs.com',
    ],
    [
      '@nestjs/core',
      '6.10.5',
      '6.11.11',
      '7.0.13',
      'dependencies',
      'https://nestjs.com',
    ],
  ];

  const outdatedDepsMixedPrefix = [
    [
      '@nestjs/cli',
      '6.12.2',
      '6.14.2',
      '7.1.5',
      'devDependencies',
      'https://github.com/nestjs/nest-cli#readme',
    ],
    [
      '@nestjs/common',
      '6.10.5',
      '6.11.11',
      '7.0.13',
      'dependencies',
      'https://nestjs.com',
    ],
    [
      '@types/bull',
      '3.10.6',
      '3.13.0',
      '3.13.0',
      'dependencies',
      'https://github.com/DefinitelyTyped/DefinitelyTyped.git',
    ],
    [
      '@types/express',
      '4.17.2',
      '4.17.6',
      '4.17.6',
      'devDependencies',
      'https://github.com/DefinitelyTyped/DefinitelyTyped.git',
    ],
  ];

  const diff1 = [
    'diff --git a/package.json b/package.json',
    'index 5bc80e6..5a6f483 100644',
    '--- a/package.json',
    '+++ b/package.json',
    '@@ -9,7 +9,7 @@',
    '   },',
    '   "dependencies": {',
    '     "core-js": "^3.6.4",',
    '-    "date-fns": "^2.0.0",',
    '+    "date-fns": "^2.14.0",',
    '     "vue": "^2.6.11"',
    '   },',
    '   "devDependencies": {',
    '',
  ];
  const diff2 = [
    'diff --git a/package.json b/package.json',
    'index 5bc80e6..5f64d63 100644',
    '--- a/package.json',
    '+++ b/package.json',
    '@@ -14,10 +14,10 @@',
    '   },',
    '   "devDependencies": {',
    '     "@vue/cli-plugin-babel": "^4.3.0",',
    '-    "@vue/cli-plugin-eslint": "^4.3.0",',
    '-    "@vue/cli-service": "^4.3.0",',
    '+    "@vue/cli-plugin-eslint": "^4.4.1",',
    '+    "@vue/cli-service": "^4.4.1",',
    '     "babel-eslint": "^10.1.0",',
    '-    "eslint": "^6.7.2",',
    '+    "eslint": "^7.1.0",',
    '     "eslint-plugin-vue": "^6.2.2",',
    '     "vue-template-compiler": "^2.6.11"',
    '   },',
    '',
  ];

  describe('getPrefixedDependencies', () => {
    it('should return array of outdated deps with no common prefix ', () => {
      const result = getPrefixedDependencies(outdatedDepsNoPrefix);
      expect(result).toEqual(outdatedDepsNoPrefix);
    });
    it('should return an object with common prefix ', () => {
      const commonPrefix = outdatedDepsWithSamePrefix[0][0].split('/')[0] + '/';
      const result = getPrefixedDependencies(outdatedDepsWithSamePrefix);

      expect(commonPrefix).toEqual('@nestjs/');

      expect(result[0]).toBeInstanceOf(Object);
      expect(result[0][commonPrefix]).toBeDefined();
      expect(result[0][commonPrefix].length).toEqual(
        outdatedDepsWithSamePrefix.length,
      );
    });
    it('should return an array of 2 objects with common prefix ', () => {
      const result = getPrefixedDependencies(outdatedDepsMixedPrefix);

      expect(result.length).toEqual(2);
      expect(result[0]).toBeInstanceOf(Object);
      expect(result[1]).toBeInstanceOf(Object);
      const entries0: [string, string[]][] = Object.entries(result[0]);
      const entries1: [string, string[]][] = Object.entries(result[1]);

      for (const entry of Object.entries(entries0)) {
        const [prefix, dependencies] = entry[1];
        dependencies.forEach(dependency => {
          expect(dependency[0].split('/')[0] + '/').toEqual(prefix);
        });
      }

      for (const entry of Object.entries(entries1)) {
        const [prefix, dependencies] = entry[1];
        dependencies.forEach(dependency => {
          expect(dependency[0].split('/')[0] + '/').toEqual(prefix);
        });
      }
    });
  });

  describe('Get upgraded diff', () => {
    it('ugprade 1 dependency', () => {
      const upgradedDiff = getUpgradedDiff(diff1);
      const deps = Object.keys(upgradedDiff);
      expect(deps.length).toEqual(1);
      expect(upgradedDiff[deps[0]]).toBeInstanceOf(Array);
      expect(upgradedDiff[deps[0]].length).toEqual(2);
    });
    it('ugprade multiples dependencies', () => {
      const upgradedDiff = getUpgradedDiff(diff2);
      const deps = Object.keys(upgradedDiff);
      expect(deps.length).toEqual(3);
      for (const dep of deps) {
        expect(upgradedDiff[dep]).toBeInstanceOf(Array);
        expect(upgradedDiff[dep].length).toEqual(2);
      }
    });
  });
});
