import { LanguageConfig } from "@/components/types/editor";

export const LANGUAGE_CONFIG: LanguageConfig = {
  javascript: {
    pistonRuntime: {
      language: "javascript",
      version: "18.15.0",
    },
    monacoLanguage: "javascript",
    defaultCode: `// JavaScript Playground
const numbers = [1, 2, 3, 4, 5];

// Map numbers to their squares
const squares = numbers.map(n => n * n);
console.log('Original numbers:', numbers);
console.log('Squared numbers:', squares);

// Filter for even numbers
const evenNumbers = numbers.filter(n => n % 2 === 0);
console.log('Even numbers:', evenNumbers);

// Calculate sum using reduce
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log('Sum of numbers:', sum);`,
  },
  python: {
    pistonRuntime: {
      language: "python",
      version: "3.10.0",
    },
    monacoLanguage: "python",
    defaultCode: `# Python Playground
numbers = [1, 2, 3, 4, 5]

# Map numbers to their squares
squares = [n ** 2 for n in numbers]
print(f"Original numbers: {numbers}")
print(f"Squared numbers: {squares}")

# Filter for even numbers
even_numbers = [n for n in numbers if n % 2 == 0]
print(f"Even numbers: {even_numbers}")

# Calculate sum using reduce (functools.reduce in Python)
from functools import reduce
sum_numbers = reduce(lambda acc, curr: acc + curr, numbers, 0)
print(f"Sum of numbers: {sum_numbers}")`,
  },
  typescript: {
    pistonRuntime: {
      language: "typescript",
      version: "5.0.3",
    },
    monacoLanguage: "typescript",
    defaultCode: `// TypeScript Playground
const numbers: number[] = [1, 2, 3, 4, 5];

// Map numbers to their squares
const squares: number[] = numbers.map((n: number) => n * n);
console.log('Original numbers:', numbers);
console.log('Squared numbers:', squares);

// Filter for even numbers
const evenNumbers: number[] = numbers.filter((n: number) => n % 2 === 0);
console.log('Even numbers:', evenNumbers);

// Calculate sum using reduce
const sum: number = numbers.reduce((acc: number, curr: number) => acc + curr, 0);
console.log('Sum of numbers:', sum);`,
  },
}

