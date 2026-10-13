const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Run from any directory. Pass a repository path as the first argument, or use
// the directory containing this script by default:
//   node audit-script.js [repo-root]
const repoRoot = path.resolve(process.argv[2] || __dirname);

const files = [
  'js/main.js',
  'js/peep.js',
  'js/sprite-loader.js',
  'js/cursor-entity.js',
  'js/config.js',
  'js/ai-controller.js'
];

const results = {
  syntaxErrors: [],
  undefinedVars: [],
  potentialBugs: [],
  styleIssues: []
};

function analyzeFile(filePath) {
  const absolutePath = path.join(repoRoot, filePath);
  if (!fs.existsSync(absolutePath)) {
    results.potentialBugs.push(`${filePath}: file not found (${absolutePath})`);
    return;
  }

  const content = fs.readFileSync(absolutePath, 'utf-8');
  const syntaxCheck = spawnSync(process.execPath, ['--check', absolutePath], { encoding: 'utf-8' });
  if (syntaxCheck.status !== 0) {
    results.syntaxErrors.push(`${filePath}: ${syntaxCheck.stderr.trim()}`);
  }
  const lines = content.split('\n');

  // Check for common issues
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // Check for potential undefined variable usage (very basic heuristic)
    const globalVars = ['Peep', 'CursorEntity', 'AIController', 'SpriteAtlas', 'SpriteLayers', 'GAME_CONSTANTS', 'STAT_REGISTRY', 'WEAPON_REGISTRY', 'TRAIT_LIBRARY', 'CHARACTER_LIBRARY'];
    
    // Look for console.log left in code
    if (line.includes('console.log') || line.includes('console.warn') || line.includes('console.error')) {
      if (!line.includes('catch') && !line.includes('error')) {
        results.styleIssues.push(`${filePath}:${lineNum}: console statement left in code`);
      }
    }

    // Look for potential == instead of ===
    if (/[^=!]==[^=]/.test(line)) {
      results.potentialBugs.push(`${filePath}:${lineNum}: using == instead of ===`);
    }

    // Look for potential unused variables or missing declarations
    if (/\b(let|const)\s+\w+\s*;/.test(line)) {
      results.potentialBugs.push(`${filePath}:${lineNum}: variable declared without initialization`);
    }
  });
}

files.forEach(analyzeFile);
console.log(JSON.stringify(results, null, 2));
