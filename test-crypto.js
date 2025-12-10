import crypto from "crypto";

const rawToken = crypto.randomBytes(32).toString("hex");

const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

console.log(hashedToken);


/*
  arr1 = [10, 1, 200, 30] -> n                1000
  arr2 = [50, 6, 10, 40, 70, 1] -> m          1000

  int maxSum = 0;   // o(n * m) // 10^6
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      let tmp = arr1[i] + arr2[j];
      if (tmp > maxSum)
        maxSum = tmp;
    }
  }

  ######
  000000
  999999

  for (let i = 0; i <= 999999; i++) {
    15 * 100
  }

  o(n + m) -> // 2000
  int max1 = 0;
  for (let i = 0; i < arr1.length; i++)
    if (arr1[i] > max1)
      max1 = arr1[i];

  int max2 = 0;
  for (let i = 0; i < arr2.length; i++)
    if (arr2[i] > max2)
      max2 = arr2[i];

  ans = max1 + max2;
*/