import * as path from 'path';

const DEFAULT_EXCLUDED_DIRECTORIES = ['.git', 'node_modules'];

/**
 * Handle scan source code
 */
export class ScanFile {
    private static instance: ScanFile;

    private scannedFiles: string[] = [];

    private constructor() {}

    public static getInstance() {
        if (!ScanFile.instance) {
            ScanFile.instance = new ScanFile();
        }
        return ScanFile.instance;
    }

    public async scan(folder: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            const finder = require('findit2')(path.resolve(folder));

            finder.on('directory', function(dir, stat, stop) {
                let base = path.basename(dir);
                if (DEFAULT_EXCLUDED_DIRECTORIES.includes(base)) {
                    stop();
                }
            });

            finder.on('error', error => {
                reject(error);
            });

            finder.on('file', (file, stat) => {
                if (path.extname(file) === '.ts') {
                    this.scannedFiles.push(file);
                }
            });

            finder.on('end', () => {
                resolve(this.scannedFiles);
            });
        });
    }
}

export default ScanFile.getInstance();
