import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import process from 'process';
import admin from 'firebase-admin';

async function main() {
	// Carrega credenciais: primeiro tenta variável de ambiente base64, depois arquivo serviceAccountKey.json
	let serviceAccount = null;

	if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
		try {
			const decoded = Buffer.from(
				process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
				'base64'
			).toString('utf8');
			serviceAccount = JSON.parse(decoded);
		} catch (e) {
			console.error(
				'Não foi possível decodificar FIREBASE_SERVICE_ACCOUNT_BASE64:',
				e.message
			);
			process.exit(1);
		}
	} else {
		const localPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
		if (fs.existsSync(localPath)) {
			serviceAccount = JSON.parse(fs.readFileSync(localPath, 'utf8'));
		}
	}

	if (!serviceAccount) {
		console.error(
			'Arquivo de credenciais do Firebase não encontrado. Forneça `serviceAccountKey.json` na raiz do projeto ou a variável FIREBASE_SERVICE_ACCOUNT_BASE64.'
		);
		process.exit(1);
	}

	admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
	const db = admin.firestore();

	try {
		// Tenta buscar nova estrutura: content/home e content/business
		const homeRef = db.doc('content/home');
		const businessRef = db.doc('content/business');

		const [homeSnap, businessSnap] = await Promise.all([
			homeRef.get(),
			businessRef.get(),
		]);

		let output = { homePage: {}, businessPage: {} };

		if (homeSnap.exists && businessSnap.exists) {
			output.homePage = homeSnap.data() || {};
			output.businessPage = businessSnap.data() || {};
		} else {
			// Fallback para estrutura legada: content/pages
			const legacyRef = db.doc('content/pages');
			const legacySnap = await legacyRef.get();
			if (legacySnap.exists) {
				const data = legacySnap.data() || {};
				output.homePage = data.homePage || {};
				output.businessPage = data.businessPage || {};
			} else {
				console.warn(
					'Nenhum documento de conteúdo encontrado em Firestore (content/home, content/business ou content/pages). Gerando arquivo vazio.'
				);
			}
		}

		const outDir = path.resolve(process.cwd(), 'public');
		if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
		const outPath = path.join(outDir, 'content.json');
		fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
		console.log('Gerado public/content.json com sucesso.');
	} catch (err) {
		console.error('Erro ao gerar conteúdo estático:', err);
		process.exit(1);
	}
}

main();
