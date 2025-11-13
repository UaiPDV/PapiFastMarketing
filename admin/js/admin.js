import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
	getFirestore,
	doc,
	getDoc,
	setDoc,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
	apiKey: 'AIzaSyDmScpF_IsLIWRtltZg09yDpOkYIyE1MrU',
	authDomain: 'papifast-90f21.firebaseapp.com',
	projectId: 'papifast-90f21',
	storageBucket: 'papifast-90f21.appspot.com',
	messagingSenderId: '423481031884',
	appId: '1:423481031884:web:8f2e02e4fd8bc9a0e55669',
	measurementId: 'G-0S2L6TXN0W',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const contentRef = doc(db, 'content', 'pages');

const loadingState = document.getElementById('loading-state');
const initializationState = document.getElementById('initialization-state');
const editorState = document.getElementById('editor-state');
const initializeButton = document.getElementById('initialize-button');
const saveButton = document.getElementById('save-button');
const statusMessage = document.getElementById('status-message');

function showStatus(message, isError = false) {
	statusMessage.textContent = message;
	statusMessage.classList.remove('hidden');
	statusMessage.className = `p-4 rounded-lg text-center font-semibold sticky top-4 z-50 ${
		isError
			? 'bg-red-500/20 text-red-300'
			: 'bg-green-500/20 text-green-300'
	}`;
	setTimeout(() => statusMessage.classList.add('hidden'), 5000);
}

function setNestedValue(obj, path, value) {
	if (path.endsWith('.points') && typeof value === 'string') {
		value = value
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean);
	}
	const keys = path.split('.');
	let current = obj;
	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		const nextKey = keys[i + 1];
		const isNextKeyNumber = !isNaN(parseInt(nextKey, 10));

		if (current[key] === undefined || current[key] === null) {
			current[key] = isNextKeyNumber ? [] : {};
		}
		current = current[key];
	}
	current[keys[keys.length - 1]] = value;
}

function getNestedValue(obj, path) {
	const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
	if (path.endsWith('.points') && Array.isArray(value)) {
		return value.join('\n');
	}
	return value;
}

function createItemElement(pathPrefix, index, itemData, fields) {
	const itemDiv = document.createElement('div');
	itemDiv.className =
		'relative p-4 border border-gray-600 rounded-lg space-y-2 mb-4 list-item';
	const removeButton = document.createElement('button');
	removeButton.type = 'button';
	removeButton.innerHTML = '&times;';
	removeButton.className =
		'absolute top-2 right-2 h-8 w-8 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full';
	removeButton.onclick = () => {
		itemDiv.remove();
		reindexItems(itemDiv.parentElement, pathPrefix);
	};
	itemDiv.appendChild(removeButton);
	const itemTitle = document.createElement('h5');
	itemTitle.className = 'font-bold text-gray-300 mb-2';
	itemTitle.textContent = `Item ${index + 1}`;
	itemDiv.appendChild(itemTitle);
	fields.forEach((field) => {
		const fieldDiv = document.createElement('div');
		const label = document.createElement('label');
		label.textContent = field.label;
		fieldDiv.appendChild(label);
		const input = document.createElement(
			field.type === 'textarea' ? 'textarea' : 'input'
		);
		if (input.tagName.toLowerCase() === 'input') input.type = 'text';
		input.dataset.path = `${pathPrefix}.${index}.${field.key}`;

		let value = itemData[field.key] || '';
		if (field.key === 'points' && Array.isArray(value)) {
			input.value = value.join('\n');
		} else {
			input.value = value;
		}

		if (field.type === 'textarea') input.classList.add('h-20');
		if (field.key === 'points') input.classList.add('h-24');
		fieldDiv.appendChild(input);
		itemDiv.appendChild(fieldDiv);
	});
	return itemDiv;
}

function reindexItems(container, pathPrefix) {
	container.querySelectorAll('.list-item').forEach((itemDiv, newIndex) => {
		itemDiv.querySelector('h5').textContent = `Item ${newIndex + 1}`;
		itemDiv.querySelectorAll('[data-path]').forEach((input) => {
			const parts = input.dataset.path.split('.');
			parts[parts.length - 2] = newIndex;
			input.dataset.path = parts.join('.');
		});
	});
}

function createListEditor(
	containerId,
	data,
	pathPrefix,
	fields,
	newItemTemplate
) {
	const container = document.getElementById(containerId);
	container.innerHTML = '';
	const dataArray = Array.isArray(data) ? data : [];
	dataArray.forEach((item, index) =>
		container.appendChild(
			createItemElement(pathPrefix, index, item, fields)
		)
	);

	const addButton = document.createElement('button');
	addButton.type = 'button';
	addButton.textContent = 'Adicionar Novo Item';
	addButton.className =
		'w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg';
	addButton.onclick = () => {
		const count = container.querySelectorAll('.list-item').length;
		container.insertBefore(
			createItemElement(pathPrefix, count, newItemTemplate, fields),
			addButton
		);
	};
	container.appendChild(addButton);
}

