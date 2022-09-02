// 가장 큰 수 찾기
// for / Math.max / ... spread

bigNum("12345");

function bigNum(str) {
  //   let biggest = 1;
  //   for (let i = 0; i < str.length; i++) {
  //     if (biggest < Number(str[i])) {
  //       biggest = Number(str[i]);
  //     }
  //   }
  //   return biggest;
  const number = str.split("");
  return Math.max(...number);
}

// My page

const myShopping = [
  { category: "과일", price: 12000 },
  { category: "의류", price: 10000 },
  { category: "의류", price: 20000 },
  { category: "장난감", price: 9000 },
  { category: "과일", price: 5000 },
  { category: "의류", price: 10000 },
  { category: "과일", price: 8000 },
  { category: "의류", price: 7000 },
  { category: "장난감", price: 5000 },
  { category: "의류", price: 10000 },
];

function grade() {
  let numberBuy = 0;
  let amount = 0;
  let gr = "";
  for (let i = 0; i < myShopping.length; i++) {
    if (myShopping[i].category === "의류") {
      numberBuy += 1;
      amount += myShopping[i].price;
    }
  }
  if (numberBuy >= 5) {
    gr = "Gold";
  } else if (numberBuy >= 3) {
    gr = "Silver";
  } else {
    gr = "Bronze";
  }
  return `의류를 구매한 횟수는 총 ${numberBuy}회 금액은 ${amount}원이며 등급은 ${gr}입니다.`;
}
grade(myShopping);
