import "dotenv/config";
import App from "./app";
import AuthRoute from "./routes/auth.route";
import IndexRoute from "./routes/index.route";
import UsersRoute from "./routes/users.route";
import validateEnv from "./utils/validateEnv";
import ProductsRoute from "./routes/products.route";
import UploadRoute from "./routes/upload.route";

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new ProductsRoute(),
  new UploadRoute(),
]);

app.listen();
