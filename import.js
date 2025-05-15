const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');

// Importe os modelos que você criou
const Banner = require('../models/banner');
const Colaborador = require('../models/colaborador');
const Destaque = require('../models/destaque');
const EspecieLocal = require('../models/especie_local');
const Footer = require('../models/footer');
const Header = require('../models/header');
const Metodologia = require('../models/metodologia');

dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Carrega as variáveis de ambiente

const mongoURI = process.env.MONGO_URI;

async function importData() {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Conectado ao MongoDB para importação...');

        // Opcional: Limpar as coleções antes da importação
        await Banner.deleteMany({});
        await Colaborador.deleteMany({});
        await Destaque.deleteMany({});
        await EspecieLocal.deleteMany({});
        await Footer.deleteMany({});
        await Header.deleteMany({});
        await Metodologia.deleteMany({});
        console.log('Coleções limpas com sucesso!');

        // Ler e importar dados para cada modelo
        async function importModel(model, filePath) {
            const jsonData = await fs.readFile(path.join(__dirname, filePath), 'utf8');
            const data = JSON.parse(jsonData);
            await model.insertMany(data);
            console.log(`Dados de ${filePath} importados para ${model.modelName}`);
        }

        await importModel(Banner, '../data/banner.json');
        await importModel(Colaborador, '../data/colaborador.json');
        await importModel(Destaque, '../data/destaques.json');
        await importModel(EspecieLocal, '../data/especie_local.json');
        await importModel(Footer, '../data/footer.json');
        await importModel(Header, '../data/header.json');
        await importModel(Metodologia, '../data/metodologia.json');

        console.log('Importação de dados concluída!');
        mongoose.disconnect();
    } catch (error) {
        console.error('Erro durante a importação:', error);
        mongoose.disconnect();
    }
}

importData();