export default function downloadFiles(files) {
  let parsedFiles = files;

  if (!Array.isArray(files)) parsedFiles = [files];

  parsedFiles.forEach((file) => {
    const link = document.createElement("a");
    link.href = file.base64;
    link.download = file.title;
    link.click();
    link.remove();
  });
}
