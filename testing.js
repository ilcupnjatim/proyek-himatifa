// let toko_id = "ini nama id nya. dfsgdf";
// let tokos = "inifg";

import axios from "axios";

// console.log(toko_id.match(/^\S*$/) == null);

// function kosongAtauAdaSpasi(str) {
// 	return str.match(/^\S*$/) !== null;
// }

// let a = kosongAtauAdaSpasi(toko_id);
// console.log(a);

// let b = toko_id.replaceAll(" ", "-").replaceAll(".", "");
// console.log(b);
// import jwtt from "jsonwebtoken";
// import sign from "jwt-encode";

// const secret = "abcdefghijklmnopqrstuvwxyz1234567890";
// const data = { _id: "635ccc17f2943dad1eb19ffd", iat: 1667110146, exp: 1667113746 };
// const jwt = sign(data, secret);
// console.log(jwt);
// // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzVjY2MxN2YyOTQzZGFkMWViMTlmZmQiLCJpYXQiOjE2NjcxMTAxNDYsImV4cCI6MTY2NzExMzc0Nn0.x6WgBPC7RMdbd1h4BQj7N8U2_ppPHcivM7GG-wUGJJk

// let a = jwtt.verify(jwt, secret);
// console.log(a);

async function getDataToko() {
	return new Promise((resolve, reject) => {
		axios
			.get(`http://malon.my.id:8888/api/seller/v1/product/Ini-nama-Product-1.635e3fdb0f93dedf87ce3ce8.635e3948af42d1ad700326df`, {
				headers: {
					Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzVjY2MxN2YyOTQzZGFkMWViMTlmZmQiLCJpYXQiOjE2NjczNjY1OTEsImV4cCI6MTY2NzM3MDE5MX0.cmiUM0uhzE1H-VkVYQWGDUs5cXdpNFKjUhCBRTg4ZFg`,
				},
			})
			.then(({ data }) => {
				resolve(data);
			})
			.catch((err) => reject(err));
	});
}

// getDataToko().then(console.log).catch(console.log());

// import mongoose from "mongoose";
// var _id = mongoose.Types.ObjectId("6362189f9aa8247dc8d6203a");
// console.log(_id);

let strs = "08/12/23 22:21:40";

console.log(strs.split("/")[2].split(" ")[0]);
