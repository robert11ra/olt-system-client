export default async function selectImages(multiple) {
  const input = document.createElement("input");
  input.type = "file";
  // Permitir imágenes, PDF, Word y Excel
  input.accept = "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  input.multiple = multiple;
  return new Promise((resolve) => {
    input.onchange = () => {
      // Filtrar archivos por tipo MIME permitido
      const allowedTypes = [
        'image/',
        'application/pdf',
        // 'application/msword',
        // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        // 'application/vnd.ms-excel',
        // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      const files = Array.from(input.files).filter(file =>
        allowedTypes.some(type => file.type.startsWith(type))
      );
      resolve(files);
    };
    input.click();
  });
}

export async function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

}