function createFixedListEditor(containerId, data, pathPrefix, fields) {
	const container = document.getElementById(containerId);
	container.innerHTML = '';
	const itemCount = fields.itemCount || (data ? data.length : 0);
	for (let index = 0; index < itemCount; index++) {
		const item = data ? data[index] : {};
		const itemDiv = document.createElement('div');
		itemDiv.className = 'space-y-4 pt-4 border-t border-gray-700 mt-4';
		const itemTitle = document.createElement('h5');
		itemTitle.className = 'font-bold text-gray-300';
		itemTitle.textContent = `Item ${index + 1}`;
		itemDiv.appendChild(itemTitle);
		fields.structure.forEach((field) => {
			const fieldDiv = document.createElement('div');
			const label = document.createElement('label');
			label.textContent = field.label;
			fieldDiv.appendChild(label);
			const input = document.createElement(
				field.type === 'textarea' ? 'textarea' : 'input'
			);
			if (input.tagName.toLowerCase() === 'input') input.type = 'text';
			input.dataset.path = `${pathPrefix}.${index}.${field.key}`;
			input.value =
				item && item[field.key]
					? Array.isArray(item[field.key])
						? item[field.key].join('\n')
						: item[field.key]
					: '';
			if (field.type === 'textarea') {
				if (field.key === 'icon') {
					input.classList.add('h-24', 'font-mono', 'text-sm');
				} else {
					input.classList.add('h-20');
				}
			}
			fieldDiv.appendChild(input);
			itemDiv.appendChild(fieldDiv);
		});
		container.appendChild(itemDiv);
	}
}

// MODIFICADO: Editor de Fluxo da Home (Dinâmico para fluxos, Fixo para 4 passos)
function createHomeFlowsEditor(containerId, flows, pathPrefix) {
	const container = document.getElementById(containerId);
	container.innerHTML = '';
	const flowsArray = Array.isArray(flows) ? flows : [];

	flowsArray.forEach((flow, flowIndex) => {
		const flowCard = document.createElement('div');
		flowCard.className =
			'border-2 border-orange-500/30 rounded-lg p-4 mb-4 bg-gray-800/50 flow-card';

		// Header do fluxo
		const flowHeader = document.createElement('div');
		flowHeader.className = 'flex justify-between items-center mb-4';
		flowHeader.innerHTML = `
			<h4 class="text-lg font-bold text-orange-300">Fluxo ${flowIndex + 1}</h4>
			<button type="button" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-bold remove-flow-btn">Remover Fluxo</button>
		`;
		flowCard.appendChild(flowHeader);

		// Configurações do fluxo (Título/Subtítulo do SLIDE)
		const configDiv = document.createElement('div');
		configDiv.className = 'space-y-3 mb-4 pb-4 border-b border-gray-600';
		configDiv.innerHTML = `
			<div><label>Título do Slide (Opcional)</label><input type="text" data-path="${pathPrefix}.${flowIndex}.sectionTitle" value="${
			flow.sectionTitle || ''
		}" /></div>
			<div><label>Subtítulo do Slide (Opcional)</label><textarea data-path="${pathPrefix}.${flowIndex}.sectionSubtitle" class="h-16">${
			flow.sectionSubtitle || ''
		}</textarea></div>
		`;
		flowCard.appendChild(configDiv);

		// Container dos 4 PASSOS FIXOS
		const stepsContainer = document.createElement('div');
		stepsContainer.className = 'space-y-3';

		const fixedStepLabels = ['Passo 1', 'Passo 2', 'Passo 3', 'Passo 4'];
		for (let i = 0; i < 4; i++) {
			const stepData = flow.steps?.[i] || {};
			const stepDiv = document.createElement('div');
			stepDiv.className =
				'p-3 border border-gray-600 rounded bg-gray-700/30';

			stepDiv.innerHTML = `
				<h5 class="font-semibold text-gray-200 mb-2">${fixedStepLabels[i]}</h5>
				<div class="space-y-2">
					<div>
						<label class="text-sm">Título (Ex: Crie o Evento)</label>
						<input type="text" data-path="${pathPrefix}.${flowIndex}.steps.${i}.title" value="${
				stepData.title || ''
			}" />
					</div>
					<div>
						<label class="text-sm">Descrição</label>
						<textarea class="h-20" data-path="${pathPrefix}.${flowIndex}.steps.${i}.description">${
				stepData.description || ''
			}</textarea>
					</div>
				</div>
			`;
			stepsContainer.appendChild(stepDiv);
		}

		flowCard.appendChild(stepsContainer);
		container.appendChild(flowCard);
	});

	// Adiciona listener para botões de remover
	container.querySelectorAll('.remove-flow-btn').forEach((btn) => {
		btn.onclick = () => {
			btn.closest('.flow-card').remove();
			reindexHomeFlows(container, pathPrefix);
		};
	});

	// Botão adicionar fluxo
	const addFlowBtn = document.createElement('button');
	addFlowBtn.type = 'button';
	addFlowBtn.textContent = '+ Adicionar Novo Fluxo';
	addFlowBtn.className =
		'w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg';
	addFlowBtn.onclick = () => {
		const count = container.querySelectorAll('.flow-card').length;
		// Adiciona um novo fluxo com 4 passos em branco
		const newFlowData = {
			sectionTitle: `Novo Fluxo ${count + 1}`,
			sectionSubtitle: '',
			steps: [{}, {}, {}, {}],
		};
		// Recria a UI (mais fácil que reindexar manualmente)
		const currentFlows = getHomeFlowsDataFromUI(container, pathPrefix);
		currentFlows.push(newFlowData);
		createHomeFlowsEditor(containerId, currentFlows, pathPrefix);
	};
	container.appendChild(addFlowBtn);
}

