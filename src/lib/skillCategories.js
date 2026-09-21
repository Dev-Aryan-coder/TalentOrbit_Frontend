/**
 * Unified Skill Categorization and Tagging Architecture
 * 
 * Provides robust preservation of skill categories (Languages, Libraries, Frameworks, Tools)
 * across MySQL database records and frontend views without relying on localStorage.
 */

export const CATEGORY_TAGS = {
  languages: '[LANGUAGE]',
  libraries: '[LIBRARY]',
  frameworks: '[FRAMEWORK]',
  tools: '[TOOL]',
};

export const TAG_TO_CATEGORY = {
  '[LANGUAGE]': 'languages',
  '[LIBRARY]': 'libraries',
  '[FRAMEWORK]': 'frameworks',
  '[TOOL]': 'tools',
};

// Comprehensive reference dictionaries for untagged / legacy database entries
export const KNOWN_LANGUAGES = new Set([
  'python', 'java', 'javascript', 'typescript', 'c++', 'c', 'c#', 'go', 'golang',
  'rust', 'sql', 'kotlin', 'swift', 'php', 'dart', 'html', 'css', 'html/css', 'html5', 'css3',
  'ruby', 'scala', 'r', 'perl', 'lua', 'haskell', 'julia', 'elixir', 'clojure',
  'bash', 'shell', 'powershell', 'solidity', 'matlab', 'assembly', 'vba', 'objective-c',
  'groovy', 'erlang', 'f#', 'fortran', 'cobol', 'lisp', 'prolog', 'pl/sql', 't-sql'
]);

export const KNOWN_LIBRARIES = new Set([
  'react', 'recharts', 'redux', 'zustand', 'mobx', 'axios', 'tailwind', 'tailwind css',
  'tailwindcss', 'bootstrap', 'material ui', 'material-ui', 'mui', 'shadcn', 'shadcn ui',
  'chakra ui', 'chakra-ui', 'antd', 'ant design', 'pandas', 'numpy', 'scipy', 'scikit-learn',
  'sklearn', 'pytorch', 'tensorflow', 'keras', 'opencv', 'lucide', 'lucide icons',
  'lucide-react', 'hibernate', 'jpa', 'graphql client', 'apollo client', 'urql', 'lodash',
  'rxjs', 'jest', 'vitest', 'testing library', 'mocha', 'chai', 'cypress', 'playwright',
  'zod', 'yup', 'joi', 'prisma', 'mongoose', 'typeorm', 'sequelize', 'knex', 'three.js',
  'threejs', 'd3', 'd3.js', 'chart.js', 'framer motion', 'gsap', 'anime.js', 'styled-components',
  'emotion', 'sass', 'less', 'jquery', 'date-fns', 'moment', 'dayjs', 'uuid', 'bcrypt',
  'jsonwebtoken', 'jwt', 'cors', 'dotenv', 'multer', 'socket.io-client', 'winston', 'pino'
]);

export const KNOWN_FRAMEWORKS = new Set([
  'spring boot', 'spring', 'django', 'express', 'express.js', 'expressjs', 'next.js',
  'nextjs', 'next', 'fastapi', 'angular', 'angularjs', 'vue', 'vue.js', 'vuejs', 'nestjs',
  'nest.js', 'nest', 'flask', 'asp.net', 'asp.net core', '.net', '.net core', 'dotnet',
  'flutter', 'react native', 'react-native', 'svelte', 'sveltekit', 'laravel', 'ruby on rails',
  'rails', 'remix', 'gatsby', 'astro', 'nuxt', 'nuxt.js', 'nuxtjs', 'fastify', 'koa', 'hapi',
  'symfony', 'codeigniter', 'cakephp', 'yii', 'quarkus', 'micronaut', 'play framework',
  'tornado', 'pyramid', 'bottle', 'phoenix', 'electron', 'tauri', 'ionic', 'expo'
]);

