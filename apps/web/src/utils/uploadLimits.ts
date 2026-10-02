import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

// A API roda como função serverless na Vercel, que limita o corpo da requisição a 4,5 MB.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const UPLOAD_TOO_LARGE_MESSAGE = "Arquivo muito grande. Envie um arquivo de até 4 MB.";

const MAX_IMAGE_SIDE = 1600;

type PickedImage = { uri: string; width: number; height: number };

// Reduz a foto (lado maior em até 1600px, JPEG 70%) antes do upload.
// Fica bem abaixo do limite e continua legível para a análise por IA.
export async function compressImage(image: PickedImage): Promise<{ uri: string; mimeType: string }> {
  const context = ImageManipulator.manipulate(image.uri);
  if (Math.max(image.width, image.height) > MAX_IMAGE_SIDE) {
    context.resize(image.width >= image.height ? { width: MAX_IMAGE_SIDE } : { height: MAX_IMAGE_SIDE });
  }
  const rendered = await context.renderAsync();
  const saved = await rendered.saveAsync({ compress: 0.7, format: SaveFormat.JPEG });
  return { uri: saved.uri, mimeType: "image/jpeg" };
}