// Helper para reindexar os data-paths dos fluxos da home
function reindexHomeFlows(container, pathPrefix) {
	container.querySelectorAll('.flow-card').forEach((flowCard, flowIndex) => {
		flowCard.querySelector('h4').textContent = `Fluxo ${flowIndex + 1}`;
		flowCard.querySelectorAll('[data-path]').forEach((input) => {
			const parts = input.dataset.path.split('.');
			parts[2] = flowIndex; // Atualiza o índice do fluxo [homePage.flows.INDEX.key]
			input.dataset.path = parts.join('.');
		});
	});
}

// Helper para ler os dados da UI dos fluxos da home
function getHomeFlowsDataFromUI(container, pathPrefix) {
	const flows = [];
	container.querySelectorAll('.flow-card').forEach((flowCard) => {
		const flow = { steps: [{}, {}, {}, {}] }; // Garante 4 passos

		flowCard.querySelectorAll('[data-path]').forEach((input) => {
			const path = input.dataset.path;
			const parts = path.split('.'); // e.g., homePage.flows.0.steps.1.title

			if (parts.length === 5 && parts[3] === 'steps') {
				// É um campo de passo
				const stepIndex = parseInt(parts[4], 10);
				const key = parts[5];
				if (flow.steps[stepIndex]) {
					flow.steps[stepIndex][key] = input.value;
				}
			} else if (parts.length === 4) {
				// É um campo do fluxo (sectionTitle/Subtitle)
				const key = parts[3];
				flow[key] = input.value;
			}
		});
		flows.push(flow);
	});
	return flows;
}