export const KNOWN_TOOLS = new Set([
  'git', 'github', 'gitlab', 'bitbucket', 'docker', 'docker compose', 'docker-compose',
  'kubernetes', 'k8s', 'helm', 'postman', 'insomnia', 'swagger', 'linux', 'ubuntu', 'debian',
  'centos', 'fedora', 'arch', 'bash', 'zsh', 'terminal', 'powershell', 'cmd', 'aws',
  'aws cloud', 'amazon web services', 'azure', 'microsoft azure', 'google cloud', 'gcp',
  'google cloud platform', 'maven', 'gradle', 'jenkins', 'github actions', 'gitlab ci',
  'circleci', 'travis ci', 'argocd', 'terraform', 'ansible', 'pulumi', 'vs code', 'vscode',
  'visual studio code', 'visual studio', 'intellij', 'intellij idea', 'eclipse', 'pycharm',
  'webstorm', 'sublime text', 'sublime', 'vim', 'neovim', 'atom', 'android studio', 'xcode',
  'figma', 'sketch', 'adobe xd', 'canva', 'mysql', 'mysql workbench', 'postgresql', 'postgres',
  'pgadmin', 'mongodb', 'mongodb compass', 'redis', 'redis insight', 'sqlite', 'sqlite browser',
  'vite', 'webpack', 'babel', 'rollup', 'esbuild', 'parcel', 'turbopack', 'npm', 'yarn',
  'pnpm', 'pip', 'poetry', 'conda', 'kafka', 'apache kafka', 'rabbitmq', 'jira', 'confluence',
  'trello', 'notion', 'slack', 'wireshark', 'postman pro', 'dbeaver', 'datagrip', 'grafana',
  'prometheus', 'kibana', 'elastic search', 'elasticsearch', 'logstash', 'nginx', 'apache',
  'caddy', 'cloudflare', 'vercel', 'netlify', 'heroku', 'supabase', 'firebase', 'render'
]);

/**
 * Strips category tags like "[TOOL]" and proficiency info "(INTERMEDIATE)"
 * from skill strings for clean, beautiful UI presentation.
 */
export const stripSkillTag = (raw) => {
  if (!raw) return '';
  let str = typeof raw === 'string' ? raw : (raw.name || raw.skillName || '');
  // Remove all parenthesized suffixes e.g. "(INTERMEDIATE)", "(BEGINNER)", "(Verified - ADVANCED)"
  str = str.replace(/\s*\([^)]*\)/g, '').trim();
  // Remove category tags e.g. "[TOOL]", "[LANGUAGE]", "[FRAMEWORK]", "[LIBRARY]"
  str = str.replace(/\s*\[(LANGUAGE|LIBRARY|FRAMEWORK|TOOL)\]/gi, '').trim();
  // Second pass in case tags were compound
  str = str.replace(/\s*\([^)]*\)/g, '').trim();
  str = str.replace(/\s*\[(LANGUAGE|LIBRARY|FRAMEWORK|TOOL)\]/gi, '').trim();
  return str;
};

/**
 * Formats a clean skill name with its category tag for database persistence.
 * Example: ("Sublime Text", "tools") -> "Sublime Text [TOOL]"
 */
export const formatSkillWithTag = (cleanName, category) => {
  const clean = stripSkillTag(cleanName);
  if (!clean) return '';
  const tag = CATEGORY_TAGS[category] || '';
  return tag ? `${clean} ${tag}` : clean;
};

/**
 * Checks if a string has an explicit category tag like "[TOOL]".
 */
export const getTagFromRaw = (raw) => {
  if (typeof raw !== 'string') return null;
  const match = raw.match(/\[(LANGUAGE|LIBRARY|FRAMEWORK|TOOL)\]/i);
  if (match) {
    const key = match[0].toUpperCase();
    return TAG_TO_CATEGORY[key] || null;
  }
  return null;
};

/**
 * Parse any raw skill entry (from database or UI input) into a standardized
 * object containing its clean display name and guaranteed correct category.
 */
