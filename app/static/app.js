// Lógica do Frontend: "Stairway to 1000 • Feito por Rafael para Sophie ⚡🎸"

document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos do DOM ---
  const tabWriteBtn = document.getElementById('tabWriteBtn');
  const tabPhotoBtn = document.getElementById('tabPhotoBtn');
  const tabHistoryBtn = document.getElementById('tabHistoryBtn');
  const tabWriteContent = document.getElementById('tabWriteContent');
  const tabPhotoContent = document.getElementById('tabPhotoContent');
  const tabHistoryContent = document.getElementById('tabHistoryContent');

  // Mobile Bottom Nav
  const mTabWrite = document.getElementById('mTabWrite');
  const mTabPhoto = document.getElementById('mTabPhoto');
  const mTabHistory = document.getElementById('mTabHistory');
  const mTabBackstage = document.getElementById('mTabBackstage');

  const themeSelect = document.getElementById('themeSelect');
  const customThemeContainer = document.getElementById('customThemeContainer');
  const customThemeInput = document.getElementById('customThemeInput');
  const btnViewThemeTexts = document.getElementById('btnViewThemeTexts');

  // Modo Digitação
  const lineGutter = document.getElementById('lineGutter');
  const essayText = document.getElementById('essayText');
  const statLines = document.getElementById('statLines');
  const statWords = document.getElementById('statWords');
  const statChars = document.getElementById('statChars');
  const statParagraphs = document.getElementById('statParagraphs');
  const statReadingTime = document.getElementById('statReadingTime');
  const lineWarning = document.getElementById('lineWarning');
  const btnLoadExample = document.getElementById('btnLoadExample');
  const btnClearText = document.getElementById('btnClearText');
  const btnAnalyzeText = document.getElementById('btnAnalyzeText');

  // Modo Foto / Câmera
  const mobileCameraInput = document.getElementById('mobileCameraInput');
  const btnTriggerMobileCamera = document.getElementById('btnTriggerMobileCamera');
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const btnStartCamera = document.getElementById('btnStartCamera');
  const cameraContainer = document.getElementById('cameraContainer');
  const cameraVideo = document.getElementById('cameraVideo');
  const cameraCanvas = document.getElementById('cameraCanvas');
  const btnCapturePhoto = document.getElementById('btnCapturePhoto');
  const btnStopCamera = document.getElementById('btnStopCamera');
  const imagePreview = document.getElementById('imagePreview');
  const imagePlaceholder = document.getElementById('imagePlaceholder');
  const btnRemoveImage = document.getElementById('btnRemoveImage');
  const btnAnalyzeImage = document.getElementById('btnAnalyzeImage');

  // Resultados
  const resultsSection = document.getElementById('resultsSection');
  const resTotalScore = document.getElementById('resTotalScore');
  const resGradeLevel = document.getElementById('resGradeLevel');
  const resThemeSubtitle = document.getElementById('resThemeSubtitle');
  const resPersonalMessage = document.getElementById('resPersonalMessage');
  const resStrengthsList = document.getElementById('resStrengthsList');
  const resImprovementsList = document.getElementById('resImprovementsList');
  const interventionChecklist = document.getElementById('interventionChecklist');
  const competenciesContainer = document.getElementById('competenciesContainer');
  const paragraphsContainer = document.getElementById('paragraphsContainer');
  const repertoireList = document.getElementById('repertoireList');
  const connectivesList = document.getElementById('connectivesList');
  const rewritesContainer = document.getElementById('rewritesContainer');
  const resTranscription = document.getElementById('resTranscription');
  const btnCopyTranscription = document.getElementById('btnCopyTranscription');
  const btnSaveToHistory = document.getElementById('btnSaveToHistory');
  const btnPrintReport = document.getElementById('btnPrintReport');
  const btnScrollToTop = document.getElementById('btnScrollToTop');

  // Histórico
  const historyList = document.getElementById('historyList');
  const btnClearHistory = document.getElementById('btnClearHistory');
  let historyChart = null;
  let radarChart = null;

  // Modais e Overlays
  const loadingOverlay = document.getElementById('loadingOverlay');
  const loadingStatusText = document.getElementById('loadingStatusText');
  
  // Backstage Pass (Rafael & Rock)
  const rockNoteModal = document.getElementById('rockNoteModal');
  const rockNoteContent = document.getElementById('rockNoteContent');
  const rockNoteBand = document.getElementById('rockNoteBand');
  const btnOpenRockNote = document.getElementById('btnOpenRockNote');
  const btnOpenRockNoteTop = document.getElementById('btnOpenRockNoteTop');
  const btnCloseRockNote = document.getElementById('btnCloseRockNote');
  const btnNewRockNote = document.getElementById('btnNewRockNote');
  const btnConfirmRockNote = document.getElementById('btnConfirmRockNote');

  // Configurações
  const settingsModal = document.getElementById('settingsModal');
  const btnOpenSettings = document.getElementById('btnOpenSettings');
  const btnCloseSettings = document.getElementById('btnCloseSettings');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const btnTestApiKey = document.getElementById('btnTestApiKey');
  const btnSaveApiKey = document.getElementById('btnSaveApiKey');
  const keyStatusMsg = document.getElementById('keyStatusMsg');
  const keyStatusDot = document.getElementById('keyStatusDot');

  // Textos Motivadores
  const themeTextsModal = document.getElementById('themeTextsModal');
  const btnCloseThemeTexts = document.getElementById('btnCloseThemeTexts');
  const modalThemeTitle = document.getElementById('modalThemeTitle');
  const modalThemeDesc = document.getElementById('modalThemeDesc');
  const modalThemeTextsList = document.getElementById('modalThemeTextsList');
  const modalThemeKeywords = document.getElementById('modalThemeKeywords');

  // Tema Escuro / Claro
  const btnToggleTheme = document.getElementById('btnToggleTheme');
  const themeIcon = document.getElementById('themeIcon');

  // Estado da Aplicação
  let loadedThemes = [];
  let currentSelectedFile = null;
  let activeCameraStream = null;
  let lastAnalysisResult = null;
  let loadingInterval = null;

  // --- 1. Inicialização do Gutter de 30 Linhas ---
  function initLineGutter() {
    let html = '';
    for (let i = 1; i <= 30; i++) {
      html += `<div>${i.toString().padStart(2, '0')}</div>`;
    }
    lineGutter.innerHTML = html;
  }
  initLineGutter();

  // --- 2. Estatísticas em Tempo Real da Redação ---
  function updateEssayStats() {
    const text = essayText.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    
    // Contagem de linhas simulando folha real do ENEM
    const linesCount = text ? text.split('\n').reduce((acc, line) => {
      const visualLines = Math.max(1, Math.ceil(line.length / 75));
      return acc + visualLines;
    }, 0) : 0;

    const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    const readingTime = Math.ceil(words / 130);

    statLines.textContent = linesCount;
    statWords.textContent = words;
    if (statChars) statChars.textContent = chars;
    statParagraphs.textContent = paragraphs;
    statReadingTime.textContent = `${readingTime} min`;

    if (linesCount > 30) {
      lineWarning.classList.remove('hidden');
      statLines.classList.add('text-rose-400', 'animate-pulse');
    } else {
      lineWarning.classList.add('hidden');
      statLines.classList.remove('text-rose-400', 'animate-pulse');
    }
  }

  essayText.addEventListener('input', updateEssayStats);

  // --- 3. Carregar Temas Oficiais do ENEM ---
  async function loadThemes() {
    try {
      const resp = await fetch('/api/themes');
      const data = await resp.json();
      loadedThemes = data.themes || [];

      themeSelect.innerHTML = '';
      
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Escolha um tema oficial do ENEM ou atualidade...';
      themeSelect.appendChild(defaultOption);

      // Agrupa os temas por categoria em optgroups organizados
      const groups = {};
      loadedThemes.forEach(theme => {
        const cat = theme.category || 'Outros Temas';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(theme);
      });

      for (const [catName, themeList] of Object.entries(groups)) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = `📌 ${catName}`;
        themeList.forEach(theme => {
          const opt = document.createElement('option');
          opt.value = theme.id;
          opt.textContent = theme.title;
          optgroup.appendChild(opt);
        });
        themeSelect.appendChild(optgroup);
      }

      const customOpt = document.createElement('option');
      customOpt.value = 'custom';
      customOpt.textContent = '✏️ Digitar outro tema (Tema Livre)...';
      themeSelect.appendChild(customOpt);

    } catch (err) {
      console.error('Erro ao buscar temas:', err);
      themeSelect.innerHTML = '<option value="custom">✏️ Tema Livre / Digitar Tema</option>';
    }
  }
  loadThemes();

  themeSelect.addEventListener('change', () => {
    if (themeSelect.value === 'custom') {
      customThemeContainer.classList.remove('hidden');
      customThemeInput.focus();
    } else {
      customThemeContainer.classList.add('hidden');
    }
  });

  function getActiveThemeTitle() {
    const val = themeSelect.value;
    if (val === 'custom') {
      return customThemeInput.value.trim() || 'Tema Livre';
    }
    const found = loadedThemes.find(t => t.id === val);
    return found ? found.title : (val || 'Tema Livre');
  }

  // --- 4. Ver Textos Motivadores ---
  btnViewThemeTexts.addEventListener('click', () => {
    const val = themeSelect.value;
    const found = loadedThemes.find(t => t.id === val);

    if (!found) {
      modalThemeTitle.textContent = 'Tema Livre / Personalizado';
      modalThemeDesc.textContent = 'Nenhum texto motivador cadastrado para este tema. Use referências de história, filosofia ou arte para contextualizar sua introdução!';
      modalThemeTextsList.innerHTML = '<div class="p-3.5 bg-slate-900 rounded-xl text-xs text-slate-300 border border-slate-800">Dica do Rafa: No D1, lembre-se de fundamentar o problema com um repertório legitimado (como Teoria Crítica de Adorno ou Contrato Social de Locke). ⚡</div>';
      modalThemeKeywords.innerHTML = '<span class="px-2.5 py-1 bg-slate-800 text-amber-400 rounded-lg text-xs font-semibold"># Tema Livre</span>';
    } else {
      modalThemeTitle.textContent = found.title;
      modalThemeDesc.textContent = found.description;
      
      modalThemeTextsList.innerHTML = found.texts.map(txt => `
        <div class="p-3.5 bg-slate-900/90 rounded-xl text-xs text-slate-300 leading-relaxed border border-slate-800">
          ${txt}
        </div>
      `).join('');

      modalThemeKeywords.innerHTML = (found.keywords || []).map(kw => `
        <span class="px-2.5 py-1 bg-slate-800 text-amber-400 border border-slate-700 rounded-lg text-xs font-semibold">
          # ${kw}
        </span>
      `).join('');
    }

    themeTextsModal.classList.remove('hidden');
  });

  btnCloseThemeTexts.addEventListener('click', () => themeTextsModal.classList.add('hidden'));

  // --- 5. Alternar Abas (Desktop & Mobile) ---
  function switchTab(tabKey) {
    // Esconde todos
    tabWriteContent.classList.add('hidden');
    tabPhotoContent.classList.add('hidden');
    tabHistoryContent.classList.add('hidden');

    // Desativa estilos de abas desktop
    [tabWriteBtn, tabPhotoBtn, tabHistoryBtn].forEach(b => {
      b.classList.remove('bg-amber-500', 'text-slate-950', 'shadow-md', 'shadow-amber-500/20');
      b.classList.add('bg-slate-800', 'text-slate-300');
    });

    // Desativa estilos de abas mobile
    [mTabWrite, mTabPhoto, mTabHistory].forEach(mb => {
      mb.classList.remove('text-amber-400', 'font-bold');
      mb.classList.add('text-slate-400');
    });

    if (tabKey === 'write') {
      tabWriteContent.classList.remove('hidden');
      tabWriteBtn.classList.add('bg-amber-500', 'text-slate-950', 'shadow-md', 'shadow-amber-500/20');
      tabWriteBtn.classList.remove('bg-slate-800', 'text-slate-300');
      mTabWrite.classList.add('text-amber-400', 'font-bold');
      mTabWrite.classList.remove('text-slate-400');
    } else if (tabKey === 'photo') {
      tabPhotoContent.classList.remove('hidden');
      tabPhotoBtn.classList.add('bg-amber-500', 'text-slate-950', 'shadow-md', 'shadow-amber-500/20');
      tabPhotoBtn.classList.remove('bg-slate-800', 'text-slate-300');
      mTabPhoto.classList.add('text-amber-400', 'font-bold');
      mTabPhoto.classList.remove('text-slate-400');
    } else if (tabKey === 'history') {
      tabHistoryContent.classList.remove('hidden');
      tabHistoryBtn.classList.add('bg-amber-500', 'text-slate-950', 'shadow-md', 'shadow-amber-500/20');
      tabHistoryBtn.classList.remove('bg-slate-800', 'text-slate-300');
      mTabHistory.classList.add('text-amber-400', 'font-bold');
      mTabHistory.classList.remove('text-slate-400');
      renderHistory();
    }
  }

  tabWriteBtn.addEventListener('click', () => switchTab('write'));
  tabPhotoBtn.addEventListener('click', () => switchTab('photo'));
  tabHistoryBtn.addEventListener('click', () => switchTab('history'));

  mTabWrite.addEventListener('click', () => switchTab('write'));
  mTabPhoto.addEventListener('click', () => switchTab('photo'));
  mTabHistory.addEventListener('click', () => switchTab('history'));
  mTabBackstage.addEventListener('click', () => openRockNote());

  // --- 6. Redação Modelo & Limpar ---
  btnLoadExample.addEventListener('click', () => {
    essayText.value = `Na obra "Utopia", de Thomas More, retrata-se uma sociedade perfeita e destituída de desigualdades. Contudo, ao analisar o contexto brasileiro contemporâneo, percebe-se que a realidade destoa do ideal fictício, uma vez que a falta de acesso a direitos básicos ainda marginaliza parcelas expressivas da população. Nesse sentido, torna-se imperioso discutir não apenas a ineficiência governamental, mas também a passividade social diante desse impasse.

Em primeiro lugar, cabe pontuar a inércia do Estado como catalisador do problema. Segundo o filósofo John Locke, o poder público celebra um contrato social com a coletividade, devendo assegurar a preservação dos direitos inalienáveis dos cidadãos. Entretanto, no Brasil, as políticas públicas vigentes revelam-se desiguais, perpetuando disparidades históricas que afastam a população da plena cidadania.

Ademais, a alienação coletiva agrava o quadro. De acordo com a Teoria Crítica da Escola de Frankfurt — com pensadores como Theodor Adorno —, a padronização cultural e a mercantilização da vida cotidiana tendem a amortecer a consciência crítica dos indivíduos. Dessa forma, a sociedade contemporânea acostuma-se com a precarização alheia, silenciando demandas urgentes em vez de exigir transformações estruturais.

Portanto, medidas estratégicas são urgentes. Cabe ao Ministério da Educação — como órgão coordenador das diretrizes formativas nacionais —, em parceria com instituições culturais e veículos de comunicação, instituir oficinas e campanhas de letramento cidadão nas escolas públicas, por meio de debates interdisciplinares e projetos comunitários, a fim de despertar o protagonismo crítico e combater essa inércia coletiva. Assim, o Brasil poderá aproximar sua prática cotidiana da justiça idealizada por More.`;
    
    if (loadedThemes.length > 0) {
      themeSelect.value = loadedThemes[0].id;
    }
    updateEssayStats();
  });

  btnClearText.addEventListener('click', () => {
    if (confirm('Sophie, tem certeza de que deseja limpar o texto da redação?')) {
      essayText.value = '';
      updateEssayStats();
    }
  });

  // --- 7. Upload de Foto / Câmera Mobile Nativa ---
  btnTriggerMobileCamera.addEventListener('click', () => {
    mobileCameraInput.click();
  });

  mobileCameraInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  });

  dropZone.addEventListener('click', () => fileInput.click());

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('border-amber-400', 'bg-slate-800/80');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-amber-400', 'bg-slate-800/80');
    });
  });

  dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelected(files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  });

  function handleFileSelected(file) {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, escolha um arquivo de imagem válido (JPG, PNG ou WEBP).');
      return;
    }
    currentSelectedFile = file;
    const reader = new FileReader();
    reader.onload = (event) => {
      imagePreview.src = event.target.result;
      imagePreview.classList.remove('hidden');
      imagePlaceholder.classList.add('hidden');
      btnRemoveImage.classList.remove('hidden');
      cameraContainer.classList.add('hidden');

      btnAnalyzeImage.removeAttribute('disabled');
      btnAnalyzeImage.classList.remove('bg-slate-800', 'text-slate-500', 'cursor-not-allowed');
      btnAnalyzeImage.classList.add('bg-gradient-to-r', 'from-amber-500', 'to-amber-600', 'text-slate-950', 'shadow-lg', 'shadow-amber-500/20', 'hover:from-amber-600', 'hover:to-amber-700');
    };
    reader.readAsDataURL(file);
  }

  btnRemoveImage.addEventListener('click', () => {
    currentSelectedFile = null;
    fileInput.value = '';
    mobileCameraInput.value = '';
    imagePreview.src = '';
    imagePreview.classList.add('hidden');
    imagePlaceholder.classList.remove('hidden');
    btnRemoveImage.classList.add('hidden');

    btnAnalyzeImage.setAttribute('disabled', 'true');
    btnAnalyzeImage.classList.add('bg-slate-800', 'text-slate-500', 'cursor-not-allowed');
    btnAnalyzeImage.classList.remove('bg-gradient-to-r', 'from-amber-500', 'to-amber-600', 'text-slate-950', 'shadow-lg', 'shadow-amber-500/20', 'hover:from-amber-600', 'hover:to-amber-700');
  });

  // --- 8. Câmera Web ao Vivo (Desktop) ---
  btnStartCamera.addEventListener('click', async () => {
    try {
      imagePreview.classList.add('hidden');
      imagePlaceholder.classList.add('hidden');
      btnRemoveImage.classList.add('hidden');
      cameraContainer.classList.remove('hidden');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
      activeCameraStream = stream;
      cameraVideo.srcObject = stream;
    } catch (err) {
      console.error('Erro na câmera:', err);
      alert('Não foi possível acessar a câmera do navegador. Use o botão "Tirar Foto com a Câmera do Celular" ou selecione da galeria!');
      cameraContainer.classList.add('hidden');
      imagePlaceholder.classList.remove('hidden');
    }
  });

  function stopCameraStream() {
    if (activeCameraStream) {
      activeCameraStream.getTracks().forEach(track => track.stop());
      activeCameraStream = null;
    }
    cameraContainer.classList.add('hidden');
  }

  btnStopCamera.addEventListener('click', () => {
    stopCameraStream();
    if (currentSelectedFile) {
      imagePreview.classList.remove('hidden');
      btnRemoveImage.classList.remove('hidden');
    } else {
      imagePlaceholder.classList.remove('hidden');
    }
  });

  btnCapturePhoto.addEventListener('click', () => {
    const video = cameraVideo;
    const canvas = cameraCanvas;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const capturedFile = new File([blob], 'redacao_sophie_camera.jpg', { type: 'image/jpeg' });
      stopCameraStream();
      handleFileSelected(capturedFile);
    }, 'image/jpeg', 0.95);
  });

  // --- 9. Som e Confetes com Estilo Rock ---
  function playRockChime(isHighScore = false) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Acorde harmônico enérgico estilo power chord limpo
      const freqs = isHighScore ? [440, 554.37, 659.25, 880] : [440, 554.37, 659.25]; // Lá maior com oitava
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.8);
      });
    } catch (e) {
      // Ignora erro se áudio desativado
    }
  }

  function launchConfetti(score) {
    if (typeof confetti !== 'function') return;

    if (score >= 900) {
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#ef4444', '#ffffff']
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#f59e0b', '#10b981', '#ffffff']
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#f59e0b', '#10b981', '#ffffff']
        });
      }, 300);
    } else if (score >= 700) {
      confetti({
        particleCount: 50,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981']
      });
    }
  }

  // --- 10. Processo de Análise com IA ---
  const loadingMessages = [
    "Lendo cada linha da sua redação com o maior carinho... 📖",
    "Rodando os tokens de IA que o Rafa colocou para avaliar a fundo... ⚡",
    "Analisando sintaxe, repertório e as 5 competências do ENEM... ✍️",
    "Auditando os 5 elementos da proposta de intervenção... 🎯",
    "Quase pronto! Você é muito esforçada, Sophie, e a vaga é sua! 🚀"
  ];

  function startLoading() {
    loadingOverlay.classList.remove('hidden');
    let idx = 0;
    loadingStatusText.textContent = loadingMessages[0];
    loadingInterval = setInterval(() => {
      idx = (idx + 1) % loadingMessages.length;
      loadingStatusText.textContent = loadingMessages[idx];
    }, 2200);
  }

  function stopLoading() {
    clearInterval(loadingInterval);
    loadingOverlay.classList.add('hidden');
  }

  function getStoredApiKey() {
    return localStorage.getItem('sophie_gemini_api_key') || '';
  }

  // Análise de Texto Digitado
  btnAnalyzeText.addEventListener('click', async () => {
    const text = essayText.value.trim();
    if (text.length < 50) {
      alert('Sophie, por favor escreva pelo menos um parágrafo mais desenvolvido (mínimo de 50 caracteres) para a IA poder avaliar sua argumentação!');
      return;
    }

    startLoading();
    try {
      const theme = getActiveThemeTitle();
      const apiKey = getStoredApiKey();

      const resp = await fetch('/api/analyze/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, theme, api_key: apiKey })
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.detail || 'Erro ao processar redação');
      }

      const result = await resp.json();
      displayResults(result, theme);
    } catch (err) {
      console.error(err);
      alert(`Não foi possível concluir a análise: ${err.message}`);
    } finally {
      stopLoading();
    }
  });

  // Análise de Foto / Câmera
  btnAnalyzeImage.addEventListener('click', async () => {
    if (!currentSelectedFile) {
      alert('Por favor, tire uma foto ou selecione uma imagem da redação antes de enviar!');
      return;
    }

    startLoading();
    try {
      const theme = getActiveThemeTitle();
      const apiKey = getStoredApiKey();

      const formData = new FormData();
      formData.append('file', currentSelectedFile);
      if (theme) formData.append('theme', theme);
      if (apiKey) formData.append('api_key', apiKey);

      const resp = await fetch('/api/analyze/image', {
        method: 'POST',
        body: formData
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.detail || 'Erro ao processar imagem');
      }

      const result = await resp.json();
      displayResults(result, theme);
    } catch (err) {
      console.error(err);
      alert(`Não foi possível concluir a análise da imagem: ${err.message}`);
    } finally {
      stopLoading();
    }
  });

  // --- 11. Renderização dos Resultados ---
  function displayResults(data, themeTitle) {
    lastAnalysisResult = { ...data, theme: themeTitle, timestamp: new Date().toISOString() };

    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    playRockChime(data.total_score >= 900);
    launchConfetti(data.total_score);

    animateCounter(resTotalScore, data.total_score);
    resGradeLevel.textContent = data.grade_level;
    resThemeSubtitle.textContent = `Tema: ${themeTitle}`;
    resPersonalMessage.textContent = data.personal_message;

    renderRadarChart(data.competencies);

    // Pontos Fortes
    resStrengthsList.innerHTML = (data.strengths || []).map(s => `
      <li class="flex items-start">
        <i class="fa-solid fa-check text-emerald-400 mt-0.5 mr-1.5 flex-shrink-0"></i>
        <span>${s}</span>
      </li>
    `).join('');

    // Pontos a Melhorar
    resImprovementsList.innerHTML = (data.improvements || []).map(imp => `
      <li class="flex items-start">
        <i class="fa-solid fa-arrow-trend-up text-amber-400 mt-0.5 mr-1.5 flex-shrink-0"></i>
        <span>${imp}</span>
      </li>
    `).join('');

    // Checklist da Proposta de Intervenção (Comp 5)
    const elements = data.intervention_elements || {};
    const checklistMap = [
      { key: 'agente', label: 'Agente' },
      { key: 'acao', label: 'Ação' },
      { key: 'meio_modo', label: 'Modo/Meio' },
      { key: 'efeito', label: 'Efeito' },
      { key: 'detalhamento', label: 'Detalhamento' }
    ];

    interventionChecklist.innerHTML = checklistMap.map(item => {
      const present = !!elements[item.key];
      return `
        <div class="flex items-center space-x-1.5 p-2 rounded-xl ${present ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50' : 'bg-slate-900 text-slate-500 border border-slate-800'}">
          <i class="fa-solid ${present ? 'fa-circle-check text-emerald-400' : 'fa-circle-xmark text-slate-500'} text-xs"></i>
          <span class="font-semibold text-xs">${item.label}</span>
        </div>
      `;
    }).join('');

    // Detalhamento das 5 Competências
    competenciesContainer.innerHTML = (data.competencies || []).map(comp => `
      <div class="border border-slate-800 rounded-2xl p-4 bg-slate-900/80 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div class="flex items-center space-x-2">
            <span class="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
              C${comp.id}
            </span>
            <h4 class="font-bold text-xs md:text-sm text-white">
              Competência ${comp.id}: ${comp.name}
            </h4>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs font-black px-3 py-1 rounded-full ${comp.score >= 160 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : comp.score >= 120 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}">
              ${comp.score} / 200 pts
            </span>
          </div>
        </div>

        <p class="text-[11px] text-slate-400 mb-2 italic">${comp.description}</p>
        <p class="text-xs text-slate-300 leading-relaxed mb-3">${comp.feedback}</p>

        ${(comp.tips && comp.tips.length > 0) ? `
          <div class="bg-slate-950 p-2.5 rounded-xl text-xs text-slate-300 border border-slate-800">
            <strong class="text-amber-400">⚡ Estratégia para o 200:</strong>
            <ul class="list-disc list-inside mt-1 space-y-1 text-[11px]">
              ${comp.tips.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `).join('');

    // Análise Parágrafo a Parágrafo
    paragraphsContainer.innerHTML = (data.paragraphs_analysis || []).map(p => `
      <div class="border border-slate-800 rounded-2xl p-4 bg-slate-900/60">
        <div class="flex items-center justify-between mb-2">
          <h5 class="font-bold text-xs text-white uppercase tracking-wider">${p.title}</h5>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'Excelente' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-300'}">${p.status}</span>
        </div>
        <p class="text-[11px] text-slate-400 italic mb-2 line-clamp-2">"${p.excerpt}"</p>
        <p class="text-xs text-slate-300 leading-relaxed">${p.assessment}</p>
      </div>
    `).join('');

    // Repertório Sociocultural
    repertoireList.innerHTML = (data.suggested_repertoire || []).map(rep => `
      <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
        <div class="flex items-center justify-between mb-1">
          <strong class="text-amber-400 font-bold">${rep.repertoire}</strong>
          <span class="text-[10px] text-slate-400">${rep.author_source}</span>
        </div>
        <p class="text-slate-300 leading-relaxed text-[11px]">${rep.application_tip}</p>
      </div>
    `).join('');

    // Conectivos
    connectivesList.innerHTML = (data.suggested_connectives || []).map(c => `
      <span class="px-2.5 py-1 bg-slate-800 text-emerald-400 border border-slate-700 rounded-lg text-xs font-semibold">
        ${c}
      </span>
    `).join('');

    // Sugestões de Reescrita
    rewritesContainer.innerHTML = (data.rewrite_suggestions || []).map(rw => `
      <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
        <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
          <strong class="text-slate-400 block mb-1">Original:</strong>
          "${rw.original}"
        </div>
        <div class="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 text-slate-200">
          <strong class="text-amber-400 block mb-1">Sugestão Polida:</strong>
          "${rw.improved}"
        </div>
        <p class="text-slate-400 text-[11px] pt-1">
          <i class="fa-solid fa-circle-info text-amber-400 mr-1"></i> ${rw.explanation}
        </p>
      </div>
    `).join('');

    // Transcrição
    resTranscription.textContent = data.transcription || 'Texto não disponível.';
  }

  function animateCounter(element, target) {
    let current = 0;
    const duration = 1000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.round(current);
      }
    }, stepTime);
  }

  // --- 12. Gráfico Radar das 5 Competências (Chart.js) ---
  function renderRadarChart(competencies) {
    const ctx = document.getElementById('competenciesRadarChart');
    if (!ctx) return;

    if (radarChart) {
      radarChart.destroy();
    }

    const labels = (competencies || []).map(c => `C${c.id}`);
    const dataValues = (competencies || []).map(c => c.score);

    radarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nota da Sophie',
          data: dataValues,
          fill: true,
          backgroundColor: 'rgba(245, 158, 11, 0.25)',
          borderColor: '#f59e0b',
          pointBackgroundColor: '#f59e0b',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#f59e0b',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            suggestedMin: 0,
            suggestedMax: 200,
            ticks: { stepSize: 40, backdropColor: 'transparent', color: '#94a3b8', font: { size: 9 } },
            pointLabels: { color: '#f1f5f9', font: { size: 10, weight: 'bold' } }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // --- 13. Copiar Transcrição & Imprimir Relatório ---
  btnCopyTranscription.addEventListener('click', () => {
    navigator.clipboard.writeText(resTranscription.textContent).then(() => {
      const originalText = btnCopyTranscription.innerHTML;
      btnCopyTranscription.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i> Copiado!';
      setTimeout(() => btnCopyTranscription.innerHTML = originalText, 2000);
    });
  });

  btnPrintReport.addEventListener('click', () => {
    window.print();
  });

  btnScrollToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- 14. Histórico Local ---
  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem('sophie_essays_history')) || [];
    } catch {
      return [];
    }
  }

  function saveHistory(history) {
    localStorage.setItem('sophie_essays_history', JSON.stringify(history));
  }

  btnSaveToHistory.addEventListener('click', () => {
    if (!lastAnalysisResult) return;
    const history = getHistory();
    history.unshift(lastAnalysisResult);
    if (history.length > 40) history.pop();
    saveHistory(history);

    const originalHTML = btnSaveToHistory.innerHTML;
    btnSaveToHistory.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i> Salvo!';
    setTimeout(() => btnSaveToHistory.innerHTML = originalHTML, 2000);
  });

  function renderHistory() {
    const history = getHistory();

    if (history.length === 0) {
      historyList.innerHTML = `
        <div class="text-center py-8 text-slate-500">
          <i class="fa-solid fa-record-vinyl text-4xl mb-2 text-slate-600"></i>
          <p class="text-xs">Nenhum treino salvo ainda no histórico.</p>
          <p class="text-[11px] text-slate-500">Corrija sua primeira redação e clique em "Salvar no Histórico"!</p>
        </div>
      `;
      if (historyChart) historyChart.destroy();
      return;
    }

    historyList.innerHTML = history.map((item, idx) => {
      const dateStr = new Date(item.timestamp).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
      });
      return `
        <div class="flex items-center justify-between p-3.5 bg-slate-900 rounded-2xl border border-slate-800 shadow-sm">
          <div class="flex items-center space-x-3">
            <div class="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 text-white flex flex-col items-center justify-center font-black text-xs">
              <span class="text-amber-400">${item.total_score}</span>
              <span class="text-[8px] font-normal text-slate-400">pts</span>
            </div>
            <div>
              <h5 class="font-bold text-xs md:text-sm text-white line-clamp-1">${item.theme || 'Tema Livre'}</h5>
              <p class="text-[11px] text-slate-400">${dateStr} • ${item.grade_level}</p>
            </div>
          </div>
          <button data-history-idx="${idx}" class="btn-reload-history px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold text-amber-400 transition-all">
            Ver Diagnóstico
          </button>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.btn-reload-history').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-history-idx');
        const item = history[idx];
        if (item) {
          displayResults(item, item.theme || 'Redação Salva');
        }
      });
    });

    renderHistoryChart(history);
  }

  function renderHistoryChart(history) {
    const ctx = document.getElementById('historyChart');
    if (!ctx) return;

    if (historyChart) historyChart.destroy();

    const chronological = [...history].reverse();
    const labels = chronological.map((h, i) => `Treino #${i + 1}`);
    const scores = chronological.map(h => h.total_score);

    historyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Evolução da Nota ENEM',
          data: scores,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#f59e0b',
          pointBorderColor: '#fff',
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 1000,
            ticks: { stepSize: 200, color: '#94a3b8' },
            grid: { color: 'rgba(255, 255, 255, 0.06)' }
          },
          x: {
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(255, 255, 255, 0.06)' }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  btnClearHistory.addEventListener('click', () => {
    if (confirm('Sophie, deseja limpar todo o histórico de treinos salvos?')) {
      localStorage.removeItem('sophie_essays_history');
      renderHistory();
    }
  });

  // --- 15. Backstage Pass (Rafael, Rock & Alice Oseman: 30 Recados Exclusivos) ---
  const LOCAL_ROCK_NOTES = [
    {
      quote: "Como a Alice Oseman escreveu em Heartstopper: você não precisa ter todas as respostas do mundo agora, só precisa dar um passo de cada vez. 🍂❤️\n\nRespira fundo antes de começar a introdução, você é brilhante e tem um futuro lindo pela frente! Domingo que vem eu te vejo e te dou um beijo de boa sorte pessoalmente! 😉❤️",
      band: "Alice Oseman (Heartstopper) • Rafa 🍂"
    },
    {
      quote: "'Hi.' 'Hi.' ✨ Na pegada fofa de Nick e Charlie: tô aqui torcendo por você em cada parágrafo!\n\nQuando bater aquele cansaço dos estudos, lembra que o seu esforço vai valer cada segundo. Você é maravilhosa, Sophie! Domingo que vem te vejo com certeza! 😉❤️",
      band: "Heartstopper • Rafa 🍂❤️"
    },
    {
      quote: "Como diz a Alice Oseman em Radio Silence: 'Eu me pergunto se, quando ninguém está ouvindo a sua voz, você ainda está fazendo algum som'... 🎧🍂\n\nQuero que você saiba que eu tô sempre aqui te ouvindo e torcendo por você! Sua escrita tem muita sensibilidade e força. Domingo que vem te vejo pra te desejar boa sorte pessoalmente! 😉❤️",
      band: "Alice Oseman (Radio Silence) • Rafa 🍂"
    },
    {
      quote: "Dica de ouro no estilo Alice Oseman: escreva com verdade e coloque a sua essência nos argumentos. 📖✨\n\nVocê não precisa fingir nada: a sua inteligência e seu olhar crítico já são mais que suficientes pra encantar qualquer corretor do ENEM. Domingo que vem eu te vejo e te dou um beijo de boa sorte pessoalmente! 😉❤️",
      band: "Alice Oseman • Rafa 🍂"
    },
    {
      quote: "Mais uma da Alice Oseman em Solitaire: 'Coisas boas podem acontecer, mesmo quando tudo parece meio caótico'. 🍂❤️\n\nConfia no processo e vai com calma. Você é muito esforçada e dedicada, Sophie. Domingo a gente se vê sem falta! 😉❤️",
      band: "Alice Oseman (Solitaire) • Rafa 🍂"
    },
    {
      quote: "Desculpa por não conseguir te ver hoje, gatinha... Mas domingo que vem eu te vejo e te dou um beijo de boa sorte pessoalmente! 😉❤️\n\nFiz esse site com o maior carinho pra você treinar no ônibus, em casa ou onde estiver com praticidade. Você é linda, super inteligente e esforçada, tenho certeza de que vai gabaritar essa redação! Foco total no treino! ❤️⚡",
      band: "Rafa ⚡"
    },
    {
      quote: "Desculpa por não conseguir te ver hoje, domingo que vem eu te vejo e te dou aquele beijo de boa sorte! 😉❤️\n\nE como diria o Queen: 'Don't Stop Me Now'! Foca na estrutura dos parágrafos e nos conectivos que essa nota 1000 já tem dona. Tô na torcida por você, gatinha! ❤️",
      band: "Queen • Rafa ⚡"
    },
    {
      quote: "David Bowie mandou avisar: 'We can be heroes, just for one day'! ⚡\n\nVocê é muito inteligente e tem uma visão crítica incrível. Quando pegar o tema, respira fundo e confia no seu repertório. Domingo que vem te vejo pra comemorar sua evolução! 😉❤️",
      band: "David Bowie • Rafa ⚡"
    },
    {
      quote: "Lembra do Paul McCartney: 'Take a sad song and make it better'! 🎸\n\nSe bater aquela dúvida na hora da tese, não esquenta: revisa o projeto de texto e vai no seu ritmo. Você é brilhante demais, Sophie! Domingo que vem te dou aquele beijo de boa sorte pessoalmente! 😉❤️",
      band: "The Beatles • Rafa ⚡"
    },
    {
      quote: "Na pegada cósmica de Vênere Vai Vênus: boas energias pra te dar muita sorte hoje! 🪐❤️\n\nDomingo que vem eu te vejo com certeza pra te desejar boa sorte pessoalmente. Espero que você goste bastante do site, fiz pensando em você pra facilitar sua rotina e te ver brilhando na faculdade! ❤️",
      band: "Vênere Vai Vênus • Rafa ⚡"
    },
    {
      quote: "Led Zeppelin já profetizou: 'There's a lady who's sure all that glitters is gold... and she's buying a Stairway to Heaven' ⚡\n\nNo nosso caso é a Stairway to 1000! Cada treino seu é um degrau a mais rumo à aprovação. Domingo que vem te vejo sem falta! 😉❤️",
      band: "Led Zeppelin • Rafa ⚡"
    },
    {
      quote: "Como diria o Oasis em 'Wonderwall': 'Because maybe, you're gonna be the one that saves me'! 🎸✨\n\nNão deixa a ansiedade te pegar, gatinha. Você escreve muito bem e tem repertório de sobra. Domingo a gente se vê pra colocar o papo em dia e te dou um beijo de boa sorte pessoalmente! 😉❤️",
      band: "Oasis • Rafa ⚡"
    },
    {
      quote: "Dica de ouro do Rafa: capricha nos 5 elementos da proposta de intervenção na C5! 📝\n\nAgente, ação, meio/modo, efeito e detalhamento. Não tem segredo pra quem é inteligente e dedicada como você. Tô muito orgulhoso do seu foco! Domingo que vem eu te vejo! 😉❤️",
      band: "Dica do Rafa ⚡"
    },
    {
      quote: "Freddie Mercury cantou: 'We Are The Champions'! 👑⚡\n\nE você já é campeã só pela dedicação de treinar redação até nos dias mais corridos. Você é uma garota incrível, Sophie. Domingo que vem te vejo! 😉❤️",
      band: "Queen • Rafa ⚡"
    },
    {
      quote: "John Lennon dizia: 'Imagine all the people living life in peace'... 🕊️\n\nE eu fico imaginando a sua nota 1000 saindo no boletim do ENEM! Certeza de que a sua vaga tá garantida. Respira, toma uma água e bora pro próximo parágrafo! Te vejo domingo! 😉❤️",
      band: "John Lennon • Rafa ⚡"
    },
    {
      quote: "Lembra do Pink Floyd: 'Another Brick in the Wall'! 🧱⚡\n\nMas aqui cada parágrafo que você escreve é um tijolo construindo o seu futuro na universidade. Você é muito esforçada, Sophie, gosto muito de você e tô torcendo demais! Domingo te vejo! 😉❤️",
      band: "Pink Floyd • Rafa ⚡"
    },
    {
      quote: "The Rolling Stones mandaram avisar: 'Start Me Up'! 🎸🔥\n\nBora ligar o turbo nos conectivos e nas referências socioculturais! Você é genial, Sophie. Domingo que vem eu te vejo e te dou um beijo de boa sorte pessoalmente! 😉❤️",
      band: "Rolling Stones • Rafa ⚡"
    },
    {
      quote: "Passando pra te lembrar: não se cobre perfeição em todo treino! ☕❤️\n\nO objetivo aqui é praticar sem pressão, no ônibus, em casa ou no intervalo. Fiz essa plataforma pra ser leve pra você. Você é sensacional, Sophie! Te vejo domingo! 😉❤️",
      band: "Recado do Rafa ⚡"
    },
    {
      quote: "Mais uma de Vênere Vai Vênus: 'A gravidade não segura quem nasceu pra voar'! 🪐✨\n\nConfia na sua caligrafia, no seu pensamento crítico e no seu talento. Domingo que vem te vejo sem falta, gatinha! 😉❤️",
      band: "Vênere Vai Vênus • Rafa ⚡"
    },
    {
      quote: "Elton John já dizia: 'I'm Still Standing'! 🎹⚡\n\nMesmo quando bater o cansaço dos estudos, lembra que você tá mais perto do que imagina. Admiro muito sua força de vontade, Sophie! Te vejo domingo pra te dar aquele beijo de boa sorte pessoalmente! 😉❤️",
      band: "Elton John • Rafa ⚡"
    },
    {
      quote: "Dica rápida de conectivos: 'Outrossim', 'Nesse diapasão', 'Sob essa ótica', 'Em consonância'... 📖\n\nUsa com elegância que a banca examinadora do ENEM vai aplaudir de pé! Domingo que vem eu te vejo, gatinha! 😉❤️",
      band: "Dica do Rafa ⚡"
    },
    {
      quote: "The Who já cantava: 'The Kids Are Alright'! ⚡🎸\n\nE você tá mais que pronta pra detonar nessa prova. Fico feliz demais em poder te dar essa força. Domingo a gente se vê! 😉❤️",
      band: "The Who • Rafa ⚡"
    },
    {
      quote: "George Harrison mandou o recado: 'Here Comes The Sun, and I say it's all right'! ☀️🎸\n\nDepois de cada redação corrigida, vem o alívio e a evolução. Você é brilhante, Sophie! Domingo que vem te dou aquele beijo de boa sorte pessoalmente! 😉❤️",
      band: "The Beatles • Rafa ⚡"
    },
    {
      quote: "Você sabia que a sua inteligência e seu jeito esforçado são contagiantes? ⚡❤️\n\nFiz esse cantinho pra você estudar com carinho. Arrebenta na argumentação que o resto é consequência! Domingo que vem te vejo! 😉❤️",
      band: "Rafa ⚡"
    },
    {
      quote: "Oasis em 'Live Forever': 'Maybe I will never be all the things that I want to be, but now is not the time to cry'... 🎸\n\nÉ tempo de brilhar no ENEM e mostrar todo esse seu potencial! Tô com você nessa jornada, gatinha. Te vejo domingo! 😉❤️",
      band: "Oasis • Rafa ⚡"
    },
    {
      quote: "Dica da C2: lembra sempre de amarrar o repertório sociocultural com a tese! 💡\n\nNão adianta só citar o autor, tem que mostrar o porquê ele se conecta com a realidade brasileira. Mas você já sabe disso de letra! Domingo que vem te vejo! 😉❤️",
      band: "Dica do Rafa ⚡"
    },
    {
      quote: "David Bowie em 'Starman': 'There's a starman waiting in the sky, he'd like to come and meet us'... 🌟⚡\n\nE a estrela dessa prova é você! Vai sem medo que o seu texto tá ficando cada dia mais afiado. Domingo que vem eu te vejo e te dou um beijo de boa sorte pessoalmente! 😉❤️",
      band: "David Bowie • Rafa ⚡"
    },
    {
      quote: "Pausa estratégica: já bebeu água hoje? 💧 Já descansou os olhos 5 minutinhos?\n\nCuidar de você também faz parte da nota 1000! Você é muito especial, Sophie. Domingo a gente se vê! 😉❤️",
      band: "Cuidado do Rafa ⚡"
    },
    {
      quote: "Como diria Freddie Mercury: 'The Show Must Go On'! 👑⚡\n\nBora pra mais um parágrafo que a aprovação tá cada vez mais perto. Te admiro muito, Sophie! Te vejo domingo! 😉❤️",
      band: "Queen • Rafa ⚡"
    },
    {
      quote: "Obrigado por me deixar fazer parte da sua preparação pro ENEM, mesmo que com um sitezinho e uma IA rodando! 💻❤️\n\nEspero que esteja te ajudando de verdade. Domingo que vem eu te vejo e te dou aquele beijo de boa sorte pessoalmente! 😉❤️",
      band: "Rafa ⚡"
    }
  ];

  let currentNoteIdx = -1;

  function cycleRockNote() {
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * LOCAL_ROCK_NOTES.length);
    } while (nextIdx === currentNoteIdx && LOCAL_ROCK_NOTES.length > 1);
    
    currentNoteIdx = nextIdx;
    const note = LOCAL_ROCK_NOTES[nextIdx];
    
    rockNoteContent.textContent = `"${note.quote}"`;
    rockNoteBand.textContent = note.band;
    
    // Animação sutil de transição
    rockNoteContent.classList.remove('animate-fade-in');
    void rockNoteContent.offsetWidth; // trigger reflow
    rockNoteContent.classList.add('animate-fade-in');
  }

  function openRockNote() {
    cycleRockNote();
    rockNoteModal.classList.remove('hidden');
    playRockChime(false);
  }

  btnOpenRockNote.addEventListener('click', openRockNote);
  btnOpenRockNoteTop.addEventListener('click', openRockNote);
  btnCloseRockNote.addEventListener('click', () => rockNoteModal.classList.add('hidden'));
  btnConfirmRockNote.addEventListener('click', () => {
    rockNoteModal.classList.add('hidden');
  });
  btnNewRockNote.addEventListener('click', () => {
    // Efeito de giro no ícone de reload
    const icon = btnNewRockNote.querySelector('i');
    if (icon) {
      icon.classList.add('fa-spin');
      setTimeout(() => icon.classList.remove('fa-spin'), 400);
    }
    cycleRockNote();
  });

  // --- 16. Configuração da Chave API ---
  btnOpenSettings.addEventListener('click', () => {
    apiKeyInput.value = getStoredApiKey();
    keyStatusMsg.classList.add('hidden');
    settingsModal.classList.remove('hidden');
  });

  btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));

  btnSaveApiKey.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
      localStorage.setItem('sophie_gemini_api_key', key);
      keyStatusMsg.className = 'text-xs p-3 rounded-xl mb-4 bg-emerald-950 text-emerald-300 border border-emerald-800';
      keyStatusMsg.textContent = 'Chave salva com sucesso no navegador! ✅';
      keyStatusDot.className = 'w-2 h-2 rounded-full bg-emerald-400 inline-block';
    } else {
      localStorage.removeItem('sophie_gemini_api_key');
      keyStatusMsg.className = 'text-xs p-3 rounded-xl mb-4 bg-amber-950 text-amber-300 border border-amber-800';
      keyStatusMsg.textContent = 'Chave removida. Usando o modo diagnóstico demonstrativo.';
      keyStatusDot.className = 'w-2 h-2 rounded-full bg-amber-400 inline-block';
    }
    keyStatusMsg.classList.remove('hidden');
  });

  btnTestApiKey.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      alert('Por favor, digite uma chave de API antes de testar!');
      return;
    }

    keyStatusMsg.className = 'text-xs p-3 rounded-xl mb-4 bg-slate-950 text-slate-300 border border-slate-800';
    keyStatusMsg.textContent = 'Testando conexão com a IA da Google...';
    keyStatusMsg.classList.remove('hidden');

    try {
      const resp = await fetch('/api/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: key })
      });

      const data = await resp.json();
      if (resp.ok) {
        keyStatusMsg.className = 'text-xs p-3 rounded-xl mb-4 bg-emerald-950 text-emerald-300 border border-emerald-800';
        keyStatusMsg.textContent = `Conexão bem-sucedida! (${data.message}) ✅`;
      } else {
        throw new Error(data.detail || 'Falha ao conectar.');
      }
    } catch (err) {
      keyStatusMsg.className = 'text-xs p-3 rounded-xl mb-4 bg-rose-950 text-rose-300 border border-rose-800';
      keyStatusMsg.textContent = `Erro: ${err.message}`;
    }
  });

  if (getStoredApiKey()) {
    keyStatusDot.className = 'w-2 h-2 rounded-full bg-emerald-400 inline-block';
  } else {
    keyStatusDot.className = 'w-2 h-2 rounded-full bg-amber-400 inline-block';
  }

  // --- 17. Modo Claro / Escuro ---
  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
      document.body.classList.add('bg-slate-900', 'text-slate-100');
      themeIcon.className = 'fa-solid fa-sun text-amber-400';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-slate-900', 'text-slate-100');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
      themeIcon.className = 'fa-solid fa-moon text-slate-400';
    }
  }

  const isDarkMode = localStorage.getItem('sophie_dark_mode') !== 'false'; // Dark mode padrão
  applyTheme(isDarkMode);

  btnToggleTheme.addEventListener('click', () => {
    const current = document.documentElement.classList.contains('dark');
    const newMode = !current;
    applyTheme(newMode);
    localStorage.setItem('sophie_dark_mode', newMode.toString());
  });

});
