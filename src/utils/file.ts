const MAX_SIZE_IMAGE_MB = 1;

function resizeBase64Image(base64Image: string): Promise<string> {
  return new Promise((resolve) => {
    const maxSizeInBytes = MAX_SIZE_IMAGE_MB * 1024 * 1024;
    const img = new Image();
    img.src = base64Image;
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = img.width;
      const height = img.height;
      const aspectRatio = width / height;
      const newWidth = Math.sqrt(maxSizeInBytes * aspectRatio);
      const newHeight = Math.sqrt(maxSizeInBytes / aspectRatio);
      canvas.width = newWidth;
      canvas.height = newHeight;
      // @ts-expect-error ctx TODO
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const dataURL = canvas.toDataURL('image/jpeg', 0.8);
      resolve(dataURL);
    };
  });
}


function getBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    let baseURL: string = '';
    // Make new FileReader
    const reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      baseURL = reader.result as string;
      resolve(baseURL);
    };
  });
};

export async function parseImage(file: File) {
  const image64 = await getBase64(file);
  const image1MB = await resizeBase64Image(image64);
  return image1MB;
};


export function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `data:image/png;base64,${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}
