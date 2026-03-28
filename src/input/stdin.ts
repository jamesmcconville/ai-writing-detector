export async function readStdinInput(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';

    process.stdin.setEncoding('utf-8');
    process.stdin.resume();

    process.stdin.on('data', (chunk: string) => {
      data += chunk;
    });

    process.stdin.on('end', () => {
      resolve(data);
    });
  });
}
