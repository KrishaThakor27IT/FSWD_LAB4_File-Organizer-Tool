import fs from 'fs/promises';
import path from 'path';

const fileCategories = {
    images: ['.jpg', '.jpeg', '.png', '.gif'],
    documents: ['.pdf', '.docx', '.txt', '.xlsx'],
    videos: ['.mp4', '.mkv', '.avi'],
    code: ['.js', '.ts', '.java', '.cpp', '.py'],
};

async function organizeFiles(dirPath) {
    try {
        const files = await fs.readdir(dirPath);
        const summary = [];
        const summaryFileName = 'summary.txt';
        const summaryPath = path.join(dirPath, summaryFileName);
        const excludeFiles = ['server.js', summaryFileName];

        for (const file of files) {
            const filePath = path.join(dirPath, file);

            if (excludeFiles.includes(file)) continue;

            const stat = await fs.stat(filePath);

            if (stat.isFile()) {
                const ext = path.extname(file).toLowerCase();
                let folder = 'Others';

                for (const [category, extensions] of Object.entries(fileCategories)) {
                    if (extensions.includes(ext)) {
                        folder = category.charAt(0).toUpperCase() + category.slice(1);
                        break;
                    }
                }

                const targetFolder = path.join(dirPath, folder);
                await fs.mkdir(targetFolder, { recursive: true });

                const targetPath = path.join(targetFolder, file);
                await fs.rename(filePath, targetPath);
                summary.push(`${file} → ${folder}`);
            }
        }

        await fs.writeFile(summaryPath, summary.join('\n'));
        console.log('File organization complete. Summary saved to summary.txt');

    } catch (err) {
        console.error('Error organizing files:', err);
    }
}

const inputDir = "C:\\Users\\krish\\OneDrive\\Documents\\4th Semester\\FSWD\\lab4\\1-FileOrganizerTool";

organizeFiles(path.resolve(inputDir));
