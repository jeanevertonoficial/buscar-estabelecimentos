import { Router } from 'express'
import {apiDados} from "./controller/getApi.js";

const router = Router();

// rota base
router.get('/', (req, res) => {
    res.json({
        "StatusCode": 200,
        "msg": "Rota api ativada!"
    })
})

router.get('/buscar-estabelecimentos', apiDados);

export default router;