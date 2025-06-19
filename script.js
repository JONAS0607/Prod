document.addEventListener('DOMContentLoaded', () => {
    // Referências de Elementos do DOM
    const tableBody = document.getElementById('table-body');
    const addActivityColumnBtn = document.getElementById('add-activity-column-btn');
    const savePdfBtn = document.getElementById('sidebar-save-pdf-btn');
    const importCsvBtn = document.getElementById('sidebar-import-csv-btn');
    const exportCsvBtn = document.getElementById('sidebar-export-csv-btn');
    const csvFileInput = document.getElementById('csv-file-input');
    const copyCsvBtn = document.getElementById('copy-csv-btn');
    const saveDailySummaryBtn = document.getElementById('save-daily-summary-btn');
    
    const planSection = document.getElementById('plan-section');
    const tipsSection = document.getElementById('tips-section');
    const statsSection = document.getElementById('stats-section');
    const quickAddManageSection = document.getElementById('quick-add-manage-section');

    const showPlanBtn = document.getElementById('sidebar-show-plan-btn');
    const showTipsBtn = document.getElementById('sidebar-show-tips-btn');
    const showStatsBtn = document.getElementById('sidebar-show-stats-btn');
    const showQuickAddManageBtn = document.getElementById('sidebar-show-quick-add-manage-btn');

    const dailyTipEl = document.getElementById('daily-tip');
    const newTipInput = document.getElementById('new-tip-input');
    const addTipBtn = document.getElementById('add-tip-btn');
    const tipsListEl = document.getElementById('tips-list');
    
    const alarmModal = document.getElementById('alarm-modal');
    const closeAlarmBtn = document.getElementById('close-alarm-btn');

    const activeActivityModal = document.getElementById('active-activity-modal');
    const closeActiveActivityModalBtn = document.getElementById('close-active-activity-modal-btn');
    const modalActivityDescription = document.getElementById('modal-activity-description');
    const modalActivityProductivity = document.getElementById('modal-activity-productivity');
    const modalActivityLever = document.getElementById('modal-activity-lever');
    const modalRecordedTimeHHMMSS = document.getElementById('modal-recorded-time-hhmmss');
    const modalRecordedTimeFriendly = document.getElementById('modal-recorded-time-friendly');
    const modalPlannedTime = document.getElementById('modal-planned-time');
    const modalPauseBtn = document.getElementById('modal-pause-btn');
    const modalResetBtn = document.getElementById('modal-reset-btn');
    const modalContentWrapper = document.getElementById('modal-content-wrapper');

    const pomodoroTimerEl = document.getElementById('pomodoro-timer');
    const pomodoroStartBtn = document.getElementById('pomodoro-start-btn');
    const pomodoroPauseBtn = document.getElementById('pomodoro-pause-btn');
    const pomodoroResetBtn = document.getElementById('pomodoro-reset-btn');

    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationMessage = document.getElementById('confirmation-message');
    const confirmYesBtn = document.getElementById('confirm-yes-btn');
    const confirmNoBtn = document.getElementById('confirm-no-btn');
    let confirmationCallback = null;

    const currentDateEl = document.getElementById('current-date');
    const selectAllActivitiesCheckbox = document.getElementById('select-all-activities');

    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('open-sidebar-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    const templateNameInput = document.getElementById('template-name-input');
    const saveTemplateBtn = document.getElementById('save-template-btn');
    const loadTemplateSelect = document.getElementById('load-template-select');
    const loadTemplateBtn = document.getElementById('load-template-btn');

    const quickAddButtonsContainer = document.getElementById('quick-add-buttons');
    const fixedActionBar = document.getElementById('fixed-action-bar');
    const actionStartBtn = document.getElementById('action-start-btn');
    const actionPauseBtn = document.getElementById('action-pause-btn');
    const actionDeleteBtn = document.getElementById('action-delete-btn');
    const currentTimeDisplay = document.getElementById('current-time-display');

    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');

    // Custom Quick Add Elements (for management page)
    const newCustomQuickAddDescription = document.getElementById('new-custom-quick-add-description');
    const newCustomQuickAddDuration = document.getElementById('new-custom-quick-add-duration');
    const newCustomQuickAddProductivity = document.getElementById('new-custom-quick-add-productivity');
    const newCustomQuickAddLever = document.getElementById('new-custom-quick-add-lever');
    const addCustomQuickActivityBtn = document.getElementById('add-custom-quick-activity-btn');
    const customQuickAddList = document.getElementById('custom-quick-add-list');

    // LLM related elements
    const generateSummaryBtn = document.getElementById('generate-summary-btn');
    const smartSummaryModal = document.getElementById('smart-summary-modal');
    const closeSmartSummaryModalBtn = document.getElementById('close-smart-summary-modal-btn');
    const smartSummaryContent = document.getElementById('smart-summary-content');
    const smartSummaryLoading = document.getElementById('smart-summary-loading');
    const copySummaryBtn = document.getElementById('copy-summary-btn');

    // Activity Cards Container for mobile view
    const activityCardsContainer = document.getElementById('activity-cards-container');


    // Estado da Aplicação
    let activities = [];
    let tips = [];
    let templates = {};
    let historicalData = {};
    let allQuickActivities = []; 
    let activeTimerInterval = null;
    let activeTimerId = null;
    let activeTimerStartTimestamp = null;
    let chartInstance = null;
    let pomodoroInterval = null;
    let pomodoroTimeLeft = 25 * 60;
    const DEFAULT_POMODORO_DURATION = 25 * 60;

    const productivityLevels = { green: 'Verde', yellow: 'Amarelo', red: 'Vermelho' };
    const levers = {
        health: 'Saúde e Bem-Estar',
        professional: 'Desenvolvimento Profissional',
        personal: 'Desenvolvimento Pessoal',
        relationships: 'Relacionamentos',
        finance: 'Finanças',
        other: 'Outros'
    };

    const initialPredefinedQuickActivities = [
        { description: 'Almoço', duration: 60, productivity: 'yellow', lever: 'health' },
        { description: 'Pausa Curta', duration: 15, productivity: 'yellow', lever: 'health' },
        { description: 'Ver E-mails', duration: 30, productivity: 'yellow', lever: 'professional' },
        { description: 'Exercício', duration: 45, productivity: 'green', lever: 'health' },
        { description: 'Estudar Novo Tópico', duration: 60, productivity: 'green', lever: 'personal' },
    ];
    
    // --- Funções Principais ---

    const loadData = () => {
        const savedActivities = localStorage.getItem('productivityPlanActivities');
        const savedTips = localStorage.getItem('productivityPlanTips');
        const savedTemplates = localStorage.getItem('productivityPlanTemplates');
        const savedHistoricalData = localStorage.getItem('productivityPlanHistory');
        const savedAllQuickActivities = localStorage.getItem('productivityAllQuickActivities');
        const savedActiveTimerId = localStorage.getItem('activeTimerId');
        const savedActiveTimerStartTimestamp = localStorage.getItem('activeTimerStartTimestamp');


        activities = savedActivities ? JSON.parse(savedActivities) : [
            { id: 1, startTime: '08:00', description: 'Trabalho Focado (Projeto A)', duration: 50, recordedTime: 0, productivity: 'green', lever: 'professional', alarmTriggered: false, selected: false },
            { id: 2, startTime: '08:50', description: 'Pausa para café', duration: 10, recordedTime: 0, productivity: 'yellow', lever: 'health', alarmTriggered: false, selected: false },
            { id: 3, startTime: '09:00', description: 'Reunião de equipe', duration: 60, recordedTime: 0, productivity: 'green', lever: 'professional', alarmTriggered: false, selected: false },
        ];
        tips = savedTips ? JSON.parse(savedTips) : [
            "A disciplina é a ponte entre metas e realizações.",
            "Feito é melhor que perfeito.",
            "Comece onde você está. Use o que você tem. Faça o que você pode."
        ];
        templates = savedTemplates ? JSON.parse(savedTemplates) : {};
        historicalData = savedHistoricalData ? JSON.parse(savedHistoricalData) : {};
        allQuickActivities = savedAllQuickActivities ? JSON.parse(savedAllQuickActivities) : initialPredefinedQuickActivities;
        activeTimerId = savedActiveTimerId ? Number(savedActiveTimerId) : null;
        activeTimerStartTimestamp = savedActiveTimerStartTimestamp ? Number(savedActiveTimerStartTimestamp) : null;


        displayCurrentDate();
        displayDailyTip();
        renderTemplates();
        renderQuickAddButtons();
        renderCustomQuickAddList();
        populateQuickAddDropdowns();
        render();

        if (activeTimerId && activeTimerStartTimestamp) {
            const activity = activities.find(act => act.id === activeTimerId);
            if (activity) {
                const elapsedSeconds = Math.floor((Date.now() - activeTimerStartTimestamp) / 1000);
                activity.recordedTime += elapsedSeconds;
                startTimer(activeTimerId, false);
            } else {
                activeTimerId = null;
                activeTimerStartTimestamp = null;
                localStorage.removeItem('activeTimerId');
                localStorage.removeItem('activeTimerStartTimestamp');
            }
        }
    };

    const saveData = () => {
        localStorage.setItem('productivityPlanActivities', JSON.stringify(activities));
        localStorage.setItem('productivityPlanTips', JSON.stringify(tips));
        localStorage.setItem('productivityPlanTemplates', JSON.stringify(templates));
        localStorage.setItem('productivityPlanHistory', JSON.stringify(historicalData));
        localStorage.setItem('productivityAllQuickActivities', JSON.stringify(allQuickActivities));
        localStorage.setItem('activeTimerId', activeTimerId);
        localStorage.setItem('activeTimerStartTimestamp', activeTimerStartTimestamp);
    };

    const render = () => {
        if (window.innerWidth <= 640) {
            renderActivityCards();
            document.getElementById('productivity-table').style.display = 'none';
            activityCardsContainer.style.display = 'flex';
        } else {
            renderTable();
            document.getElementById('productivity-table').style.display = 'table';
            activityCardsContainer.style.display = 'none';
        }
        updateSummaries();
        renderTips();
        updateFixedActionBarVisibility();
    };

    const renderActivityCards = () => {
        activityCardsContainer.innerHTML = '';
        activities.forEach((activity, index) => {
            const card = document.createElement('div');
            let cardClasses = ['activity-card'];
            
            if (activity.productivity === 'green') {
                cardClasses.push('productivity-green-row');
            } else if (activity.productivity === 'yellow') {
                cardClasses.push('productivity-yellow-row');
            } else if (activity.productivity === 'red') {
                cardClasses.push('productivity-red-row');
            }

            if (activeTimerId === activity.id) {
                cardClasses.push('activity-active-row');
            }

            card.className = cardClasses.join(' ');
            card.dataset.id = activity.id;
            card.draggable = true;

            const startTimeForRender = index === 0 ? activity.startTime : calculateEndTime(activities[index-1].startTime, activities[index-1].duration);
            activity.startTime = startTimeForRender;
            const endTime = calculateEndTime(startTimeForRender, activity.duration);

            const timeExceededClass = activity.recordedTime > (activity.duration * 60) ? 'time-exceeded' : '';
            const alarmClass = activity.alarmTriggered ? 'alarm-visual' : '';

            card.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <input type="checkbox" class="activity-checkbox rounded text-blue-600 focus:ring-blue-500" ${activity.selected ? 'checked' : ''}>
                    <span class="text-xs text-gray-500">${startTimeForRender} - ${endTime}</span>
                </div>
                <input type="text" value="${activity.description}" class="text-lg font-semibold bg-transparent border-b focus:border-blue-500 pb-1" data-field="description">
                <div class="flex items-center justify-between mt-2 text-sm">
                    <label class="block text-gray-700">Duração:</label>
                    <input type="text" value="${minutesToHHMM(activity.duration)}" placeholder="HH:MM ou minutos" class="flex-grow ml-2 bg-transparent border-b focus:border-blue-500 text-right" data-field="duration-flexible">
                    <span class="ml-1 text-gray-600">(${activity.duration} min)</span>
                </div>
                <div class="flex items-center justify-between mt-2 text-sm">
                    <label class="block text-gray-700">Registrado:</label>
                    <span class="font-mono ${alarmClass} ${timeExceededClass} ml-2">${formatTime(activity.recordedTime)}</span>
                </div>
                <div class="flex items-center justify-between mt-2 text-sm">
                    <label class="block text-gray-700">Produtividade:</label>
                    <select class="ml-2 bg-transparent border-b focus:border-blue-500 flex-grow text-right" data-field="productivity">
                        ${Object.entries(productivityLevels).map(([key, value]) => `<option value="${key}" ${activity.productivity === key ? 'selected' : ''}>${value}</option>`).join('')}
                    </select>
                </div>
                <div class="flex items-center justify-between mt-2 text-sm">
                    <label class="block text-gray-700">Alavancador:</label>
                    <select class="ml-2 bg-transparent border-b focus:border-blue-500 flex-grow text-right" data-field="lever">
                        ${Object.entries(levers).map(([key, value]) => `<option value="${key}" ${activity.lever === key ? 'selected' : ''}>${value}</option>`).join('')}
                    </select>
                </div>
                <div class="flex justify-center mt-4">
                    <span class="text-gray-400 cursor-grab drag-handle">⋮</span>
                </div>
            `;
            activityCardsContainer.appendChild(card);
        });
        updateSelectAllCheckbox();
    };


    const renderTable = () => {
        tableBody.innerHTML = '';
        let lastEndTime = '00:00';
        const currentTime = new Date();
        const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

        activities.forEach((activity, index) => {
            const row = document.createElement('tr');
            let rowClasses = ['bg-white', 'border-b', 'hover:bg-gray-50'];
            
            if (activity.productivity === 'green') {
                rowClasses.push('productivity-green-row');
            } else if (activity.productivity === 'yellow') {
                rowClasses.push('productivity-yellow-row');
            } else if (activity.productivity === 'red') {
                rowClasses.push('productivity-red-row');
            }

            if (activeTimerId === activity.id) {
                rowClasses.push('activity-active-row');
            }

            row.className = rowClasses.join(' ');

            row.dataset.id = activity.id;
            row.draggable = true;

            const startTimeForRender = index === 0 ? activity.startTime : lastEndTime;
            activity.startTime = startTimeForRender;
            const endTime = calculateEndTime(startTimeForRender, activity.duration);
            lastEndTime = endTime;

            const plannedStartMinutes = timeToMinutes(activity.startTime);
            const plannedEndMinutes = timeToMinutes(endTime);

            const isPending = nowMinutes > plannedEndMinutes && activity.recordedTime === 0;
            if (isPending) {
                row.classList.add('activity-pending');
            }

            const timeExceededClass = activity.recordedTime > (activity.duration * 60) ? 'time-exceeded' : '';
            const alarmClass = activity.alarmTriggered ? 'alarm-visual' : '';

            row.innerHTML = `
                <td class="px-2 py-2"><input type="checkbox" class="activity-checkbox rounded text-blue-600 focus:ring-blue-500" ${activity.selected ? 'checked' : ''}></td>
                <td class="px-2 py-2 cursor-grab text-gray-400 drag-handle">⋮</td>
                <td class="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                    <input type="time" value="${activity.startTime}" class="w-24 bg-transparent focus:bg-white p-1 rounded border-transparent focus:border-gray-300" data-field="startTime">
                    - ${endTime}
                </td>
                <td class="px-6 py-2"><input type="text" value="${activity.description}" class="w-full bg-transparent focus:bg-white p-1 rounded border-transparent focus:border-gray-300" data-field="description"></td>
                <td class="px-4 py-2 flex items-center gap-1">
                    <input type="text" value="${minutesToHHMM(activity.duration)}" placeholder="HH:MM ou minutos" class="w-28 bg-transparent focus:bg-white p-1 rounded border-transparent focus:border-gray-300" data-field="duration-flexible">
                    <span>(${activity.duration} min)</span>
                </td>
                <td class="px-4 py-2 font-mono ${alarmClass} ${timeExceededClass}">${formatTime(activity.recordedTime)}</td>
                <td class="px-4 py-2"><select class="w-full bg-transparent p-1 rounded border-transparent focus:border-gray-300" data-field="productivity">${Object.entries(productivityLevels).map(([key, value]) => `<option value="${key}" ${activity.productivity === key ? 'selected' : ''}>${value}</option>`).join('')}</select></td>
                <td class="px-4 py-2"><select class="w-full bg-transparent p-1 rounded border-transparent focus:border-gray-300" data-field="lever">${Object.entries(levers).map(([key, value]) => `<option value="${key}" ${activity.lever === key ? 'selected' : ''}>${value}</option>`).join('')}</select></td>
                <td class="px-4 py-2 text-center">
                    <!-- Removed start-activity-btn and add-subtask-btn from here -->
                </td>`;
            tableBody.appendChild(row);
        });
        updateSelectAllCheckbox();
    };
    
    const renderTips = () => {
        tipsListEl.innerHTML = '';
        tips.forEach((tip, index) => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center';
            li.innerHTML = `<span>${tip}</span><button data-index="${index}" class="remove-tip-btn text-red-500 hover:text-red-700 p-1">Remover</button>`;
            tipsListEl.appendChild(li);
        });
    };
    
    const displayDailyTip = () => {
        const today = new Date().toDateString();
        const lastTipDate = localStorage.getItem('dailyTipDate');
        let tipIndex = localStorage.getItem('dailyTipIndex');

        if (today !== lastTipDate || tipIndex === null || tipIndex >= tips.length) {
            tipIndex = Math.floor(Math.random() * tips.length);
            localStorage.setItem('dailyTipDate', today);
            localStorage.setItem('dailyTipIndex', tipIndex);
        }

        dailyTipEl.textContent = tips.length > 0 ? tips[tipIndex] : "Adicione suas próprias dicas!";
    };

    const displayCurrentDate = () => {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateEl.textContent = today.toLocaleDateString('pt-BR', options);
    };

    const updateSummaries = () => {
        const todayDate = new Date().toISOString().split('T')[0];
        const productivityTotals = { green: 0, yellow: 0, red: 0 };
        const leverTotals = Object.keys(levers).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

        activities.forEach(activity => {
            productivityTotals[activity.productivity] += activity.recordedTime;
            leverTotals[activity.lever] += activity.recordedTime;
        });

        document.getElementById('summary-green').textContent = formatTime(productivityTotals.green);
        document.getElementById('summary-yellow').textContent = formatTime(productivityTotals.yellow);
        document.getElementById('summary-red').textContent = formatTime(productivityTotals.red);

        const leverSummaryEl = document.getElementById('lever-summary');
        leverSummaryEl.innerHTML = '';
        Object.entries(leverTotals).forEach(([key, totalTime]) => {
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center';
            div.innerHTML = `<span>${levers[key]}</span><span class="font-bold">${formatTime(totalTime)}</span>`;
            leverSummaryEl.appendChild(div);
        });

        if (!historicalData[todayDate]) {
            historicalData[todayDate] = {};
        }
        Object.keys(levers).forEach(leverKey => {
            historicalData[todayDate][leverKey] = leverTotals[leverKey];
        });

        saveData();
    };

    const showMessage = (type, message) => {
        messageBox.classList.remove('hidden', 'success', 'warning', 'error');
        messageBox.classList.add(type);
        messageText.textContent = message;
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 5000);
    };

    const showConfirmation = (message, callback) => {
        confirmationMessage.textContent = message;
        confirmationModal.classList.remove('hidden');
        confirmationModal.classList.add('flex');
        confirmationCallback = callback;
    };

    // --- Funções de Manipulação de Eventos ---
    const handleAddActivity = () => {
        const lastActivity = activities[activities.length - 1];
        const newStartTime = lastActivity ? calculateEndTime(lastActivity.startTime, lastActivity.duration) : '09:00';
        activities.push({ id: Date.now(), startTime: newStartTime, description: 'Nova Atividade', duration: 30, recordedTime: 0, productivity: 'yellow', lever: 'other', alarmTriggered: false, selected: false });
        render();
        saveData();
        showMessage('success', 'Atividade adicionada!');
    };

    const handleTableClick = (e) => {
        const row = e.target.closest('tr') || e.target.closest('.activity-card');
        if (!row) return;
        const id = Number(row.dataset.id);
        const activityIndex = activities.findIndex(act => act.id === id);
        if (activityIndex === -1) return;

        if (e.target.classList.contains('activity-checkbox')) {
            activities[activityIndex].selected = e.target.checked;
            updateSelectAllCheckbox();
            updateFixedActionBarVisibility();
            saveData();
        } 
    };
    
    const handleTableChange = (e) => {
        const row = e.target.closest('tr') || e.target.closest('.activity-card');
        if (!row) return;
        const id = Number(row.dataset.id);
        const activityIndex = activities.findIndex(act => act.id === id);
        if (activityIndex === -1) return;

        const activity = activities[activityIndex];
        const field = e.target.dataset.field;
        let value = e.target.value;

        if (field === 'duration-flexible') {
            let parsedDuration = 0;
            if (value.includes(':')) {
                const [hours, minutes] = value.split(':').map(Number);
                parsedDuration = hours * 60 + minutes;
            } else {
                parsedDuration = parseInt(value, 10) || 0;
            }
            if (parsedDuration < 0) {
                showMessage('warning', 'A duração não pode ser negativa.');
                e.target.value = minutesToHHMM(activity.duration);
                return;
            }
            activity.duration = parsedDuration;
            recalculateActivityTimes(activityIndex);
        } else if (field === 'startTime') {
            if (activityIndex > 0) {
                const prevActivity = activities[activityIndex - 1];
                const prevEndTime = calculateEndTime(prevActivity.startTime, prevActivity.duration);
                if (timeToMinutes(value) < timeToMinutes(prevEndTime)) {
                     showMessage('warning', 'A hora de início não pode ser anterior à hora de término da atividade anterior.');
                     e.target.value = activity.startTime;
                     return;
                }
            }
            activity.startTime = value;
            recalculateActivityTimes(activityIndex);
        } else if (field === 'productivity') {
            activity[field] = value;
        } else {
            activity[field] = value;
        }
        saveData();
        render();
    };

    const recalculateActivityTimes = (startIndex) => {
        for (let i = startIndex; i < activities.length; i++) {
            const currentActivity = activities[i];
            if (i > 0) {
                const prevActivity = activities[i - 1];
                currentActivity.startTime = calculateEndTime(prevActivity.startTime, prevActivity.duration);
            }
        }
    };
    
    const handleCsvImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const csvContent = event.target.result;
            
            const reverseProductivity = Object.fromEntries(Object.entries(productivityLevels).map(([k, v]) => [v.trim(), k]));
            const reverseLevers = Object.fromEntries(Object.entries(levers).map(([k, v]) => [v.trim(), k]));
            
            const lines = csvContent.split(/\r?\n/).slice(1);

            lines.forEach(line => {
                if (line.trim() === '') return;
                const [description, duration, productivityStr, leverStr] = line.split(',');

                if (!description || !duration) return;

                const newActivity = {
                    id: Date.now() + Math.random(),
                    startTime: '00:00',
                    description: description.trim(),
                    duration: parseInt(duration.trim(), 10) || 30,
                    recordedTime: 0,
                    productivity: reverseProductivity[productivityStr.trim()] || 'yellow',
                    lever: reverseLevers[leverStr.trim()] || 'other',
                    alarmTriggered: false,
                    selected: false
                };
                activities.push(newActivity);
            });
            recalculateActivityTimes(0);
            render();
            saveData();
            showMessage('success', 'Plano importado com sucesso!');
        };

        reader.readAsText(file);
        e.target.value = null;
    };

    const handleCsvExport = () => {
        const header = "Descricao,Duracao,Produtividade,Alavancador\n";
        const rows = activities.map(activity => 
            `${activity.description},${activity.duration},${productivityLevels[activity.productivity]},${levers[activity.lever]}`
        ).join('\n');
        const csvContent = header + rows;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'plano-produtividade.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showMessage('success', 'Plano exportado para CSV!');
    };
    
     const handleCopyCsv = () => {
        const codeToCopy = document.getElementById('csv-example-code').innerText;
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = codeToCopy;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        copyCsvBtn.textContent = 'Copiado!';
        setTimeout(() => {
            copyCsvBtn.textContent = 'Copiar';
        }, 2000);
    };

    const handleSaveDailySummary = () => {
        updateSummaries();
        showMessage('success', 'Resumo diário salvo no histórico!');
    };

    // --- Lógica do Timer ---
    const startTimer = (id, showMessageFlag = true) => {
        if (activeTimerInterval) {
            clearInterval(activeTimerInterval);
            const prevActivity = activities.find(act => act.id === activeTimerId);
            if (prevActivity) {
                prevActivity.alarmTriggered = false;
            }
        }
        activeTimerId = id;
        activeTimerStartTimestamp = Date.now();
        
        const activity = activities.find(act => act.id === activeTimerId);
        if (activity && showMessageFlag) {
            showMessage('success', `Atividade "${activity.description}" iniciada.`);
        }
        
        activeTimerInterval = setInterval(() => {
            const currentActivity = activities.find(act => act.id === activeTimerId);
            if (currentActivity) {
                currentActivity.recordedTime = Math.floor((Date.now() - activeTimerStartTimestamp) / 1000);
                
                if (currentActivity.recordedTime >= currentActivity.duration * 60 && !currentActivity.alarmTriggered) {
                    currentActivity.alarmTriggered = true;
                    document.getElementById('alarm-message').textContent = `O tempo planejado para "${currentActivity.description}" terminou!`;
                    alarmModal.classList.remove('hidden');
                    alarmModal.classList.add('flex');
                    render(); // Re-render para mostrar visual do alarme
                }
                
                // Update UI for main table/cards
                if (window.innerWidth <= 640) { // Mobile (cards)
                    const card = document.querySelector(`.activity-card[data-id='${activeTimerId}']`);
                    if (card) {
                        const recordedTimeSpan = card.querySelector('span.font-mono');
                        if (recordedTimeSpan) {
                            recordedTimeSpan.textContent = formatTime(currentActivity.recordedTime);
                            if (currentActivity.recordedTime > (currentActivity.duration * 60)) {
                                recordedTimeSpan.classList.add('time-exceeded');
                            } else {
                                recordedTimeSpan.classList.remove('time-exceeded');
                            }
                        }
                    }
                } else { // Desktop (table)
                    const timerCell = document.querySelector(`tr[data-id='${activeTimerId}'] td:nth-child(6)`);
                    if (timerCell) {
                        timerCell.textContent = formatTime(currentActivity.recordedTime);
                        if (currentActivity.recordedTime > (currentActivity.duration * 60)) {
                            timerCell.classList.add('time-exceeded');
                        } else {
                            timerCell.classList.remove('time-exceeded');
                        }
                    }
                }

                // Update UI for active activity modal
                if (!activeActivityModal.classList.contains('hidden') && currentActivity.id === activeTimerId) {
                    modalRecordedTimeHHMMSS.textContent = formatTime(currentActivity.recordedTime);
                    modalRecordedTimeFriendly.textContent = formatSecondsToFriendly(currentActivity.recordedTime);
                }
                updateSummaries();
                saveData();
            } else {
                pauseTimer();
            }
        }, 1000);
        render();
    };

    const pauseTimer = () => {
        if (activeTimerInterval) {
            clearInterval(activeTimerInterval);
            activeTimerInterval = null;
            const activity = activities.find(act => act.id === activeTimerId);
            if (activity) {
                showMessage('warning', `Atividade "${activity.description}" pausada.`);
            }
            activeTimerId = null;
            activeTimerStartTimestamp = null;
            saveData();
        }
        render();
    };

    const resetTimer = (id) => {
        const activity = activities.find(act => act.id === id);
        if (activity) {
            activity.recordedTime = 0;
            activity.alarmTriggered = false;
            if (activeTimerId === id) pauseTimer();
            render();
            updateSummaries();
            saveData();
            showMessage('info', `Tempo da atividade "${activity.description}" zerado.`);
        }
    };
    
    // --- Pomodoro Timer Lógica ---
    const startPomodoro = () => {
        if (pomodoroInterval) clearInterval(pomodoroInterval);
        showMessage('info', 'Pomodoro iniciado!');
        pomodoroInterval = setInterval(() => {
            pomodoroTimeLeft--;
            pomodoroTimerEl.textContent = formatTime(pomodoroTimeLeft);
            if (pomodoroTimeLeft <= 0) {
                clearInterval(pomodoroInterval);
                pomodoroInterval = null;
                showMessage('success', 'Pomodoro concluído! Hora de uma pausa!');
                pomodoroTimerEl.textContent = "00:00";
            }
        }, 1000);
    };

    const pausePomodoro = () => {
        if (pomodoroInterval) {
            clearInterval(pomodoroInterval);
            pomodoroInterval = null;
            showMessage('warning', 'Pomodoro pausado.');
        }
    };

    const resetPomodoro = () => {
        if (pomodoroInterval) clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        pomodoroTimeLeft = DEFAULT_POMODORO_DURATION;
        pomodoroTimerEl.textContent = formatTime(pomodoroTimeLeft);
        showMessage('info', 'Pomodoro reiniciado.');
    };

    // --- Navegação e Dicas ---
    const switchView = (view) => {
        const sections = { plan: planSection, tips: tipsSection, stats: statsSection, quickAddManage: quickAddManageSection };
        const buttons = { 
            plan: [showPlanBtn, sidebar.querySelector('#sidebar-show-plan-btn')], 
            tips: [showTipsBtn, sidebar.querySelector('#sidebar-show-tips-btn')], 
            stats: [showStatsBtn, sidebar.querySelector('#sidebar-show-stats-btn')],
            quickAddManage: [showQuickAddManageBtn, sidebar.querySelector('#sidebar-show-quick-add-manage-btn')]
        };

        Object.values(sections).forEach(section => section.classList.add('hidden'));
        Object.values(buttons).forEach(buttonArray => {
            buttonArray.forEach(button => {
                if (button) button.classList.replace('nav-btn-active', 'nav-btn-inactive');
            });
        });
        
        sections[view].classList.remove('hidden');
        buttons[view].forEach(button => {
            if (button) button.classList.replace('nav-btn-inactive', 'nav-btn-active');
        });

        if (view === 'stats') renderChart();
        if (view === 'quickAddManage') renderCustomQuickAddList();
        closeSidebar();
    };
    
    const handleAddTip = () => {
        const newTip = newTipInput.value.trim();
        if (newTip) {
            tips.push(newTip);
            newTipInput.value = '';
            renderTips();
            saveData();
            showMessage('success', 'Dica adicionada!');
        }
    };

    const openSidebar = () => {
        sidebar.classList.add('open');
        sidebarOverlay.classList.remove('hidden');
    };

    const closeSidebar = () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.add('hidden');
    };

    // --- Gerenciamento de Templates ---
    const saveTemplate = () => {
        const templateName = templateNameInput.value.trim();
        if (!templateName) {
            showMessage('error', 'Por favor, digite um nome para o template.');
            return;
        }
        templates[templateName] = JSON.parse(JSON.stringify(activities));
        saveData();
        renderTemplates();
        templateNameInput.value = '';
        showMessage('success', `Template "${templateName}" salvo com sucesso!`);
    };

    const loadTemplate = () => {
        const templateName = loadTemplateSelect.value;
        if (!templateName) {
            showMessage('warning', 'Selecione um template para carregar.');
            return;
        }
        showConfirmation(`Carregar o template "${templateName}" irá substituir o plano atual. Deseja continuar?`, (confirmed) => {
            if (confirmed) {
                activities = JSON.parse(JSON.stringify(templates[templateName]));
                activities.forEach(activity => {
                    activity.recordedTime = 0;
                    activity.alarmTriggered = false;
                    activity.selected = false;
                });
                if (activeTimerInterval) pauseTimer();
                render();
                saveData();
                showMessage('success', `Template "${templateName}" carregado com sucesso!`);
            }
            confirmationModal.classList.add('hidden');
        });
    };

    const renderTemplates = () => {
        loadTemplateSelect.innerHTML = '<option value="">Selecione um template</option>';
        for (const name in templates) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            loadTemplateSelect.appendChild(option);
        }
    };

    // --- Quick Add Buttons (Main Section) ---
    const renderQuickAddButtons = () => {
        quickAddButtonsContainer.innerHTML = '';
        allQuickActivities.forEach(qa => {
            const button = document.createElement('button');
            button.className = 'px-4 py-2 bg-blue-100 text-blue-800 font-medium rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400';
            button.textContent = qa.description;
            button.addEventListener('click', () => {
                addActivityFromQuickAdd(qa);
            });
            quickAddButtonsContainer.appendChild(button);
        });
    };

    const addActivityFromQuickAdd = (qa) => {
        const lastActivity = activities[activities.length - 1];
        const newStartTime = lastActivity ? calculateEndTime(lastActivity.startTime, lastActivity.duration) : '09:00';
        activities.push({
            id: Date.now() + Math.random(),
            startTime: newStartTime,
            description: qa.description,
            duration: qa.duration,
            recordedTime: 0,
            productivity: qa.productivity,
            lever: qa.lever,
            alarmTriggered: false,
            selected: false
        });
        render();
        saveData();
        showMessage('success', `Atividade rápida "${qa.description}" adicionada.`);
    };

    // --- Populate Quick Add Dropdowns (Management Section) ---
    const populateQuickAddDropdowns = () => {
        const productivitySelect = document.getElementById('new-custom-quick-add-productivity');
        const leverSelect = document.getElementById('new-custom-quick-add-lever');

        productivitySelect.innerHTML = '<option value="">Produtividade</option>';
        leverSelect.innerHTML = '<option value="">Alavancador</option>';

        for (const key in productivityLevels) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = productivityLevels[key];
            productivitySelect.appendChild(option);
        }

        for (const key in levers) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = levers[key];
            leverSelect.appendChild(option);
        }
    };


    const handleAddCustomQuickActivity = () => {
        const description = newCustomQuickAddDescription.value.trim();
        const durationInput = newCustomQuickAddDuration.value.trim();
        const productivity = newCustomQuickAddProductivity.value;
        const lever = newCustomQuickAddLever.value;

        if (!description || !durationInput || !productivity || !lever) {
            showMessage('error', 'Por favor, preencha todos os campos para a nova atividade rápida.');
            return;
        }

        let parsedDuration = 0;
        if (durationInput.includes(':')) {
            const [hours, minutes] = durationInput.split(':').map(Number);
            parsedDuration = hours * 60 + minutes;
        } else {
            parsedDuration = parseInt(durationInput, 10);
        }

        if (isNaN(parsedDuration) || parsedDuration <= 0) {
            showMessage('error', 'Por favor, insira uma duração válida (minutos ou HH:MM).');
            return;
        }

        const newCustomQa = {
            description,
            duration: parsedDuration,
            productivity,
            lever
        };
        allQuickActivities.push(newCustomQa);
        saveData();
        renderQuickAddButtons();
        renderCustomQuickAddList();
        newCustomQuickAddDescription.value = '';
        newCustomQuickAddDuration.value = '';
        newCustomQuickAddProductivity.value = '';
        newCustomQuickAddLever.value = '';
        showMessage('success', `Atividade rápida personalizada "${description}" adicionada.`);
    };

    const renderCustomQuickAddList = () => {
        customQuickAddList.innerHTML = '';
        if (allQuickActivities.length === 0) {
            customQuickAddList.innerHTML = '<p class="text-gray-600 text-sm">Nenhuma atividade rápida adicionada ainda.</p>';
            return;
        }
        allQuickActivities.forEach((qa, index) => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between bg-gray-50 p-2 rounded-md shadow-sm text-gray-700';
            div.innerHTML = `
                <span>${qa.description} (${qa.duration}min) - ${productivityLevels[qa.productivity]} / ${levers[qa.lever]}</span>
                <button data-index="${index}" class="remove-all-quick-add-btn text-red-500 hover:text-red-700 p-1" title="Remover Atividade Rápida">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            `;
            customQuickAddList.appendChild(div);
        });
    };

    const handleRemoveAllQuickAdd = (index) => {
        allQuickActivities.splice(index, 1);
        saveData();
        renderQuickAddButtons();
        renderCustomQuickAddList();
        showMessage('info', 'Atividade rápida removida.');
    };


    // --- Active Activity Modal Functions ---
    const openActiveActivityModal = (activity) => {
        modalActivityDescription.textContent = activity.description;
        modalActivityProductivity.textContent = productivityLevels[activity.productivity];
        modalActivityLever.textContent = levers[activity.lever];
        modalRecordedTimeHHMMSS.textContent = formatTime(activity.recordedTime);
        modalRecordedTimeFriendly.textContent = formatSecondsToFriendly(activity.recordedTime);
        modalPlannedTime.textContent = minutesToHHMM(activity.duration);

        modalContentWrapper.classList.remove('productivity-green-card', 'productivity-yellow-card', 'productivity-red-card');
        if (activity.productivity === 'green') {
            modalContentWrapper.classList.add('productivity-green-card');
        } else if (activity.productivity === 'yellow') {
            modalContentWrapper.classList.add('productivity-yellow-card');
        } else if (activity.productivity === 'red') {
            modalContentWrapper.classList.add('productivity-red-card');
        }

        modalPauseBtn.onclick = () => pauseTimer();
        modalResetBtn.onclick = () => resetTimer(activity.id);

        activeActivityModal.classList.remove('hidden');
        activeActivityModal.classList.add('flex');
    };

    const closeActiveActivityModal = () => {
        activeActivityModal.classList.add('hidden');
    };

    // --- Fixed Action Bar Logic ---
    const getSelectedActivities = () => activities.filter(act => act.selected);

    const updateFixedActionBarVisibility = () => {
        const selected = getSelectedActivities();
        if (selected.length > 0) {
            fixedActionBar.classList.remove('hidden');
        } else {
            fixedActionBar.classList.add('hidden');
        }
    };

    const handleFixedActionStart = () => {
        const selected = getSelectedActivities();
        if (selected.length !== 1) {
            showMessage('warning', 'Selecione apenas UMA atividade para iniciar.');
            return;
        }
        startTimer(selected[0].id);
        openActiveActivityModal(selected[0]);
    };

    const handleFixedActionPause = () => {
        pauseTimer();
    };

    const handleFixedActionDelete = () => {
        const selected = getSelectedActivities();
        if (selected.length === 0) {
            showMessage('warning', 'Selecione atividades para excluir.');
            return;
        }
        showConfirmation(`Tem certeza que deseja excluir ${selected.length} atividade(s)?`, (confirmed) => {
            if (confirmed) {
                activities = activities.filter(act => !act.selected);
                if (selected.some(s => s.id === activeTimerId)) pauseTimer();
                render();
                saveData();
                showMessage('success', `${selected.length} atividade(s) excluída(s).`);
            }
            confirmationModal.classList.add('hidden');
        });
    };

    const updateSelectAllCheckbox = () => {
        const allActivitiesSelected = activities.length > 0 && activities.every(act => act.selected);
        selectAllActivitiesCheckbox.checked = allActivitiesSelected;
    };

    // --- Drag and Drop ---
    let draggedItem = null;

    const handleDragStart = (e) => {
        const targetElement = e.target.closest('tr') || e.target.closest('.activity-card');
        if (targetElement && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'TEXTAREA') {
            draggedItem = targetElement;
            e.dataTransfer.effectAllowed = 'move';
            e.target.classList.add('dragging');
        } else {
            e.preventDefault();
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        const targetElement = e.target.closest('tr') || e.target.closest('.activity-card');
        if (targetElement && draggedItem !== targetElement) {
            const bounding = targetElement.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);
            
            Array.from(tableBody.children).forEach(row => { row.style.borderTop = ''; row.style.borderBottom = ''; });
            Array.from(activityCardsContainer.children).forEach(card => { card.style.borderTop = ''; card.style.borderBottom = ''; });

            if (e.clientY - offset > 0) {
                targetElement.style.borderBottom = '2px solid #3b82f6';
            } else {
                targetElement.style.borderTop = '2px solid #3b82f6';
            }
        }
    };

    const handleDragLeave = (e) => {
        const targetElement = e.target.closest('tr') || e.target.closest('.activity-card');
        if (targetElement) {
            targetElement.style.borderTop = '';
            targetElement.style.borderBottom = '';
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const targetElement = e.target.closest('tr') || e.target.closest('.activity-card');
        if (targetElement && draggedItem && draggedItem !== targetElement) {
            const draggedId = Number(draggedItem.dataset.id);
            const targetId = Number(targetElement.dataset.id);

            const draggedIndex = activities.findIndex(act => act.id === draggedId);
            const targetIndex = activities.findIndex(act => act.id === targetId);

            if (draggedIndex === -1 || targetIndex === -1) return;

            const [removed] = activities.splice(draggedIndex, 1);
            const insertBefore = e.clientY < targetElement.getBoundingClientRect().top + (targetElement.offsetHeight / 2);

            activities.splice(insertBefore ? targetIndex : targetIndex + (draggedIndex < targetIndex ? 0 : 1), 0, removed);
            
            recalculateActivityTimes(0);
            render();
            saveData();
        }
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            Array.from(tableBody.children).forEach(row => { row.style.borderTop = ''; row.style.borderBottom = ''; });
            Array.from(activityCardsContainer.children).forEach(card => { card.style.borderTop = ''; card.style.borderBottom = ''; });
        }
        draggedItem = null;
    };

    const handleDragEnd = (e) => {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            Array.from(tableBody.children).forEach(row => { row.style.borderTop = ''; row.style.borderBottom = ''; });
            Array.from(activityCardsContainer.children).forEach(card => { card.style.borderTop = ''; card.style.borderBottom = ''; });
        }
        draggedItem = null;
    };


    // --- Gráfico ---
    const renderChart = () => {
        const ctx = document.getElementById('stats-chart').getContext('2d');
        if (chartInstance) {
            chartInstance.destroy();
        }

        const allDates = Object.keys(historicalData).sort();
        const totalLeverTimes = Object.keys(levers).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

        allDates.forEach(date => {
            Object.keys(levers).forEach(leverKey => {
                if (historicalData[date] && historicalData[date][leverKey] !== undefined) {
                    totalLeverTimes[leverKey] += historicalData[date][leverKey];
                }
            });
        });

        const labels = Object.values(levers);
        const dataPoints = labels.map(leverName => {
            const leverKey = Object.keys(levers).find(key => levers[key] === leverName);
            return (totalLeverTimes[leverKey] || 0) / 3600;
        });

        chartInstance = new Chart(ctx, {
            type: 'radar',
            data: { labels: labels, datasets: [{
                label: 'Horas Totais Gastas',
                data: dataPoints,
                backgroundColor: 'rgba(96, 165, 250, 0.4)',
                borderColor: 'rgba(96, 165, 250, 1)',
                pointBackgroundColor: 'rgba(96, 165, 250, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(96, 165, 250, 1)'
            }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: false
                        },
                        suggestedMin: 0,
                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 10
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed.r.toFixed(2) + ' horas';
                                return label;
                            }
                        }
                    }
                }
            }
        });
    };

    // --- Utilitários ---
    const timeToMinutes = (timeStr) => { 
        const [h, m] = timeStr.split(':').map(Number); 
        return h * 60 + m; 
    };
    const calculateDurationInMinutes = (start, end) => timeToMinutes(end) - timeToMinutes(start);
    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    };
    const minutesToHHMM = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
    };
    const calculateEndTime = (start, dur) => { 
        const t = timeToMinutes(start) + dur; 
        const totalMinutesInDay = 24 * 60;
        const adjustedT = t % totalMinutesInDay;
        const hours = Math.floor(adjustedT / 60);
        const minutes = adjustedT % 60;
        return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
    };
    const formatSecondsToFriendly = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        let parts = [];
        if (hours > 0) parts.push(`${hours} hora${hours > 1 ? 's' : ''}`);
        if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);
        if (seconds > 0) parts.push(`${seconds} segundo${seconds > 1 ? 's' : ''}`);

        if (parts.length === 0) return '0 segundos';
        if (parts.length === 1) return parts[0];
        return parts.slice(0, -1).join(', ') + ' e ' + parts[parts.length - 1];
    };
    
    const handleSavePdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape' });
        doc.text("Meu Plano de Produtividade", 14, 15);
        doc.setFontSize(10);
        doc.text(currentDateEl.textContent, 14, 22);

        const head = [['Checkbox', 'Arrastar', 'Horário', 'Atividade', 'Duração (min/HH:MM)', 'Registrado', 'Produtividade', 'Alavancador']];
        const body = activities.map(act => [
            act.selected ? 'X' : '',
            '⋮',
            `${act.startTime} - ${calculateEndTime(act.startTime, act.duration)}`,
            act.description,
            `${act.duration} min (${minutesToHHMM(act.duration)})`,
            formatTime(act.recordedTime),
            productivityLevels[act.productivity],
            levers[act.lever]
        ]);
        doc.autoTable({ head, body, startY: 28, styles: { font: 'Inter', fontSize: 8 }, headStyles: { fillColor: '#4a5568' }, theme: 'grid' });
        doc.save('plano-produtividade.pdf');
        showMessage('success', 'Plano exportado para PDF!');
    };

    // --- Relógio Atual no Rodapé ---
    const updateCurrentTimeDisplay = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        currentTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    };
    setInterval(updateCurrentTimeDisplay, 1000);

    // --- LLM Integration: Generate Smart Summary ---
    const generateSmartSummary = async () => {
        smartSummaryContent.innerHTML = '<p class="text-center text-gray-500 italic">A gerar o seu resumo...</p>';
        smartSummaryLoading.classList.remove('hidden');
        smartSummaryModal.classList.remove('hidden');
        smartSummaryModal.classList.add('flex');

        if (activities.length === 0) {
            smartSummaryContent.innerHTML = '<p class="text-center text-gray-600">Nenhuma atividade registada para gerar um resumo. Adicione algumas atividades primeiro!</p>';
            smartSummaryLoading.classList.add('hidden');
            return;
        }

        let prompt = `Você é um assistente de produtividade. Dada uma lista de atividades diárias, seu objetivo é fornecer um resumo perspicaz e inspirador do dia. Analise os dados e destaque os pontos fortes, áreas de melhoria e ofereça conselhos acionáveis ou uma mensagem motivacional.

Formato das atividades:
- Descrição: [string]
- Duração Planeada: [minutos]
- Tempo Registrado: [segundos]
- Produtividade: [Verde/Amarelo/Vermelho]
- Alavancador: [Saúde e Bem-Estar/Desenvolvimento Profissional/Desenvolvimento Pessoal/Relacionamentos/Finanças/Outros]

Aqui estão as atividades do dia:
`;

        activities.forEach(activity => {
            const recordedMinutes = Math.floor(activity.recordedTime / 60);
            prompt += `- Descrição: ${activity.description}, Duração Planeada: ${activity.duration} minutos, Tempo Registrado: ${recordedMinutes} minutos, Produtividade: ${productivityLevels[activity.productivity]}, Alavancador: ${levers[activity.lever]}\n`;
        });

        prompt += `\nPor favor, forneça um resumo detalhado e motivacional sobre o dia, incluindo análises sobre tempo planeado vs. tempo registado, e sugestões para otimização ou celebração de conquistas. Use a linguagem portuguesa (Portugal). Responda com parágrafos separados por duas quebras de linha.`;

        try {
            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const summaryText = result.candidates[0].content.parts[0].text;
                const formattedText = summaryText.split('\n\n').map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`).join('');
                smartSummaryContent.innerHTML = formattedText;
            } else {
                smartSummaryContent.innerHTML = '<p class="text-red-600">Erro: Não foi possível gerar o resumo. Tente novamente.</p>';
                console.error('Gemini API returned an unexpected structure:', result);
            }
        } catch (error) {
            smartSummaryContent.innerHTML = '<p class="text-red-600">Erro na comunicação com a Gemini API. Verifique a sua ligação ou tente mais tarde.</p>';
            console.error('Error calling Gemini API:', error);
        } finally {
            smartSummaryLoading.classList.add('hidden');
        }
    };

    const copySmartSummaryToClipboard = () => {
        const summaryText = smartSummaryContent.innerText;
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = summaryText;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        showMessage('success', 'Resumo copiado para a área de transferência!');
    };


    // --- Listeners de Eventos ---
    // Sidebar controls
    openSidebarBtn.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    addActivityColumnBtn.addEventListener('click', handleAddActivity);

    savePdfBtn.addEventListener('click', handleSavePdf);
    exportCsvBtn.addEventListener('click', handleCsvExport);
    importCsvBtn.addEventListener('click', () => csvFileInput.click());
    csvFileInput.addEventListener('change', handleCsvImport);
    copyCsvBtn.addEventListener('click', handleCopyCsv);
    saveDailySummaryBtn.addEventListener('click', handleSaveDailySummary);

    // Template management
    saveTemplateBtn.addEventListener('click', saveTemplate);
    loadTemplateBtn.addEventListener('click', loadTemplate);

    document.querySelector('#productivity-table').addEventListener('click', handleTableClick);
    document.querySelector('#productivity-table').addEventListener('change', handleTableChange);
    activityCardsContainer.addEventListener('click', handleTableClick);
    activityCardsContainer.addEventListener('change', handleTableChange);

    selectAllActivitiesCheckbox.addEventListener('change', (e) => {
        activities.forEach(activity => activity.selected = e.target.checked);
        render();
        updateFixedActionBarVisibility();
        saveData();
    });

    // Navigation
    sidebar.querySelector('#sidebar-show-plan-btn').addEventListener('click', () => switchView('plan'));
    sidebar.querySelector('#sidebar-show-tips-btn').addEventListener('click', () => switchView('tips'));
    sidebar.querySelector('#sidebar-show-stats-btn').addEventListener('click', () => switchView('stats'));
    sidebar.querySelector('#sidebar-show-quick-add-manage-btn').addEventListener('click', () => switchView('quickAddManage'));
    
    addTipBtn.addEventListener('click', handleAddTip);
    tipsListEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-tip-btn')) {
            tips.splice(parseInt(e.target.dataset.index, 10), 1);
            renderTips();
            saveData();
            showMessage('info', 'Dica removida.');
        }
    });
    newTipInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAddTip(); });
    closeAlarmBtn.addEventListener('click', () => alarmModal.classList.add('hidden'));

    // Active Activity Modal listeners
    closeActiveActivityModalBtn.addEventListener('click', closeActiveActivityModal);
    modalPauseBtn.addEventListener('click', pauseTimer);
    modalResetBtn.addEventListener('click', () => {
        if (activeTimerId) resetTimer(activeTimerId);
    });

    // Pomodoro listeners
    pomodoroStartBtn.addEventListener('click', startPomodoro);
    pomodoroPauseBtn.addEventListener('click', pausePomodoro);
    pomodoroResetBtn.addEventListener('click', resetPomodoro);

    // Confirmation Modal listeners
    confirmYesBtn.addEventListener('click', () => {
        if (confirmationCallback) confirmationCallback(true);
        confirmationModal.classList.add('hidden');
    });
    confirmNoBtn.addEventListener('click', () => {
        if (confirmationCallback) confirmationCallback(false);
        confirmationModal.classList.add('hidden');
    });

    // Fixed Action Bar listeners
    actionStartBtn.addEventListener('click', handleFixedActionStart);
    actionPauseBtn.addEventListener('click', handleFixedActionPause);
    actionDeleteBtn.addEventListener('click', handleFixedActionDelete);

    // Quick Add Management Listeners
    addCustomQuickActivityBtn.addEventListener('click', handleAddCustomQuickActivity);
    customQuickAddList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-all-quick-add-btn')) {
            const index = parseInt(e.target.dataset.index, 10);
            handleRemoveAllQuickAdd(index);
        }
    });


    // LLM Feature Listeners
    generateSummaryBtn.addEventListener('click', generateSmartSummary);
    closeSmartSummaryModalBtn.addEventListener('click', () => smartSummaryModal.classList.add('hidden'));
    copySummaryBtn.addEventListener('click', copySmartSummaryToClipboard);

    // Drag and Drop listeners applied to both tableBody and activityCardsContainer
    tableBody.addEventListener('dragstart', handleDragStart);
    tableBody.addEventListener('dragover', handleDragOver);
    tableBody.addEventListener('dragleave', handleDragLeave);
    tableBody.addEventListener('drop', handleDrop);
    tableBody.addEventListener('dragend', handleDragEnd);

    activityCardsContainer.addEventListener('dragstart', handleDragStart);
    activityCardsContainer.addEventListener('dragover', handleDragOver);
    activityCardsContainer.addEventListener('dragleave', handleDragLeave);
    activityCardsContainer.addEventListener('drop', handleDrop);
    activityCardsContainer.addEventListener('dragend', handleDragEnd);

    window.addEventListener('resize', render);
    
    // --- Inicialização ---
    loadData();
});
