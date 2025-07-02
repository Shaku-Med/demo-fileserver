const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function convertToHLS(buffer, tempDir) {
    const timestamp = Date.now();
    const outputDir = path.join(tempDir, `hls_${timestamp}`);
    await mkdirAsync(outputDir, { recursive: true });

    const inputPath = path.join(tempDir, `input_${timestamp}`);
    await writeFileAsync(inputPath, buffer);

    try {
        const outputFileName = 'stream.m3u8';
        const segmentFileName = 'segment_%03d.ts';
        
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .outputOptions([
                    '-c:v libx264',
                    '-preset fast',
                    '-crf 23',
                    '-c:a aac',
                    '-b:a 128k',
                    '-f hls',
                    '-hls_time 10',
                    '-hls_list_size 0',
                    '-hls_flags independent_segments',
                    '-hls_segment_type mpegts',
                    `-hls_segment_filename ${path.join(outputDir, segmentFileName)}`,
                    '-profile:v baseline',
                    '-level 3.1',
                    '-pix_fmt yuv420p',
                    '-movflags +faststart',
                    '-avoid_negative_ts make_zero',
                    '-fflags +genpts'
                ])
                .output(path.join(outputDir, outputFileName))
                .on('end', () => resolve())
                .on('error', (err) => reject(err))
                .run();
        });

        fs.unlinkSync(inputPath);
        
        return outputDir;
    } catch (error) {
        // Clean up input file even if conversion fails
        if (fs.existsSync(inputPath)) {
            fs.unlinkSync(inputPath);
        }
        throw error;
    }
}

module.exports = {
    convertToHLS
};
