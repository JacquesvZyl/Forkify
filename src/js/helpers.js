import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export async function getJSON(url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    //prettier-ignore
    if (!res.ok) throw new Error(`${data.message} (Status code: ${res.status})`);

    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
}