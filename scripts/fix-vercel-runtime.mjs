import fs from 'node:fs';
import path from 'node:path';

const configPath = path.resolve('.vercel/output/functions/_render.func/.vc-config.json');
if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (config.runtime === 'nodejs18.x') {
    config.runtime = 'nodejs20.x';
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('[fix-vercel-runtime] Successfully corrected runtime from nodejs18.x to nodejs20.x');
  }
}
