export class FixedSizeArray<T> {
  private items: T[];
  private maxSize: number;

  constructor(maxSize: number = 16) {
    this.items = [];
    this.maxSize = maxSize;
  }

  insert(item: T): void {
    this.items.push(item);
    if (this.items.length > this.maxSize) {
      this.items.shift();
    }
  }

  addLastN(elements: T[]): void {
    const startIndex = Math.max(0, elements.length - this.maxSize);
    const newItems = elements.slice(startIndex);
    for (const item of newItems) {
      this.insert(item);
    }
  }

  getItems(): T[] {
    return this.items;
  }

  length(): number {
    return this.items.length;
  }
}
