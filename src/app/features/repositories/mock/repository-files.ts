import { RepositoryFile } from '../models/RepositoryFile';

// Seed a few realistic repository files
const seed: RepositoryFile[] = [
  {
    id: 'file-001',
    fileType: 'tree',
    currentCommitId: '48e5d56d4bf584a4126b445cf5f77c3102da5f52',
    path: '/',
    isFolder: true,
    url: 'https://dev.azure.com/org/project/_apis/git/repositories/repo-001/items?path=%2F&versionType=Branch&versionOptions=None',
  },
  {
    id: 'file-002',
    fileType: 'blob',
    currentCommitId: 'a1b2c3d4e5f6g7h8i9j0',
    path: '/README.md',
    isFolder: false,
    url: 'https://dev.azure.com/org/project/_apis/git/repositories/repo-001/items?path=%2FREADME.md&versionType=Branch&versionOptions=None',
  },
  {
    id: 'file-003',
    fileType: 'blob',
    currentCommitId: 'b2c3d4e5f6g7h8i9j0a1',
    path: '/src/index.ts',
    isFolder: false,
    url: 'https://dev.azure.com/org/project/_apis/git/repositories/repo-001/items?path=%2Fsrc%2Findex.ts&versionType=Branch&versionOptions=None',
  },
];


const fileNames = [
  'README.md',
  'package.json',
  'src/index.ts',
  'src/app.module.ts',
  'src/main.ts',
  'src/utils/helpers.ts',
  'src/components/Button.tsx',
  'src/components/Card.tsx',
  'public/index.html',
  'public/favicon.ico',
  'tsconfig.json',
  'jest.config.js',
  'src/styles.scss',
  'src/assets/logo.svg',
  'src/environments/environment.ts',
  'src/project.csproj',
  'src/project-other.csproj'
];

const generated: RepositoryFile[] = [];
const usedIds = new Set(seed.map(f => f.id));
const usedPaths = new Set(seed.map(f => f.path));
let genCount = 0;
const totalFiles = 20;
for (let i = seed.length + 1; genCount < totalFiles && i <= 100; i++) {
  let uniqueId;
  let attempt = 0;
  do {
    uniqueId = `file-${i}`;
    attempt++;
  } while (usedIds.has(uniqueId) && attempt < 100);
  usedIds.add(uniqueId);

  // Find an unused file path
  let filePath = fileNames.find(name => !usedPaths.has('/' + name));
  if (!filePath) {
    filePath = `src/extra-file-${i}.ts`;
  }
  usedPaths.add('/' + filePath);

  const isFolder = filePath.endsWith('/') || filePath === '/';
  const fileType = isFolder ? 'tree' : 'blob';
  const commitId = Math.random().toString(36).substring(2, 18);

  generated.push({
    id: uniqueId,
    fileType,
    currentCommitId: commitId,
    path: '/' + filePath,
    isFolder,
    url: `https://dev.azure.com/org/project/_apis/git/repositories/repo-001/items?path=%2F${encodeURIComponent(filePath)}&versionType=Branch&versionOptions=None`,
  });
  genCount++;
}

export const mockRepositoryFiles: RepositoryFile[] = [...seed, ...generated];
