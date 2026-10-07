export interface VerseToken {
  text: string;
  strongCode?: string;
}

export interface ParsedVerseData {
  cleanText: string;
  tokens: VerseToken[];
  crossReferences: string[];
  primaryStrongCode?: string;
}

/**
 * Parses raw USFM text containing Strong's tags and cross-references:
 * e.g. "Au \x a \xo 1.1 \xt Job 38:4.\x*\w commencement|strong="H7225"\w*, Dieu \w créa|strong="H1254"\w*"
 */
export function parseTaggedVerseText(raw: string): ParsedVerseData {
  if (!raw) {
    return { cleanText: '', tokens: [], crossReferences: [] };
  }

  // 1. Extract cross-references: \x [letter] \xo [ref] \xt [passages]\x*
  const crossReferences: string[] = [];
  const crossRefRegex = /\\x\s+[a-z]?\s*(?:\\xo\s+[\d.]+\s*)?\\xt\s*(.*?)\\x\*/g;
  let crMatch;
  while ((crMatch = crossRefRegex.exec(raw)) !== null) {
    if (crMatch[1]) {
      crossReferences.push(crMatch[1].trim());
    }
  }

  // 2. Strip cross-reference tags from working text
  let strippedText = raw.replace(/\\x[\s\S]*?\\x\*/g, '');

  // 3. Extract tokens with Strong codes
  const tokens: VerseToken[] = [];
  let primaryStrongCode: string | undefined;

  // Regex to match \w word|strong="CODE"\w* or plain text outside \w ... \w*
  const wordStrongRegex = /\\w\s+([^|\\*]+)\|strong="([^"]+)"\\w\*/g;

  let lastIndex = 0;
  let match;

  while ((match = wordStrongRegex.exec(strippedText)) !== null) {
    // Add text preceding this match
    if (match.index > lastIndex) {
      const plainSegment = strippedText.slice(lastIndex, match.index);
      if (plainSegment) {
        tokens.push({ text: cleanSegment(plainSegment) });
      }
    }

    const word = match[1].trim();
    const strongCode = match[2].trim();

    if (!primaryStrongCode && strongCode) {
      primaryStrongCode = strongCode;
    }

    tokens.push({
      text: word,
      strongCode,
    });

    lastIndex = wordStrongRegex.lastIndex;
  }

  // Remaining text after last match
  if (lastIndex < strippedText.length) {
    const trailing = strippedText.slice(lastIndex);
    if (trailing) {
      tokens.push({ text: cleanSegment(trailing) });
    }
  }

  // 4. Construct clean plain text
  const cleanText = tokens
    .map((t) => t.text)
    .join('')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/’\s+/g, '’')
    .replace(/l'\s+/g, "l'")
    .replace(/d'\s+/g, "d'")
    .replace(/qu'\s+/g, "qu'")
    .replace(/s'\s+/g, "s'")
    .replace(/n'\s+/g, "n'")
    .replace(/m'\s+/g, "m'")
    .replace(/t'\s+/g, "t'")
    .replace(/j'\s+/g, "j'")
    .replace(/c'\s+/g, "c'")
    .trim();

  return {
    cleanText,
    tokens,
    crossReferences,
    primaryStrongCode,
  };
}

function cleanSegment(seg: string): string {
  return seg
    .replace(/\\w\*/g, '')
    .replace(/\\w/g, '')
    .replace(/\\/g, '');
}
