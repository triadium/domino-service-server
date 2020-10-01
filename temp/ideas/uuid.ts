import { v4 as uuidv4 } from 'uuid';


const keyv4: number[] = [];
uuidv4(null, keyv4);
console.log(keyv4);

/**
 * Convert 20-bits number into 4-chars string using a dictionary
 * @param v20 20-bits number
 * @returns 4-chars string
 */
const d32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
function chars32(v20: number): string {
  let r = d32[(v20 >> 15) & 0x1F];
  r += d32[(v20 >> 10) & 0x1F];
  r += d32[(v20 >> 5) & 0x1F];
  r += d32[v20 & 0x1F];
  return r;
}

/**
 * Convert byte into 2-chars string using a dictionary
 * @param v8 8-bits number
 * @returns 2-chars string
 */
const d16 = 'ABCDEFGHJKMNPQRS';
function chars16(v8: number): string {
  let r = d16[(v8 >> 4) & 0x0F];
  r += d16[v8 & 0x0F];
  return r;
}

/**
 * Get three bytes and return four-chars string
 * @param a byte 2
 * @param b byte 1
 * @param c byte 0
 * @description Algorithm takes two bytes (a, b) and upper-half of byte c
 * and combines they into 20-bits number. For every 5 bits forms a char
 * from dictionary, where 5-bits value - index in the dictionary
 */
function abc(a: number, b: number, c: number): string {
  let r = ((a << 12) & 0xff000) | ((b << 4) & 0x00ff0) | ((c >> 4) & 0x0000f);
  return chars32(r);
}
/**
 * Get three bytes and return four-chars string
 * @param c byte 2
 * @param a byte 1
 * @param b byte 0
 * @description Algorithm takes lower-half of byte c and two bytes (a, b)
 * and combines they into 20-bits number. For every 5 bits forms a char
 * from dictionary, where 5-bits value - index in the dictionary
 */
function cab(c: number, a: number, b: number): string {
  let r = ((c << 16) & 0xf0000) | ((a << 8) & 0x0ff00) | (b & 0x000ff);
  return chars32(r);
}

const kr5 = keyv4.length % 5;
const mk5 = (keyv4.length - kr5) / 5;
let r = abc(keyv4[0], keyv4[1], keyv4[2]) + cab(keyv4[2], keyv4[3], keyv4[4]);
for(let i = 1, j = 5; i < mk5; ++i, j += 5){
  r += abc(keyv4[j], keyv4[j + 1], keyv4[j + 2]) + cab(keyv4[j + 2], keyv4[j + 3], keyv4[j + 4]);
}

for (let i = 0, j = keyv4.length - kr5; i < kr5; ++i, ++j) {
  r += chars16(keyv4[j]);
}

console.log(r);

const chr8 = r.length % 8;
const mch8 = (r.length - chr8) / 8;
const buf = [];
for (let i = 0, j = 0; i < mch8; ++i, j += 8) {
  const s1 = (d32.indexOf(r[j]) << 15) | (d32.indexOf(r[j + 1]) << 10) | (d32.indexOf(r[j + 2]) << 5) | d32.indexOf(r[j + 3]);
  const s2 = (d32.indexOf(r[j + 4]) << 15) | (d32.indexOf(r[j + 5]) << 10) | (d32.indexOf(r[j + 6]) << 5) | d32.indexOf(r[j + 7]);
  buf.push((s1 >> 12) & 0xFF);
  buf.push((s1 >> 4) & 0xFF);
  buf.push(((s1 << 4) & 0xF0) | ((s2 >> 16) & 0x0F));
  buf.push((s2 >> 8) & 0xFF);
  buf.push(s2 & 0xFF);
}

for (let i = 0, j = r.length - chr8; i < chr8; i += 2, j += 2) {
  const s = (d16.indexOf(r[j]) << 4) & 0xF0 | (d16.indexOf(r[j + 1]) & 0x0F);
  buf.push(s);
}
console.log(buf);

let ok = true;
for(let i = 0; i < buf.length; ++i){
  ok = ok && (buf[i] === keyv4[i]);
}
console.log(ok);