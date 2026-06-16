import fs from "fs";
import path from "path";
import sharp from "sharp";

const rootDir = "public/img";

// Función recursiva para recorrer todas las subcarpetas
function getAllImages(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? getAllImages(fullPath) : [fullPath];
  });
  return files;
}

const allImages = getAllImages(rootDir).filter((file) => {
  const ext = path.extname(file).toLowerCase();
  return ext === ".jpg" || ext === ".jpeg" || ext === ".png";
});

let processed = 0;

(async () => {
  for (const file of allImages) {
    const dir = path.dirname(file);
    const fileName = path.parse(file).name;
    const outputPath = path.join(dir, `${fileName}.webp`);

    try {
      await sharp(file).webp({ quality: 80 }).toFile(outputPath);

      fs.unlinkSync(file); // elimina el original
      processed++;
      console.log(`✅ ${file} → ${outputPath}`);
    } catch (err) {
      console.error(`❌ Error al optimizar ${file}:`, err);
    }
  }

  console.log(
    `🎉 Optimización completada. ${processed} imágenes convertidas a WebP.`,
  );
})();
