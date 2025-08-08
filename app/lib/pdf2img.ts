export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;

async function loadPdfJs() {
  if (pdfjsLib) return pdfjsLib;

  const lib = await import("pdfjs-dist/build/pdf.mjs");
  const { default: pdfjsWorkerURL } = await import(
    "pdfjs-dist/build/pdf.worker.mjs?url"
  );

  if (typeof window !== "undefined" && "Worker" in window) {
    lib.GlobalWorkerOptions.workerPort = new Worker(pdfjsWorkerURL, {
      type: "module",
    });
  }

  pdfjsLib = lib;
  return lib;
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  if (typeof window === "undefined") {
    return {
      imageUrl: "",
      file: null,
      error: "PDF conversion is only available in the browser",
    };
  }

  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 4 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
    }

    await page.render({
      canvasContext: context!,
      viewport,
      canvas,
    }).promise;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            });
          }
        },
        "image/png",
        1.0
      );
    });
  } catch (err) {
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err}`,
    };
  }
}