export const parseSkill = (raw, fallbackCategory = null) => {
  if (!raw) {
    return { cleanName: '', category: fallbackCategory || 'tools', raw: '' };
  }

  const rawStr = typeof raw === 'string' ? raw : (raw.name || raw.skillName || '');
  const cleanName = stripSkillTag(rawStr);
  const lower = cleanName.toLowerCase();

  // 1. Explicit Category Tag from string (highest priority - persisted in DB)
  const tagCat = getTagFromRaw(rawStr);
  if (tagCat) {
    return { cleanName, category: tagCat, raw: rawStr };
  }

  // 2. Explicit category provided in object
  if (typeof raw === 'object') {
    if (raw.category && ['languages', 'libraries', 'frameworks', 'tools', 'aptitude', 'soft_skills'].includes(raw.category)) {
      return { cleanName, category: raw.category, raw: rawStr };
    }
  }

  // 3. Fallback Category provided by caller context (e.g. current step)
  if (fallbackCategory && ['languages', 'libraries', 'frameworks', 'tools', 'aptitude', 'soft_skills'].includes(fallbackCategory)) {
    return { cleanName, category: fallbackCategory, raw: rawStr };
  }

  // 4. Aptitude & Soft Skills Pattern Matching
  if (
    lower.includes('aptitude') ||
    lower.includes('quantitative') ||
    lower.includes('numerical') ||
    lower.includes('syllogism') ||
    lower.includes('reasoning')
  ) {
    return { cleanName, category: 'aptitude', raw: rawStr };
  }

  if (
    lower.includes('soft skill') ||
    lower.includes('communication') ||
    lower.includes('teamwork') ||
    lower.includes('conflict') ||
    lower.includes('workplace') ||
    lower.includes('ethics') ||
    lower.includes('adaptability')
  ) {
    return { cleanName, category: 'soft_skills', raw: rawStr };
  }

  // 5. Check Comprehensive Known Dictionaries
  if (KNOWN_TOOLS.has(lower)) {
    return { cleanName, category: 'tools', raw: rawStr };
  }
  if (KNOWN_FRAMEWORKS.has(lower)) {
    return { cleanName, category: 'frameworks', raw: rawStr };
  }
  if (KNOWN_LIBRARIES.has(lower)) {
    return { cleanName, category: 'libraries', raw: rawStr };
  }
  if (KNOWN_LANGUAGES.has(lower)) {
    return { cleanName, category: 'languages', raw: rawStr };
  }

  // 6. Heuristic Keyword Matching for custom skill names
  if (
    lower.includes('tool') ||
    lower.includes('ide') ||
    lower.includes('cli') ||
    lower.includes('cloud') ||
    lower.includes('editor') ||
    lower.includes('studio') ||
    lower.includes('server') ||
    lower.includes('terminal') ||
    lower.includes('workbench') ||
    lower.includes('docker') ||
    lower.includes('git') ||
    lower.includes('postman') ||
    lower.includes('ci/cd') ||
    lower.includes('pipeline') ||
    lower.includes('db') ||
    lower.includes('database')
  ) {
    return { cleanName, category: 'tools', raw: rawStr };
  }

  if (
    lower.includes('lib') ||
    lower.includes('kit') ||
    lower.includes('ui') ||
    lower.includes('icon') ||
    lower.includes('chart') ||
    lower.includes('test') ||
    lower.includes('client') ||
    lower.includes('util')
  ) {
    return { cleanName, category: 'libraries', raw: rawStr };
  }

  if (
    lower.includes('framework') ||
    lower.includes('boot') ||
    lower.includes('mvc') ||
    lower.includes('stack') ||
    lower.includes('engine')
  ) {
    return { cleanName, category: 'frameworks', raw: rawStr };
  }

  // 7. Default to tools if it sounds like an environment/tool, else languages
  return { cleanName, category: 'tools', raw: rawStr };
};
