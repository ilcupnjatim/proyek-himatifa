import "dotenv/config";
import express from "express";
import passport from "passport";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";

import passp from "./src/middleware/passport.middleware.js";
import { conn } from "./database/index.js";

import routerAuth from "./src/router/auth.router.js";
import routerFile from "./src/router/image.router.js";
import routerShop from "./src/router/toko.router.js";
import adminRoutes from "./src/router/admin.router.js";
import loginRoutes from "./src/router/authAdmin.router.js";
import routerProduct from "./src/router/product.router.js";
import routerTransaction from "./src/router/transaction.router.js";

const app = express();
const { PORT } = process.env;

// app.use(function (req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
// 	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
// 	next();
// });

app.use(express.json());
app.use(
    morgan(
        `[LOG] ipAddr=:remote-addr date=[:date[web]] time=:response-time ms method=:method url=":url" status=":status" `
    )
);
// app.use(
// 	session({
// 		secret: "keyboard cat",
// 		resave: false,
// 		saveUninitialized: false,
// 		cookie: { secure: true, maxAge: 1000 * 60 * 100 },
// 	})
// );

const corsConfig = {
    // origin: true,
    credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(passport.initialize());
// app.use(passport.session());
passp(passport);

app.get("/", (req, res) => {
    res.send("Aktif");
});

app.use(
    "/api/seller/v1/shop",
    passport.authenticate("jwt", { session: false }),
    routerShop
);
app.use(
    "/api/seller/v1/product",
    passport.authenticate("jwt", { session: false }),
    routerProduct
);
app.use("/api/seller/v1/transaction", routerTransaction);
app.use("/api/seller/auth", routerAuth);
app.use("/api/seller/file", routerFile);

app.use("/api/admin/v1/data", adminRoutes);
app.use("/api/admin/auth", loginRoutes);

app.listen(PORT, async () => {
    await conn.connectRedis();
    console.log(`[SERVER] App Listen PORT : ${PORT}`);
});
