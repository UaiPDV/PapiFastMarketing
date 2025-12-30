import fs from 'fs';
import path from 'path';

const contentPath = path.resolve(process.cwd(), 'dist', 'content.json');
if (!fs.existsSync(contentPath)) {
	console.error('dist/content.json não encontrado');
	process.exit(1);
}

let s = fs.readFileSync(contentPath, 'utf8');
// Substitui xmlns='./img/external/xxxx' por xmlns='http://www.w3.org/2000/svg'
s = s.replace(
	/xmlns='\.\/img\/external\/[a-f0-9]+\.[a-z0-9]{2,6}'/g,
	"xmlns='http://www.w3.org/2000/svg'"
);
s = s.replace(
	/xmlns=\"\.\/img\/external\/[a-f0-9]+\.[a-z0-9]{2,6}\"/g,
	'xmlns="http://www.w3.org/2000/svg"'
);

fs.writeFileSync(contentPath, s, 'utf8');
console.log('Corrigido xmlns em', contentPath);
