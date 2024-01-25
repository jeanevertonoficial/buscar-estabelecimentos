import express from 'express';
import router from "./routes.js";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);


app.listen(8080, (err, res) => {console.log('Api Rodando na porta: http://127.0.0.1:8080',)});
