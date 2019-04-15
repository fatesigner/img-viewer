/**
 * build
 * copy src files to output path
 */

const Gulp = require('gulp');
const Path = require('path');
const Merge = require('merge2');
const Ts = require('gulp-typescript');

Gulp.task('build', async function () {
  const ENV = require('../env')();

  // build esm
  const TsProject = Ts.createProject(Path.join(ENV.rootPath, 'tsconfig.json'), {
    declaration: true,
    declarationFiles: true
  });
  const tsResult = await Gulp.src(
    [
      Path.join(ENV.srcPath, '**/*.ts'),
      '!' + Path.join(ENV.srcPath, 'interfaces.ts'),
      '!' + Path.join(ENV.srcPath, '**/*.d.ts'),
      '!' + Path.join(ENV.srcPath, '**/*.spec.ts')
    ],
    {
      allowEmpty: true
    }
  ).pipe(TsProject());
  Merge([tsResult.dts.pipe(Gulp.dest(ENV.outputPath)), tsResult.js.pipe(Gulp.dest(ENV.outputPath))]);

  // copy other files to output
  await Gulp.src([Path.join(ENV.srcPath, '**/*'), '!' + Path.join(ENV.srcPath, '**/*.ts')], {
    base: ENV.srcPath
  }).pipe(Gulp.dest(ENV.outputPath));

  // copy interfaces.ts
  await Gulp.src(
    [
      Path.join(ENV.srcPath, 'typings/**/*'),
      Path.join(ENV.srcPath, '**/*.d.ts'),
      Path.join(ENV.srcPath, 'interfaces.ts')
    ],
    {
      allowEmpty: true,
      base: ENV.srcPath
    }
  ).pipe(Gulp.dest(ENV.outputPath));

  // copy npm publish files to output
  await Gulp.src(['package.json', 'README.md'].map((x) => Path.join(ENV.rootPath, x))).pipe(Gulp.dest(ENV.outputPath));
});
