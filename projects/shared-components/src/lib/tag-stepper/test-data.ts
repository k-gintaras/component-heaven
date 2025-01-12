import { TagGroup, Tag } from './tag.interface';

export const colorString =
  '#6e40aa, #753fad, #7d3faf, #863eb1, #8e3eb2, #963db3, #9e3db3, #a73cb3, #af3cb2, #b73cb1, #bf3caf, #c73dac, #cf3da9, #d63ea6, #dd3fa2, #e4419d, #ea4299, #f04494, #f5468e, #fa4988, #fe4b83, #ff4e7c, #ff5276, #ff5670, #ff5a6a, #ff5e63, #ff635d, #ff6757, #ff6d51, #ff724c, #ff7847, #ff7d42, #ff833d, #ff8a39, #ff9036, #fb9633, #f69d31, #f2a42f, #edaa2e, #e7b12e, #e2b72f, #dcbe30, #d7c432, #d1ca34, #ccd038, #c6d63c, #c1dc41, #bce146, #b7e64c, #b3eb53, #aff05b, #a6f159, #9cf357, #92f457, #88f557, #7ff658, #75f65a, #6cf65c, #63f75f, #5af663, #52f667, #4af56c, #43f471, #3cf276, #36f17c, #30ef82, #2bec89, #27e98f, #23e696, #20e29c, #1ddfa3, #1bdbaa, #1ad6b0, #19d1b6, #19cdbc, #1ac7c2, #1bc2c7, #1cbccc, #1eb7d1, #21b1d5, #23abd8, #27a5db, #2a9fde, #2e98df, #3292e1, #368ce1, #3a86e1, #3f80e1, #437ae0, #4874de, #4c6edb, #5169d9, #5563d5, #595ed1, #5d59cd, #6054c8, #6450c3, #674bbd, #6947b7, #6c43b1';

export const colorString2 =
  '#000000, #040104, #080308, #0c050d, #0f0612, #120817, #140a1c, #160d21, #180f26, #19122b, #1a1530, #1a1835, #1b1c39, #1a1f3d, #1a2341, #1a2744, #192b47, #182f4a, #17344b, #17384d, #163d4e, #15414e, #15464e, #154a4e, #154f4d, #16534c, #17574a, #185b48, #1a5f46, #1c6244, #1f6642, #22693f, #266c3c, #2a6f3a, #2f7137, #347335, #397533, #407632, #467830, #4d792f, #54792f, #5b7a2f, #637a2f, #6b7b31, #737b32, #7a7a35, #827a37, #8a7a3b, #927a3f, #997944, #a07949, #a7794f, #ad7955, #b3795c, #b97963, #be796a, #c37a72, #c77b7a, #ca7c82, #cd7d8a, #d07e93, #d2809b, #d382a3, #d485ab, #d487b3, #d48aba, #d48dc1, #d391c8, #d294ce, #d198d4, #cf9cda, #cea1df, #cca5e3, #caaae7, #c9aeea, #c7b3ed, #c5b8ef, #c4bcf1, #c3c1f2, #c2c6f3, #c1caf3, #c1cef3, #c2d3f3, #c2d7f3, #c3dbf2, #c5def2, #c7e2f1, #c9e5f0, #cce8f0, #cfebef, #d2eeef, #d6f0ef, #daf2ef, #def4ef, #e3f6f0, #e8f8f2, #ecf9f3, #f1fbf6, #f6fcf8, #fafefb';

export function getColorPreset(): string[] {
  return colorString.split(', ');
}
export function getColorPreset2(): string[] {
  return colorString2.split(', ');
}

/**
 * Calculate contrast color (white or black) for a given background color.
 * @param hexColor Background color in hex format (#RRGGBB or #RGB).
 * @returns Contrast color in hex format (#FFFFFF or #000000).
 */
function getContrastColor(hexColor: string): string {
  // Remove the hash if it exists
  hexColor = hexColor.replace('#', '');

  // Convert shorthand hex (#RGB) to full hex (#RRGGBB)
  if (hexColor.length === 3) {
    hexColor = hexColor
      .split('')
      .map((char) => char + char)
      .join('');
  }

  // Parse RGB values
  const r = parseInt(hexColor.substring(0, 2), 16) / 255;
  const g = parseInt(hexColor.substring(2, 4), 16) / 255;
  const b = parseInt(hexColor.substring(4, 6), 16) / 255;

  // Calculate relative luminance
  const [rLum, gLum, bLum] = [r, g, b].map((channel) =>
    channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4),
  );
  const luminance = 0.2126 * rLum + 0.7152 * gLum + 0.0722 * bLum;

  // Return black (#000000) for light backgrounds, white (#FFFFFF) for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function getTestTagMatrix(
  groupCount: number,
  tagsPerGroup: number,
): TagGroup[] {
  const groups: TagGroup[] = [];
  const allColors = getColorPreset();
  const contrastColors = allColors.map((c) => getContrastColor(c));

  const totalTags = groupCount * tagsPerGroup;
  const colorStep = Math.floor(allColors.length / totalTags); // Calculate step size for even distribution

  let id = 1;

  for (let i = 0; i < groupCount; i++) {
    const groupName = `Group ${i + 1}`;
    const groupId = i + 1;
    const tags: Tag[] = [];

    const groupColorIndex =
      ((i * tagsPerGroup + 0) * colorStep) % allColors.length;
    for (let j = 0; j < tagsPerGroup; j++) {
      const colorIndex =
        ((i * tagsPerGroup + j) * colorStep) % allColors.length;
      tags.push({
        id: id++,
        group: groupId,
        name: `Badge: ${(i + 1) * (j + 1)}`,
        // name: `g+${i} t+${j} ${i + j + 1}`,
        color: contrastColors[colorIndex], // Pick color using calculated index
        backgroundColor: allColors[colorIndex], // Pick color using calculated index
      });
    }

    groups.push({
      id: groupId,
      title: groupName,
      tags: tags,
      color: contrastColors[groupColorIndex],
      backgroundColor: allColors[groupColorIndex],
    });
  }

  return groups;
}
