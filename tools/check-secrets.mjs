// Busca credenciales (tokens, claves, contraseñas) antes de que lleguen al repositorio.
//
// Uso:
//   node tools/check-secrets.mjs --staged   revisa lo preparado para commit (lo usa el hook)
//   node tools/check-secrets.mjs --all      revisa todos los archivos del repositorio
//
// Si encuentra algo, termina con código 1: el hook de pre-commit cancela el commit.
// Un repositorio público es PÚBLICO PARA SIEMPRE: aunque borres un secreto en
// un commit posterior, sigue en el historial. Lo único seguro es no subirlo nunca.

import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, {
  encoding: 'utf8',
  maxBuffer: 50 * 1024 * 1024,
  stdio: ['ignore', 'pipe', 'ignore'], // sin mensajes de error de git en pantalla
});

// Formatos conocidos de credenciales
const PATTERNS = [
  ['Token de GitHub', /\bgh[pousr]_[A-Za-z0-9]{36,}\b/],
  ['Token de GitHub (fine-grained)', /\bgithub_pat_[A-Za-z0-9_]{22,}\b/],
  ['Clave de AWS', /\bAKIA[0-9A-Z]{16}\b/],
  ['Clave de API de Google', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['Token de Slack', /\bxox[baprs]-[A-Za-z0-9-]{10,}/],
  ['Clave de OpenAI/Anthropic', /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{20,}/],
  ['Clave de Stripe', /\b[sr]k_live_[0-9A-Za-z]{20,}/],
  ['Clave privada', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  // Asignaciones genéricas: password = "...", api_key: '...', token = "..."
  ['Posible contraseña o token', /\b(?:api[_-]?key|secret|token|passw(?:or)?d|pwd)\b\s*[:=]\s*['"][^'"\s]{8,}['"]/i],
];

// Archivos que nunca deberían subirse, contengan lo que contengan
const FORBIDDEN_FILES = [
  /(^|\/)\.env(\..*)?$/, /\.pem$/, /\.key$/, /\.p12$/, /\.pfx$/, /\.keystore$/,
  /(^|\/)id_(rsa|ed25519|ecdsa)/, /(^|\/)(credentials|secrets?)[^/]*\.json$/,
];

const BINARY = /\.(png|jpe?g|gif|webp|ico|woff2?|ttf|otf|pdf|zip)$/i;

const mode = process.argv[2] ?? '--staged';
const files = mode === '--all'
  ? git('ls-files').split('\n').filter(Boolean)
  : git('diff', '--cached', '--name-only', '--diff-filter=ACMR').split('\n').filter(Boolean);

// Leemos la versión del índice de git (":ruta"), no la del disco:
// es exactamente lo que se guarda (o se va a guardar) en el commit.
const read = file => git('show', `:${file}`);

const findings = [];
for (const file of files) {
  if (FORBIDDEN_FILES.some(re => re.test(file))) {
    findings.push(`${file}: archivo de credenciales, no debe subirse`);
    continue;
  }
  if (BINARY.test(file)) continue;

  let content;
  try { content = read(file); } catch { continue; } // p. ej. archivo nuevo sin commit en --all
  content.split('\n').forEach((line, i) => {
    if (line.includes('secret-scan: ignore')) return; // excepción explícita para falsos positivos
    for (const [name, re] of PATTERNS) {
      if (re.test(line)) findings.push(`${file}:${i + 1}: ${name}`);
    }
  });
}

if (findings.length) {
  console.error('\n🚫 Posibles credenciales detectadas. Commit cancelado:\n');
  findings.forEach(f => console.error('  - ' + f));
  console.error('\nQuítalas del archivo (usa variables de entorno o un archivo ignorado por git).');
  console.error('Si es un falso positivo, añade el comentario "secret-scan: ignore" en esa línea.\n');
  process.exitCode = 1;
} else {
  console.log(`🔒 Sin credenciales en ${files.length} archivo(s) revisado(s).`);
}
