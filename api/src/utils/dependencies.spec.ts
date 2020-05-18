import { getPrefixedDependencies } from './dependencies';

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

  const outdatedDepsSameLetter = [
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

    // it('should return object with common prefix and dependency without prefix', () => {
    //   const result = getPrefixedDependencies(outdatedDepsSameLetter);
    //   console.log('result', JSON.stringify(result, null, '	'));
    // });
  });
});
