export interface ConvertOptions {
  separator: string;
  customSeparator?: string;
  removeSpaces: boolean;
  trimLines: boolean;
  ignoreEmptyLines: boolean;
}

export interface TextStats {
  inputChars: number;
  inputLines: number;
  outputChars: number;
  outputWords: number;
}

export interface ConvertResult {
  text: string;
  stats: TextStats;
}

/**
 * Obtiene la cadena de separador a utilizar según las opciones seleccionadas
 */
export function resolveSeparator(sepOption: string, customSep: string = ''): string {
  if (sepOption === '__otro') {
    return customSep;
  }
  return sepOption;
}

/**
 * Cuenta las palabras de un texto
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Convierte el texto multilinea a una sola línea según las opciones
 */
export function convertText(input: string, options: ConvertOptions): ConvertResult {
  const actualSeparator = resolveSeparator(options.separator, options.customSeparator);

  // Dividir en líneas manejando \r\n, \r y \n
  let lines = input.split(/\r\n|\r|\n/);
  const totalInputLines = input ? lines.length : 0;

  // Si se solicita recortar extremos de cada línea
  if (options.trimLines) {
    lines = lines.map(line => line.trim());
  }

  // Filtrar líneas vacías si está habilitado
  if (options.ignoreEmptyLines) {
    lines = lines.filter(line => line.length > 0);
  }

  // Unir líneas con el separador seleccionado
  let output = lines.join(actualSeparator);

  // Quitar todos los espacios si está habilitado
  if (options.removeSpaces) {
    output = output.replace(/[ \t\u00a0\r\n]+/g, '');
  }

  const stats: TextStats = {
    inputChars: input.length,
    inputLines: totalInputLines,
    outputChars: output.length,
    outputWords: countWords(output),
  };

  return {
    text: output,
    stats,
  };
}
