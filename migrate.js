import { spawn } from 'child_process';

// Run drizzle-kit push with automatic confirmation
const child = spawn('npx', ['drizzle-kit', 'push'], {
  stdio: ['pipe', 'inherit', 'inherit']
});

// Send newline (Enter key) to accept the default option (create column)
child.stdin.write('\n');
child.stdin.end();

child.on('close', (code) => {
  console.log(`Migration completed with exit code ${code}`);
  process.exit(code);
});