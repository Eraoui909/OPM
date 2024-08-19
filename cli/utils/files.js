const fs = require('fs');
const path = require('path');

/**
 * Creates a file with the given content in the specified directory.
 *
 * @param {string} dir - The directory where the file should be created.
 * @param {string} fileName - The name of the file to be created.
 * @param {string} content - The content to be written to the file.
 * @returns {Promise<void>} - A promise that resolves when the file is created.
 */
function createFileInDir(dir, fileName, content) {
  return new Promise((resolve, reject) => {
    // Ensure the directory exists
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        return reject(err);
      }

      const filePath = path.join(dir, fileName);

      // Write the content to the file
      fs.writeFile(filePath, content, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  });
}

/**
 * Checks if a file exists in the specified directory.
 *
 * @param {string} dir - The directory where the file should be checked.
 * @param {string} fileName - The name of the file to be checked.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the file exists, `false` otherwise.
 */
function fileExistsInDir(dir, fileName) {
    return new Promise((resolve) => {
      const filePath = path.join(dir, fileName);
  
      fs.access(filePath, fs.constants.F_OK, (err) => {
        resolve(!err);
      });
    });
  }

module.exports = {
    createFileInDir,
    fileExistsInDir
}