// Editor de Fluxos (Dinâmico - Mantido para a pág. Business)
function createFlowsEditor(containerId, flows, pathPrefix) {
	const container = document.getElementById(containerId);
	container.innerHTML = '';
	const flowsArray = Array.isArray(flows) ? flows : [];

	flowsArray.forEach((flow, flowIndex) => {
		const flowCard = document.createElement('div');
		flowCard.className =
			'border-2 border-orange-500/30 rounded-lg p-4 mb-4 bg-gray-800/50 flow-card-business'; // Classe diferente

		// Header do fluxo
		const flowHeader = document.createElement('div');
		flowHeader.className = 'flex justify-between items-center mb-4';
		flowHeader.innerHTML = `
			<h4 class="text-lg font-bold text-orange-300">Fluxo ${flowIndex + 1}</h4>
			<button type="button" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-bold remove-flow-btn-business">Remover Fluxo</button>
		`;
		flowCard.appendChild(flowHeader);

		// Configurações do fluxo
		const configDiv = document.createElement('div');
		configDiv.className = 'space-y-3 mb-4 pb-4 border-b border-gray-600';
		configDiv.innerHTML = `
			<div><label>Título da Seção</label><input type="text" data-path="${pathPrefix}.${flowIndex}.sectionTitle" value="${
			flow.sectionTitle || ''
		}" /></div>
			<div><label>Subtítulo da Seção</label><textarea data-path="${pathPrefix}.${flowIndex}.sectionSubtitle" class="h-16">${
			flow.sectionSubtitle || ''
		}</textarea></div>
		`;
		flowCard.appendChild(configDiv);

		// Container dos passos
		const stepsContainer = document.createElement('div');
		stepsContainer.className = 'space-y-3 steps-container-business';
		stepsContainer.id = `${containerId}-flow-${flowIndex}-steps`;

		(flow.steps || []).forEach((step, stepIndex) => {
			stepsContainer.appendChild(
				createFlowStepElement(
					pathPrefix,
					flowIndex,
					stepIndex,
					step,
					stepsContainer
				)
			);
		});

		flowCard.appendChild(stepsContainer);

		// Botão adicionar passo
		const addStepBtn = document.createElement('button');
		addStepBtn.type = 'button';
		addStepBtn.textContent = '+ Adicionar Passo';
		addStepBtn.className =
			'w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded add-step-btn-business';
		addStepBtn.onclick = () => {
			const count =
				stepsContainer.querySelectorAll('.flow-step-item').length;
			stepsContainer.appendChild(
				createFlowStepElement(
					pathPrefix,
					flowIndex,
					count,
					{
						icon: '📱',
						title: '',
						label: '',
						arrowType: '',
					},
					stepsContainer
				)
			);
		};
		flowCard.appendChild(addStepBtn);

		container.appendChild(flowCard);
	});

	// Listeners para Pág. Business
	container.querySelectorAll('.remove-flow-btn-business').forEach((btn) => {
		btn.onclick = () => {
			btn.closest('.flow-card-business').remove();
			reindexBusinessFlows(container, pathPrefix);
		};
	});

	// Botão adicionar fluxo
	const addFlowBtn = document.createElement('button');
	addFlowBtn.type = 'button';
	addFlowBtn.textContent = '+ Adicionar Novo Fluxo';
	addFlowBtn.className =
		'w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg';
	addFlowBtn.onclick = () => {
		// Coletar dados atuais dos fluxos antes de recriar
		const currentFlows = getBusinessFlowsDataFromUI(container, pathPrefix);
		// Adicionar novo fluxo
		currentFlows.push({
			sectionTitle: '',
			sectionSubtitle: '',
			steps: [{ icon: '📱', title: '', label: '', arrowType: '' }],
		});
		createFlowsEditor(containerId, currentFlows, pathPrefix);
	};
	container.appendChild(addFlowBtn);
}

// Helper para ler dados da UI dos fluxos da pág. Business
function getBusinessFlowsDataFromUI(container, pathPrefix) {
	const flows = [];
	container.querySelectorAll('.flow-card-business').forEach((flowCard) => {
		const flow = { steps: [] };
		flowCard.querySelectorAll('[data-path]').forEach((input) => {
			const path = input.dataset.path; // e.g., businessPage.flows.0.steps.1.title
			const parts = path.split('.');
			const key = parts[parts.length - 1];
			const stepIndexMatch = path.match(/\.steps\.(\d+)\./);

			if (stepIndexMatch) {
				const stepIdx = parseInt(stepIndexMatch[1]);
				if (!flow.steps[stepIdx]) flow.steps[stepIdx] = {};
				flow.steps[stepIdx][key] = input.value;
			} else if (parts.length === 4) {
				// businessPage.flows.0.sectionTitle
				flow[key] = input.value;
			}
		});
		flows.push(flow);
	});
	return flows;
}

// Reindexador para Pág. Business
function reindexBusinessFlows(container, pathPrefix) {
	container
		.querySelectorAll('.flow-card-business')
		.forEach((flowCard, flowIndex) => {
			flowCard.querySelector('h4').textContent = `Fluxo ${flowIndex + 1}`;
			flowCard.querySelectorAll('[data-path]').forEach((input) => {
				const parts = input.dataset.path.split('.');
				parts[2] = flowIndex; // Atualiza o índice do fluxo
				input.dataset.path = parts.join('.');
			});

			// Reindexa os steps internos
			reindexFlowSteps(
				flowCard.querySelector('.steps-container-business'),
				pathPrefix,
				flowIndex
			);
		});
}

