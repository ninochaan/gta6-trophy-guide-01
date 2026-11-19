// Sunset Platinum — the entry program for gta6-trophy-guide-01 (Node 22, standard
// library only). The guide itself is plain static files under app/: index.html
// opens in a desktop browser and works with the network off, its 55 trophies and
// their guides live in app/data/trophies.json, and the screenshots in
// screenshots/ are real renders of the app's own code. This program hands the
// guide in: it copies app/ and screenshots/ from beside this file into the
// output directory and writes dossier.json there with the vendored make.fun
// library, which is the summary the judge reads (the screenshots, the first
// load's files and bytes, and the source). Leave vendor/makefun-frontend.ts
// exactly as the kit shipped it: the scorer rebuilds the dossier with its own
// copy and the two must match byte for byte.
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Run it twice: both runs must write the same bytes. Serve the guide locally
// with `node serve.ts` and open http://localhost:8080 to try it.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
