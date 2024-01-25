import axios from "axios";

export async function apiDados(req, res) {
    const apiKey = 'AIzaSyBYaUS1c-Yb10PThoO3DsjEls5_bHWFN8s';
    const { cidade, tipo, estadoSelecionado } = req.query;

    if (!apiKey) {
        return res.status(400).json({ status: 400, response: 'Chave de API ausente' });
    }

    if (!cidade || !estadoSelecionado) {
        return res.status(400).json({ status: 400, response: 'Cidade e/ou estadoSelecionado ausentes' });
    }

    try {
        const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${tipo}+in+${cidade},${estadoSelecionado}&key=${apiKey}`;
        const placesResponse = await axios.get(apiUrl);

        const resultados = placesResponse.data.results;
        console.log(resultados)

        return res.status(200).json({ status: 200, response: resultados });
    } catch (error) {
        console.error('Erro na solicitação à API do Google Places:', error.message);
        return res.status(500).json({ status: 500, response: 'Erro na solicitação à API do Google Places: ' + error.message });
    }
}