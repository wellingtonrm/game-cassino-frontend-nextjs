/**
 * Removes all non-letter characters from a string and converts it to lowercase
 * @param text The input string to be processed
 * @returns A string containing only lowercase letters
 */
export function onlyLettersLowerCase(text: string): string {
  // Remove todos os caracteres que não são letras e converte para minúsculo
  return text.replace(/[^a-zA-Z]/g, '').toLowerCase();
}

/**
 * Example usage:
 * onlyLettersLowerCase("Hello123 World!") // returns "helloworld"
 * onlyLettersLowerCase("João@Silva") // returns "joaosilva"
 * onlyLettersLowerCase("Test-Case_123") // returns "testcase"
 */