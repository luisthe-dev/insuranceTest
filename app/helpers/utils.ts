export class UtilsHelper {
  generateRandInt(length: number = 6) {
    let start = '';
    let end = '';

    for (let i = 0; i < length; i++) {
      start = start + '' + 0;
      end = end + '' + 9;
    }

    return Math.floor(
      Math.random() * (Number(end) - Number(start)) * Number(start),
    );
  }
}
