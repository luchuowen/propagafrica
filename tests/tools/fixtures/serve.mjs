#!/usr/bin/env node
// Tiny static-file + on-the-fly TS transpile server, used only to exercise
// the tools' vanilla-TS islands with a real browser (Playwright) — the
// components themselves are mounted by session 8's real Astro pages, which
// this session does not own and must not create. Node core modules plus the
// project's existing `typescript` devDependency only: no new dependency, no
// bundler, nothing checked in as build output.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = __dirname;
const LIB_DIR = path.resolve(__dirname, '../../../src/lib/tools');
const PORT = Number(process.env.PORT ?? 4322);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

function transpileLib(name) {
  const tsPath = path.join(LIB_DIR, `${name}.ts`);
  if (!fs.existsSync(tsPath)) return null;
  const source = fs.readFileSync(tsPath, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2020,
    },
  });
  // Bare relative specifiers ('./sleeve') resolve to the sibling compiled
  // module the browser will request next ('./sleeve.js').
  return outputText.replace(/from '(\.\/[\w-]+)'/g, "from '$1.js'");
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname.startsWith('/lib/') && pathname.endsWith('.js')) {
    const name = pathname.slice('/lib/'.length, -'.js'.length);
    const js = transpileLib(name);
    if (js === null) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': MIME['.js'] }).end(js);
    return;
  }

  const relativePath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(FIXTURES_DIR, relativePath);
  if (
    !filePath.startsWith(FIXTURES_DIR) ||
    !fs.existsSync(filePath) ||
    fs.statSync(filePath).isDirectory()
  ) {
    res.writeHead(404).end('not found');
    return;
  }
  const ext = path.extname(filePath);
  res
    .writeHead(200, { 'content-type': MIME[ext] ?? 'application/octet-stream' })
    .end(fs.readFileSync(filePath));
});

server.listen(PORT, () => {
  console.log(`tools fixture server listening on http://localhost:${PORT}`);
});