function createFlowStepElement(
	pathPrefix,
	flowIndex,
	stepIndex,
	stepData,
	stepsContainer
) {
	const stepDiv = document.createElement('div');
	stepDiv.className =
		'relative border border-gray-600 rounded p-3 bg-gray-700/30 flow-step-item';

	const removeBtn = document.createElement('button');
	removeBtn.type = 'button';
	removeBtn.innerHTML = '&times;';
	removeBtn.className =
		'absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-sm';
	removeBtn.onclick = () => {
		stepDiv.remove();
		reindexFlowSteps(stepsContainer, pathPrefix, flowIndex);
	};
	stepDiv.appendChild(removeBtn);

	const stepTitle = document.createElement('h5');
	stepTitle.className = 'font-semibold text-gray-200 mb-2';
	stepTitle.textContent = `Passo ${stepIndex + 1}`;
	stepDiv.appendChild(stepTitle);

	const fieldsDiv = document.createElement('div');
	fieldsDiv.className = 'space-y-2';

	// Grid de ícone e título
	const gridDiv = document.createElement('div');
	gridDiv.className = 'grid grid-cols-2 gap-2';
	gridDiv.innerHTML = `
		<div><label class="text-sm">Ícone/Emoji</label><input type="text" data-path="${pathPrefix}.${flowIndex}.steps.${stepIndex}.icon" value="${
		stepData.icon || ''
	}" placeholder="📱" /></div>
		<div><label class="text-sm">Título (dentro do círculo)</label><input type="text" data-path="${pathPrefix}.${flowIndex}.steps.${stepIndex}.title" value="${
		stepData.title || ''
	}" /></div>
	`;
	fieldsDiv.appendChild(gridDiv);

	// Label
	const labelDiv = document.createElement('div');
	labelDiv.innerHTML = `<label class="text-sm">Label (abaixo do círculo)</label><input type="text" data-path="${pathPrefix}.${flowIndex}.steps.${stepIndex}.label" value="${
		stepData.label || ''
	}" />`;
	fieldsDiv.appendChild(labelDiv);

	// Select de tipo de seta
	const arrowDiv = document.createElement('div');
	const arrowLabel = document.createElement('label');
	arrowLabel.className = 'text-sm';
	arrowLabel.textContent = 'Tipo de Seta';
	const arrowSelect = document.createElement('select');
	arrowSelect.dataset.path = `${pathPrefix}.${flowIndex}.steps.${stepIndex}.arrowType`;
	arrowSelect.className =
		'bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white w-full';
	arrowSelect.innerHTML = `
		<option value="">Normal (Reta)</option>
		<option value="curved">Curva</option>
	`;
	arrowSelect.value = stepData.arrowType || '';
	arrowDiv.appendChild(arrowLabel);
	arrowDiv.appendChild(arrowSelect);
	fieldsDiv.appendChild(arrowDiv);

	stepDiv.appendChild(fieldsDiv);

	return stepDiv;
}

function reindexFlowSteps(container, pathPrefix, flowIndex) {
	container
		.querySelectorAll('.flow-step-item')
		.forEach((stepDiv, newIndex) => {
			stepDiv.querySelector('h5').textContent = `Passo ${newIndex + 1}`;
			stepDiv.querySelectorAll('[data-path]').forEach((input) => {
				const parts = input.dataset.path.split('.');
				parts[2] = flowIndex; // Garante que o índice do fluxo está correto
				parts[4] = newIndex; // Atualiza o índice do passo
				input.dataset.path = parts.join('.');
			});
		});
}

