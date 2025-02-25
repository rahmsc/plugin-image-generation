import { Plugin } from '@elizaos/core';

declare function saveBase64Image(base64Data: string, filename: string): string;
declare function saveHeuristImage(imageUrl: string, filename: string): Promise<string>;
declare const milkImageGenerationPlugin: Plugin;

export { milkImageGenerationPlugin as default, milkImageGenerationPlugin, saveBase64Image, saveHeuristImage };
