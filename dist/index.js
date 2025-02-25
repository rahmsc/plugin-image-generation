// src/index.ts
import { elizaLogger, generateText } from "@elizaos/core";
import {
  ModelClass
} from "@elizaos/core";
import { generateImage } from "@elizaos/core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var IMAGE_SYSTEM_PROMPT = `You are an expert in writing prompts for AI art generation. Keep your prompts concise (25 words or less) and focused on visual elements. Do not include any narrative or dialogue. Example: "A regal cat wearing a top hat, sipping milk from a crystal glass, elegant lighting, detailed fur texture."`;
function saveBase64Image(base64Data, filename) {
  const imageDir = path.join(__dirname, "images", "lora");
  elizaLogger.log("Saving base64 image to directory:", imageDir);
  if (!fs.existsSync(imageDir)) {
    elizaLogger.log("Creating directory as it doesn't exist");
    fs.mkdirSync(imageDir, { recursive: true });
  }
  const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Image, "base64");
  const filepath = path.join(imageDir, `${filename}.png`);
  fs.writeFileSync(filepath, imageBuffer);
  return filepath;
}
async function saveHeuristImage(imageUrl, filename) {
  const imageDir = path.join(__dirname, "images", "lora");
  elizaLogger.log("Saving Heurist image to directory:", imageDir);
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);
  const filepath = path.join(imageDir, `${filename}.png`);
  fs.writeFileSync(filepath, imageBuffer);
  return filepath;
}
elizaLogger.log("Loading milk image generation plugin");
var milkImageGeneration = {
  name: "MILK_IMAGE_GENERATION",
  similes: [
    "IMAGE_GENERATION",
    "IMAGE_GEN",
    "CREATE_IMAGE",
    "MAKE_PICTURE",
    "GENERATE_IMAGE",
    "GENERATE_A",
    "DRAW",
    "DRAW_A",
    "MAKE_A"
  ],
  description: "Generate an image to go along with the message.",
  suppressInitialMessage: true,
  validate: async (runtime, message) => {
    const openAiApiKey = runtime.getSetting("OPENAI_API_KEY");
    console.log("\u{1F511} Testing OpenAI API Key:", !!openAiApiKey);
    return !!openAiApiKey;
  },
  handler: async (runtime, message, state, options, callback) => {
    console.log("\u{1F680} HANDLER: Starting image generation");
    callback({
      text: "Starting to generate your image..."
    });
    const imagePrompt = await generateText({
      runtime,
      context: message.content.text,
      modelClass: ModelClass.MEDIUM,
      customSystemPrompt: IMAGE_SYSTEM_PROMPT
    });
    console.log("\u{1F3A8} Generated prompt:", imagePrompt);
    callback({
      text: `Creating image with prompt: ${imagePrompt}`
    });
    const images = await generateImage(
      {
        prompt: imagePrompt,
        modelId: "dall-e-3",
        width: 1024,
        height: 1024
      },
      runtime
    );
    console.log("\u{1F5BC}\uFE0F Image generation result:", images);
    if (images.success && images.data && images.data.length > 0) {
      callback({
        text: "Here's your generated image",
        attachments: [
          {
            id: crypto.randomUUID(),
            url: images.data[0],
            title: "Generated image",
            source: "imageGeneration",
            description: imagePrompt,
            text: imagePrompt,
            contentType: "image/png"
          }
        ]
      });
      return true;
    }
    callback({
      text: "Sorry, image generation failed"
    });
    return false;
  },
  examples: [
    // TODO: We want to generate images in more abstract ways, not just when asked to generate an image
    [
      {
        user: "{{user1}}",
        content: { text: "Generate an image of a cat" }
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Here's an image of a cat",
          action: "GENERATE_IMAGE"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: { text: "Generate an image of a dog" }
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Here's an image of a dog",
          action: "GENERATE_IMAGE"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: { text: "Create an image of a cat with a hat" }
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Here's an image of a cat with a hat",
          action: "GENERATE_IMAGE"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: { text: "Make an image of a dog with a hat" }
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Here's an image of a dog with a hat",
          action: "GENERATE_IMAGE"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: { text: "Paint an image of a cat with a hat" }
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Here's an image of a cat with a hat",
          action: "GENERATE_IMAGE"
        }
      }
    ]
  ]
};
var milkImageGenerationPlugin = {
  name: "milkImageGeneration",
  description: "Generate images",
  actions: [milkImageGeneration],
  evaluators: [],
  providers: []
};
elizaLogger.log("Exporting milk image generation plugin");
var index_default = milkImageGenerationPlugin;
export {
  index_default as default,
  milkImageGenerationPlugin,
  saveBase64Image,
  saveHeuristImage
};
//# sourceMappingURL=index.js.map