async function loadContent() {
	try {
		const docSnap = await getDoc(contentRef);
		if (docSnap.exists()) {
			const data = docSnap.data();
			document
				.querySelectorAll('#editor-state [data-path]')
				.forEach((input) => {
					if (
						input.closest(
							'.dynamic-list-container, #features-items-editor, #business-features-editor, #business-value-prop-editor, #info-sections-editor, #home-flows-editor, #business-flows-editor'
						)
					)
						return;
					const path = input.dataset.path;
					const value = getNestedValue(data, path);
					if (value !== undefined && value !== null) {
						input.value = value;
					}
				});

			// --- Página Principal ---
			createFixedListEditor(
				'features-items-editor',
				data.homePage?.features?.items,
				'homePage.features.items',
				{
					itemCount: 6,
					structure: [
						{ label: 'Título', key: 'title' },
						{
							label: 'Descrição',
							key: 'description',
							type: 'textarea',
						},
					],
				}
			);
			createListEditor(
				'screenshots-items-editor',
				data.homePage?.screenshots?.items,
				'homePage.screenshots.items',
				[
					{ label: 'URL da Imagem', key: 'image' },
					{ label: 'Legenda', key: 'caption' },
				],
				{ image: '', caption: '' }
			);
			createListEditor(
				'testimonials-items-editor',
				data.homePage?.testimonials?.items,
				'homePage.testimonials.items',
				[
					{
						label: 'Depoimento',
						key: 'quote',
						type: 'textarea',
					},
					{ label: 'Autor', key: 'author' },
				],
				{ quote: '', author: '' }
			);

			// MODIFICADO: Chama o novo editor de fluxo da home
			createHomeFlowsEditor(
				'home-flows-editor',
				data.homePage?.flows,
				'homePage.flows'
			);

			// --- Página de Empresas ---
			createFixedListEditor(
				'business-value-prop-editor',
				data.businessPage?.valueProposition?.items,
				'businessPage.valueProposition.items',
				{
					itemCount: 3,
					structure: [
						{
							label: 'Ícone (SVG)',
							key: 'icon',
							type: 'textarea',
						},
						{ label: 'Título', key: 'title' },
						{
							label: 'Descrição',
							key: 'description',
							type: 'textarea',
						},
					],
				}
			);
			createListEditor(
				'info-sections-editor',
				data.businessPage?.infoSections,
				'businessPage.infoSections',
				[
					{ label: 'Título', key: 'title' },
					{
						label: 'Descrição',
						key: 'description',
						type: 'textarea',
					},
					{
						label: 'Pontos (um por linha)',
						key: 'points',
						type: 'textarea',
					},
					{ label: 'URL da Imagem', key: 'image' },
				],
				{
					title: 'Novo Título',
					description: '',
					points: [],
					image: '',
				}
			);
			createFixedListEditor(
				'business-features-editor',
				data.businessPage?.features?.items,
				'businessPage.features.items',
				{
					itemCount: 6,
					structure: [
						{
							label: 'Ícone (SVG)',
							key: 'icon',
							type: 'textarea',
						},
						{ label: 'Título', key: 'title' },
						{
							label: 'Descrição',
							key: 'description',
							type: 'textarea',
						},
					],
				}
			);
			createListEditor(
				'business-screenshots-editor',
				data.businessPage?.screenshots?.items,
				'businessPage.screenshots.items',
				[
					{ label: 'URL da Imagem', key: 'image' },
					{ label: 'Legenda', key: 'caption' },
				],
				{ image: '', caption: '' }
			);
			createListEditor(
				'business-testimonials-editor',
				data.businessPage?.testimonials?.items,
				'businessPage.testimonials.items',
				[
					{
						label: 'Depoimento',
						key: 'quote',
						type: 'textarea',
					},
					{ label: 'Autor', key: 'author' },
				],
				{ quote: '', author: '' }
			);

			createFlowsEditor(
				'business-flows-editor',
				data.businessPage?.flows,
				'businessPage.flows'
			);

			loadingState.classList.add('hidden');
			editorState.classList.remove('hidden');
		} else {
			loadingState.classList.add('hidden');
			initializationState.classList.remove('hidden');
		}
	} catch (error) {
		console.error('Erro ao carregar:', error);
		showStatus('Erro ao carregar: ' + error.message, true);
	}
}

async function saveContent() {
	saveButton.disabled = true;
	saveButton.textContent = 'Salvando...';
	try {
		const docSnap = await getDoc(contentRef);
		let dataToSave = docSnap.exists() ? docSnap.data() : {};

		const listsToClear = [
			'homePage.screenshots.items',
			'homePage.testimonials.items',
			'homePage.flows', // Limpa para repopular
			'businessPage.infoSections',
			'businessPage.screenshots.items',
			'businessPage.testimonials.items',
			'businessPage.flows', // Limpa para repopular
		];
		listsToClear.forEach((path) => setNestedValue(dataToSave, path, []));
		if (
			dataToSave.businessPage &&
			dataToSave.businessPage.detailedFeatures
		) {
			delete dataToSave.businessPage.detailedFeatures;
		}

		document
			.querySelectorAll('#editor-state [data-path]')
			.forEach((input) => {
				setNestedValue(dataToSave, input.dataset.path, input.value);
			});

		// Garante que os passos do fluxo da home sejam salvos corretamente
		// O `setNestedValue` já deve lidar com isso, pois os paths são
		// `homePage.flows.0.steps.0.title`, etc.

		await setDoc(contentRef, dataToSave, { merge: true });
		showStatus('Conteúdo salvo com sucesso!', false);
	} catch (error) {
		console.error('Erro ao salvar:', error);
		showStatus('Erro ao salvar: ' + error.message, true);
	} finally {
		saveButton.disabled = false;
		saveButton.textContent = 'Salvar Alterações';
	}
}

