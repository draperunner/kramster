import { readFile, readdir, rename, writeFile } from "fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

// This script hashes all exam files in the public/data directory and updates
// the index.json file with the new filenames. The hash is added to the
// filename to ensure that browsers will fetch the updated file when it changes,
// instead of using a cached version.

async function hashFile(filePath: string): Promise<string> {
  const fileBuffer = await readFile(filePath);
  const hashSum = createHash("sha256");
  hashSum.update(fileBuffer);
  return hashSum.digest("hex").slice(0, 8);
}

async function main() {
  const dataDir = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    "public",
    "data",
  );

  const indexPath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    "src",
    "index.json",
  );
  const indexData = JSON.parse(await readFile(indexPath, "utf-8"));

  const schools = await readdir(dataDir);
  const result: Record<string, Record<string, Record<string, string>>> = {};

  for (const school of schools) {
    const schoolPath = path.join(dataDir, school);
    const courses = await readdir(schoolPath);
    result[school] = {};

    for (const course of courses) {
      const coursePath = path.join(schoolPath, course);
      const exams = await readdir(coursePath);
      result[school][course] = {};

      for (const exam of exams) {
        const examPath = path.join(coursePath, exam);
        const hash = await hashFile(examPath);
        result[school][course][exam] = hash;

        const ext = path.extname(exam);
        const baseName = path.basename(exam, ext).split(".")[0];
        const newFileName = `${baseName}.${hash}${ext}`;
        const newFilePath = path.join(coursePath, newFileName);

        // rename file to include the hash in the filename
        await rename(examPath, newFilePath);

        const schoolData = indexData.schools.find(
          (s: any) => s.abbreviation.toLowerCase() === school.toLowerCase(),
        );
        if (!schoolData) continue;
        const courseData = schoolData.courses.find(
          (c: any) => c.code.toLowerCase() === course.toLowerCase(),
        );
        if (!courseData) continue;
        const examData = courseData.exams.find((e: any) => e.name === baseName);
        if (!examData) continue;

        examData.fileName = newFileName;
      }
    }
  }

  // Save file with updated index.json
  await writeFile(
    indexPath,
    JSON.stringify(indexData, null, 2) + "\n",
    "utf-8",
  );
}

main().catch(console.error);
