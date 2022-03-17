export const shuffle = arr => {
  let currIdx = arr.length;
  let tempVal, randomIdx;

  while (0 !== currIdx) {
    randomIdx = Math.floor(Math.random() * currIdx);
    currIdx -= 1;
    tempVal = arr[currIdx];
    arr[currIdx] = arr[randomIdx];
    arr[randomIdx] = tempVal;
  }
  return arr;
};