async function initializeContent() {
	initializeButton.disabled = true;
	initializeButton.textContent = 'Carregando...';
	const initialContent = {
		homePage: {
			// MODIFICADO: Estrutura de 'flows' inicial corrigida
			flowsConfig: {
				title: 'Nosso Fluxo',
				subtitle:
					'Um ciclo simples para organizar seu evento sem complicações.',
			},
			flows: [
				{
					sectionTitle: 'Fluxo Principal',
					sectionSubtitle: 'O ciclo padrão para organizar sua festa.',
					steps: [
						{
							title: 'Crie o Evento',
							description:
								'Personalize sua festa com tema, data e local em minutos.',
						},
						{
							title: 'Monte a Lista',
							description:
								'Adicione presentes ou produtos que seus convidados podem comprar.',
						},
						{
							title: 'Envie Convites',
							description:
								'Dispare convites digitais por WhatsApp ou link com um clique.',
						},
						{
							title: 'Acompanhe Tudo',
							description:
								'Receba notificações de presença e presentes em tempo real.',
						},
					],
				},
			],
		},
		businessPage: {
			hero: {
				title: 'A Plataforma Completa para seu Negócio Decolar',
				subtitle:
					'Gestão de eventos, marketing automatizado e vendas integradas. Transforme a experiência do seu cliente e impulsione seus resultados com Wevity.',
				cta_button: 'Agendar uma Demonstração',
				secondary_button: 'Ver Funcionalidades',
			},
			valueProposition: {
				title: 'Transforme a Gestão, o Marketing e as Vendas do seu Negócio',
				items: [
					{
						icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
						title: 'Aumente sua Receita',
						description:
							'Monetize seus eventos com um sistema de venda de ingressos online, crie listas de presentes e ofereça cupons de desconto.',
					},
					{
						icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-4.44a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8.88a2 2 0 0 0 2-2v-8.44L12.22 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`,
						title: 'Otimize sua Gestão',
						description:
							'Centralize a criação de eventos, o controle de convidados (RSVP), a gestão de clientes (CRM) e a sincronização com seu PDV.',
					},
					{
						icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
						title: 'Fidelize seus Clientes',
						description:
							'Crie um relacionamento duradouro enviando convites exclusivos, vouchers e comunicados diretamente pelo WhatsApp.',
					},
				],
			},
			infoSections: [
				{
					title: 'Gestão de Eventos Simplificada',
					description:
						'Organize, promova e monetize eventos sem esforço. Desde a criação da página do evento até a venda de ingressos e o check-in no dia, tudo em um só lugar.',
					points: [
						'Venda de Ingressos Online com lotes',
						'Envio de Convites Digitais via WhatsApp',
						'Controle de Presença (RSVP) e Check-in',
						'Listas de Convidados personalizadas',
					],
					image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd51622?q=80&w=2070&auto=format&fit=crop',
				},
				{
					title: 'Marketing Automatizado com Inteligência Artificial',
					description:
						'Crie campanhas de marketing impactantes com a ajuda da nossa IA. Gere anúncios para redes sociais, crie cardápios digitais e envie cupons promocionais com apenas alguns cliques.',
					points: [
						'Geração de Anúncios com IA',
						'Criação de Cardápios Digitais interativos',
						'Envio de Cupons e Vouchers Promocionais',
						'Comunicação direta com clientes via WhatsApp',
					],
					image: 'https://images.unsplash.com/photo-1620712943543-2858200f745a?q=80&w=2070&auto=format&fit=crop',
				},
			],
			features: {
				title: 'Ferramentas Poderosas para o seu Sucesso',
				subtitle:
					'Centralize suas operações e ofereça uma experiência inesquecível para seus clientes.',
				items: [
					{
						icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
						title: 'Gestão Completa de Eventos',
						description:
							'Crie eventos, defina lotes de ingressos e gerencie listas de convidados.',
					},
					{
						icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
						title: 'Comunicação Direta via WhatsApp',
						description:
							'Envie convites, ingressos, cupons e vouchers diretamente para o WhatsApp dos seus clientes.',
					},
					{
						icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
						title: 'Marketing e Campanhas Digitais',
						description:
							'Crie cardápios digitais, gere anúncios com IA e envie cupons promocionais.',
					},
					{
						icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
						title: 'Gestão de Clientes (CRM)',
						description:
							'Gerencie sua base de clientes e funcionários, associe-os a filiais e acompanhe o histórico.',
					},
					{
						icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
						title: 'Listas de Presentes com IA',
						description:
							'Ofereça aos seus clientes a opção de criar listas de presentes com sugestões geradas por IA.',
					},
					{
						icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
						title: 'Sincronização com PDV',
						description:
							'Mantenha seu catálogo de produtos e preços sempre atualizado com a sincronização automática.',
					},
				],
			},
			screenshots: {
				title: 'Uma Visão Completa da Sua Operação',
				subtitle:
					'Interface moderna e intuitiva, projetada para que você gerencie seu negócio de qualquer lugar.',
				items: [
					{
						image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
						caption: 'Dashboard de Vendas em tempo real.',
					},
					{
						image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop',
						caption: 'Criação de Campanhas de Marketing com IA.',
					},
					{
						image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop',
						caption: 'Visualização de Cardápio Digital Interativo.',
					},
				],
			},
			testimonials: {
				title: 'O que nossos parceiros dizem',
				subtitle: 'Negócios que confiam no Wevity para crescer.',
				items: [
					{
						quote: 'Desde que adotamos o Wevity, a venda de ingressos para nossos shows aumentou 40%. A plataforma é intuitiva e o suporte é excelente.',
						author: 'Carlos Pereira, Dono de Casa de Shows',
					},
					{
						quote: 'A funcionalidade de gerar cardápios digitais é fantástica. Economizamos tempo e nossos clientes adoram a interatividade.',
						author: 'Juliana Martins, Gerente de Restaurante',
					},
				],
			},
			forClients: {
				tagline: 'Você é um cliente?',
				title: 'Organizando sua festa pessoal?',
				description:
					'O Wevity também é a ferramenta perfeita para aniversários, chás de bebê e qualquer celebração. Crie convites, listas de presentes e muito mais.',
				button: 'Conheça a versão para você',
			},
			cta: {
				title: 'Pronto para levar seu negócio ao próximo nível?',
				description:
					'Agende uma demonstração gratuita e descubra como o Wevity pode transformar a gestão do seu negócio.',
				button: 'Fale com um especialista',
			},
		},
	};
	try {
		await setDoc(contentRef, initialContent, { merge: true });
		showStatus('Conteúdo inicial carregado!', false);
		initializationState.classList.add('hidden');
		await loadContent();
	} catch (error) {
		console.error('Erro ao inicializar:', error);
		showStatus('Erro ao inicializar: ' + error.message, true);
		initializeButton.disabled = false;
		initializeButton.textContent = 'Tentar Novamente';
	}
}

// Sistema de Importação Universal JSON
function setupUniversalJsonImport() {
	const importBtn = document.getElementById('import-universal-json-btn');
	const clearBtn = document.getElementById('clear-universal-json-btn');
	const textarea = document.getElementById('universal-json-import');

	clearBtn.addEventListener('click', () => {
		textarea.value = '';
	});

	importBtn.addEventListener('click', () => {
		try {
			const jsonText = textarea.value.trim();
			if (!jsonText) {
				alert('❌ Por favor, cole o JSON no campo acima!');
				return;
			}

			const jsonData = JSON.parse(jsonText);
			let changesLog = [];
			let hasChanges = false;

			// Processar cada página no JSON
			Object.keys(jsonData).forEach((pageKey) => {
				const pageData = jsonData[pageKey];

				// Processar cada seção dentro da página
				Object.keys(pageData).forEach((sectionKey) => {
					const sectionData = pageData[sectionKey];

					const fullKey = `${pageKey}.${sectionKey}`;

					if (
						fullKey === 'homePage.flows' &&
						Array.isArray(sectionData)
					) {
						// Tratamento especial para o 'homePage.flows'
						createHomeFlowsEditor(
							'home-flows-editor',
							sectionData,
							'homePage.flows'
						);
						changesLog.push(
							`✅ Página Principal - Fluxos: ${sectionData.length} fluxo(s) importado(s)`
						);
						hasChanges = true;
					} else if (
						fullKey === 'businessPage.flows' &&
						Array.isArray(sectionData)
					) {
						// Tratamento para 'businessPage.flows'
						createFlowsEditor(
							'business-flows-editor',
							sectionData,
							'businessPage.flows'
						);
						changesLog.push(
							`✅ Página Empresas - Fluxos: ${sectionData.length} fluxo(s) importado(s)`
						);
						hasChanges = true;
					} else {
						// Outras seções: aplicar dados diretamente aos inputs (seção por seção)
						if (
							typeof sectionData === 'object' &&
							!Array.isArray(sectionData)
						) {
							Object.keys(sectionData).forEach((fieldKey) => {
								const dataPath = `${pageKey}.${sectionKey}.${fieldKey}`;
								const inputs = document.querySelectorAll(
									`[data-path="${dataPath}"]`
								);

								if (inputs.length > 0) {
									inputs.forEach((input) => {
										input.value = sectionData[fieldKey];
									});
									changesLog.push(
										`✅ ${dataPath}: atualizado`
									);
									hasChanges = true;
								}
							});
						}
					}
				});
			});

			if (!hasChanges) {
				alert(
					'⚠️ Nenhuma mudança foi aplicada.\n\nVerifique se o JSON contém seções válidas (ex: "homePage.flows", "businessPage.flows")'
				);
				return;
			}

			// Mostrar resumo das mudanças
			const summary = changesLog.join('\n');
			alert(
				`🎉 Importação Universal Concluída!\n\n${summary}\n\n⚠️ Lembre-se de clicar em "Salvar Alterações" para gravar no Firebase!`
			);

			// Limpar textarea
			textarea.value = '';

			// Scroll para o topo
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} catch (error) {
			alert(
				`❌ Erro ao processar JSON:\n\n${error.message}\n\nVerifique se o formato está correto e tente novamente.`
			);
			console.error('Erro na importação universal:', error);
		}
	});
}

setupUniversalJsonImport();

saveButton.addEventListener('click', saveContent);
initializeButton.addEventListener('click', initializeContent);
loadContent();
