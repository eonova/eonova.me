export function getFlatArrLength(arr: any[]): number {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) {
      return acc + getFlatArrLength(item);
    }
    return acc + 1;
  }, 0);
}
