// Logica do Frontend 100% Client-Side para GitHub Pages (Sophie)
// Conecta diretamente na API do Google Gemini no navegador sem depender de backend Python

const DEFAULT_API_KEY = atob("QVEuQWI4Uk42TGc5MU1yMElCQW1yd2lFZ3RzUllIN2g4QjBuTXFJaDlvck1sT0VDYllsM3c=");

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const tabWriteBtn = document.getElementById('tabWriteBtn');
  const tabPhotoBtn = document.getElementById('tabPhotoBtn');
  const tabHistoryBtn = document.getElementById('tabHistoryBtn');
  const tabWriteContent = document.getElementById('tabWriteContent');
  const tabPhotoContent = document.getElementById('tabPhotoContent');
  const tabHistoryContent = document.getElementById('tabHistoryContent');

  const mTabWrite = document.getElementById('mTabWrite');
  const mTabPhoto = document.getElementById('mTabPhoto');
  const mTabHistory = document.getElementById('mTabHistory');

  const themeSelect = document.getElementById('themeSelect');
  const customThemeContainer = document.getElementById('customThemeContainer');
  const customThemeInput = document.getElementById('customThemeInput');
  const btnViewThemeTexts = document.getElementById('btnViewThemeTexts');

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

  const historyList = document.getElementById('historyList');
  const btnClearHistory = document.getElementById('btnClearHistory');
  let historyChart = null;
  let radarChart = null;

  const loadingOverlay = document.getElementById('loadingOverlay');
  const loadingStatusText = document.getElementById('loadingStatusText');

  const settingsModal = document.getElementById('settingsModal');
  const btnOpenSettings = document.getElementById('btnOpenSettings');
  const btnCloseSettings = document.getElementById('btnCloseSettings');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const btnTestApiKey = document.getElementById('btnTestApiKey');
  const btnSaveApiKey = document.getElementById('btnSaveApiKey');
  const keyStatusMsg = document.getElementById('keyStatusMsg');
  const keyStatusDot = document.getElementById('keyStatusDot');

  const themeTextsModal = document.getElementById('themeTextsModal');
  const btnCloseThemeTexts = document.getElementById('btnCloseThemeTexts');
  const modalThemeTitle = document.getElementById('modalThemeTitle');
  const modalThemeDesc = document.getElementById('modalThemeDesc');
  const modalThemeTextsList = document.getElementById('modalThemeTextsList');
  const modalThemeKeywords = document.getElementById('modalThemeKeywords');

  const btnToggleTheme = document.getElementById('btnToggleTheme');
  const themeIcon = document.getElementById('themeIcon');

  let loadedThemes = (typeof THEMES !== 'undefined') ? THEMES : [];
  let currentSelectedFile = null;
  let activeCameraStream = null;
  let lastAnalysisResult = null;
  let loadingInterval = null;

  // 1. Gutter de 30 Linhas
  function initLineGutter() {
    let html = '';
    for (let i = 1; i <= 30; i++) {
      html += `<div>${i.toString().padStart(2, '0')}</div>`;
    }
    lineGutter.innerHTML = html;
  }
  initLineGutter();

  // 2. Estatisticas em Tempo Real
  function updateEssayStats() {
    const text = essayText.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    
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

  // 3. Carregar Temas
  function populateThemes() {
    themeSelect.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Escolha um tema oficial do ENEM ou atualidade...';
    themeSelect.appendChild(defaultOption);

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
  }
  populateThemes();

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

  // 4. Ver Textos Motivadores
  btnViewThemeTexts.addEventListener('click', () => {
    const val = themeSelect.value;
    const found = loadedThemes.find(t => t.id === val);

    if (!found) {
      modalThemeTitle.textContent = 'Tema Livre / Personalizado';
      modalThemeDesc.textContent = 'Nenhum texto motivador cadastrado para este tema. Utilize referências de história, filosofia, sociologia ou legislação para contextualizar sua introdução.';
      modalThemeTextsList.innerHTML = '<div class="p-3.5 bg-slate-900 rounded-xl text-xs text-slate-300 border border-slate-800">Dica: Nos parágrafos de desenvolvimento, lembre-se de fundamentar sua argumentação com um repertório sociocultural legitimado e produtivo.</div>';
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

  // 5. Alternar Abas
  function switchTab(tabKey) {
    tabWriteContent.classList.add('hidden');
    tabPhotoContent.classList.add('hidden');
    tabHistoryContent.classList.add('hidden');

    [tabWriteBtn, tabPhotoBtn, tabHistoryBtn].forEach(b => {
      b.classList.remove('bg-amber-500', 'text-slate-950', 'shadow-md', 'shadow-amber-500/20');
      b.classList.add('bg-slate-800', 'text-slate-300');
    });

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

  // 6. Exemplo Nota 1000 & Limpar
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
    if (confirm('Tem certeza de que deseja limpar o texto da redação?')) {
      essayText.value = '';
      updateEssayStats();
    }
  });

  // 7. Upload de Foto / Camera Mobile
  btnTriggerMobileCamera.addEventListener('click', () => mobileCameraInput.click());

  mobileCameraInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) handleFileSelected(e.target.files[0]);
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
    if (files.length > 0) handleFileSelected(files[0]);
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFileSelected(e.target.files[0]);
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

  // 8. Camera Desktop
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
      alert('Não foi possível acessar a câmera do navegador. Use o botão "Tirar Foto com a Câmera do Celular" ou selecione da galeria.');
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
      const capturedFile = new File([blob], 'redacao_camera.jpg', { type: 'image/jpeg' });
      stopCameraStream();
      handleFileSelected(capturedFile);
    }, 'image/jpeg', 0.95);
  });

  // 9. Sons e Confetes
  function playSuccessChime(isHighScore = false) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const freqs = isHighScore ? [440, 554.37, 659.25, 880] : [440, 554.37, 659.25];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.8);
      });
    } catch (e) {}
  }

  function launchConfetti(score) {
    if (typeof confetti !== 'function') return;
    if (score >= 900) {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ['#f59e0b', '#10b981', '#38bdf8', '#ffffff'] });
    } else if (score >= 700) {
      confetti({ particleCount: 45, spread: 55, origin: { y: 0.6 }, colors: ['#f59e0b', '#10b981'] });
    }
  }

  // 10. Chamada Direta a API do Google Gemini (Client-Side)
  const loadingMessages = [
    "Lendo o texto e verificando a estrutura dos parágrafos...",
    "Avaliando a norma-padrão e os mecanismos de coesão...",
    "Analisando repertório sociocultural e argumentação...",
    "Verificando os 5 elementos da proposta de intervenção...",
    "Finalizando o diagnóstico detalhado pelas 5 competências..."
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

  function getActiveApiKey() {
    return localStorage.getItem('sophie_gemini_api_key') || DEFAULT_API_KEY;
  }

  async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function callGeminiDirectly({ text, imageBase64, imageMime, theme }) {
    const key = getActiveApiKey();
    const systemPrompt = `Você é um avaliador experiente de redação do ENEM no Brasil, com perfil técnico, pedagógico e objetivo.
Esta plataforma serve para auxiliar a estudante SOPHIE a treinar redação e evoluir rumo à nota máxima no ENEM.
Use somente o nome Sophie (ou o apelido 'Sabrina Sato') e não cite o nome de nenhuma outra pessoa.

REGRA DE SAUDAÇÃO OBRIGATÓRIA NO CAMPO 'personal_message':
- Se total_score >= 700: comece EXATAMENTE com: "Boa sabrina sato! " e complete com a análise construtiva dos pontos fortes e o que manter.
- Se total_score < 700: comece EXATAMENTE com: "Eae sophie, " e continue apontando de forma leve e encorajadora onde focar para subir nos próximos treinos.

MATRIZ OFICIAL ENEM (0 a 1000):
- Cada competência recebe nota de 0 a 200 nos níveis: 0, 40, 80, 120, 160 ou 200.
1. Competência 1: Domínio da norma padrão culta escrita.
2. Competência 2: Compreensão da proposta temática e repertório sociocultural legitimado e produtivo.
3. Competência 3: Projeto de texto estratégico, coerência e progressão argumentativa.
4. Competência 4: Domínio dos mecanismos linguísticos de coesão (conectivos inter e intraparágrafos).
5. Competência 5: Proposta de intervenção completa com os 5 elementos (agente, ação, meio/modo, efeito, detalhamento).

Responda ESTRITAMENTE em formato JSON puro, sem blocos markdown extras, seguindo rigorosamente esta estrutura:
{
  "transcription": "texto integral fielmente transcrito",
  "total_score": 920,
  "grade_level": "Excelente Desempenho • Nível 900+",
  "personal_message": "comentário geral construtivo direcionado à Sophie",
  "competencies": [
    {
      "id": 1,
      "name": "Norma Padrão",
      "score": 160,
      "description": "Domínio da norma culta formal da língua escrita",
      "feedback": "comentário técnico sobre a C1",
      "tips": ["dica prática 1", "dica prática 2"]
    },
    {
      "id": 2,
      "name": "Tema e Repertório",
      "score": 200,
      "description": "Compreensão da proposta e repertório sociocultural",
      "feedback": "comentário técnico sobre a C2",
      "tips": ["dica prática 1"]
    },
    {
      "id": 3,
      "name": "Projeto de Texto",
      "score": 200,
      "description": "Seleção, organização e interpretação de argumentos",
      "feedback": "comentário técnico sobre a C3",
      "tips": ["dica prática 1"]
    },
    {
      "id": 4,
      "name": "Coesão e Conectivos",
      "score": 160,
      "description": "Domínio dos recursos coesivos inter e intraparágrafos",
      "feedback": "comentário técnico sobre a C4",
      "tips": ["dica prática 1"]
    },
    {
      "id": 5,
      "name": "Proposta de Intervenção",
      "score": 200,
      "description": "Elaboração de proposta completa com os 5 elementos",
      "feedback": "comentário técnico sobre a C5",
      "tips": ["dica prática 1"]
    }
  ],
  "strengths": ["ponto forte 1", "ponto forte 2"],
  "improvements": ["oportunidade de melhoria 1", "oportunidade de melhoria 2"],
  "paragraphs_analysis": [
    {"title": "Introdução", "excerpt": "trecho inicial...", "assessment": "análise da introdução", "status": "Excelente"},
    {"title": "Desenvolvimento 1", "excerpt": "trecho do D1...", "assessment": "análise do D1", "status": "Excelente"},
    {"title": "Desenvolvimento 2", "excerpt": "trecho do D2...", "assessment": "análise do D2", "status": "Muito Bom"},
    {"title": "Conclusão", "excerpt": "trecho da conclusão...", "assessment": "análise da conclusão", "status": "Excelente"}
  ],
  "suggested_repertoire": [
    {"repertoire": "Conceito / Obra", "author_source": "Autor / Teórico", "application_tip": "Como aplicar"}
  ],
  "suggested_connectives": ["Nesse diapasão", "Sob essa perspectiva", "Outrossim", "Destarte"],
  "rewrite_suggestions": [
    {"original": "trecho original", "improved": "trecho melhorado", "explanation": "justificativa"}
  ],
  "intervention_elements": {
    "agente": true,
    "acao": true,
    "meio_modo": true,
    "efeito": true,
    "detalhamento": true
  }
}`;

    const parts = [{ text: `${systemPrompt}\n\nTEMA DA REDAÇÃO: ${theme || 'Identificar a partir do texto'}\n\nTEXTO/INSTRUÇÃO: Avalie detalhadamente a redação a seguir.` }];
    
    if (imageBase64) {
      parts.push({
        inline_data: {
          mime_type: imageMime || 'image/jpeg',
          data: imageBase64
        }
      });
      parts.push({ text: 'Por favor, primeiro transcreva com precisão a folha manuscrita para o campo "transcription" e faça a avaliação completa.' });
    } else {
      parts.push({ text: `TEXTO DA REDAÇÃO:\n\n${text}` });
    }

    const models = ['gemini-3.5-flash-lite', 'gemini-3-flash-preview', 'gemini-3.8-flash'];
    let lastErr = null;

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              response_mime_type: 'application/json',
              temperature: 0.25
            }
          })
        });

        if (!resp.ok) {
          const errData = await resp.json();
          throw new Error(errData.error?.message || `Erro HTTP ${resp.status}`);
        }

        const data = await resp.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error('Resposta vazia da IA.');

        const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedJson);
      } catch (err) {
        lastErr = err;
        console.warn(`Tentativa com ${model} falhou:`, err);
      }
    }

    throw lastErr || new Error('Não foi possível obter resposta da IA.');
  }

  // Análise de Texto
  btnAnalyzeText.addEventListener('click', async () => {
    const text = essayText.value.trim();
    if (text.length < 50) {
      alert('Por favor, escreva pelo menos um parágrafo mais desenvolvido (mínimo de 50 caracteres) para realizar a avaliação.');
      return;
    }

    startLoading();
    try {
      const theme = getActiveThemeTitle();
      const result = await callGeminiDirectly({ text, theme });
      displayResults(result, theme);
    } catch (err) {
      console.error(err);
      alert(`Não foi possível concluir a análise: ${err.message}`);
    } finally {
      stopLoading();
    }
  });

  // Análise de Imagem
  btnAnalyzeImage.addEventListener('click', async () => {
    if (!currentSelectedFile) {
      alert('Por favor, tire uma foto ou selecione uma imagem da redação antes de enviar.');
      return;
    }

    startLoading();
    try {
      const theme = getActiveThemeTitle();
      const imageBase64 = await fileToBase64(currentSelectedFile);
      const result = await callGeminiDirectly({
        imageBase64,
        imageMime: currentSelectedFile.type,
        theme
      });
      displayResults(result, theme);
    } catch (err) {
      console.error(err);
      alert(`Não foi possível concluir a análise da imagem: ${err.message}`);
    } finally {
      stopLoading();
    }
  });

  // 11. Renderização dos Resultados
  // Limpeza geral: troca nomes de outras pessoas em TODOS os textos da análise
  const NOME_OUTRA_PESSOA = /\blari\b|\bgatinha ruiva\b/gi;
  function limparNomes(valor) {
    if (typeof valor === 'string') return valor.replace(NOME_OUTRA_PESSOA, 'Sophie');
    if (Array.isArray(valor)) return valor.map(limparNomes);
    if (valor && typeof valor === 'object') {
      const out = {};
      for (const k of Object.keys(valor)) out[k] = limparNomes(valor[k]);
      return out;
    }
    return valor;
  }

  function displayResults(data, themeTitle) {
    data = limparNomes(data);
    lastAnalysisResult = { ...data, theme: themeTitle, timestamp: new Date().toISOString() };

    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    playSuccessChime(data.total_score >= 900);
    launchConfetti(data.total_score);

    animateCounter(resTotalScore, data.total_score);
    resGradeLevel.textContent = data.grade_level;
    resThemeSubtitle.textContent = `Tema: ${themeTitle}`;
    // Saudação fixa por nota; só tira a saudação do modelo se ela realmente for uma saudação
    let msgSophie = String(data.personal_message || '');
    msgSophie = msgSophie.replace(/^\s*(?:oi|ol[aá]|eae|e a[ií]|boa|parab[eé]ns|querid[oa]|sophie)\b[^.!?:\n]{0,60}[!?:.,]+\s*/i, '').trim();
    if (data.total_score >= 700) {
      resPersonalMessage.textContent = "Boa sabrina sato! " + msgSophie;
    } else {
      resPersonalMessage.textContent = "Eae sophie, " + msgSophie;
    }
    data.personal_message = resPersonalMessage.textContent;

    renderRadarChart(data.competencies);

    resStrengthsList.innerHTML = (data.strengths || []).map(s => `
      <li class="flex items-start">
        <i class="fa-solid fa-check text-emerald-400 mt-0.5 mr-1.5 flex-shrink-0"></i>
        <span>${s}</span>
      </li>
    `).join('');

    resImprovementsList.innerHTML = (data.improvements || []).map(imp => `
      <li class="flex items-start">
        <i class="fa-solid fa-arrow-trend-up text-amber-400 mt-0.5 mr-1.5 flex-shrink-0"></i>
        <span>${imp}</span>
      </li>
    `).join('');

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
            <strong class="text-amber-400">Dicas para alcançar 200 pontos:</strong>
            <ul class="list-disc list-inside mt-1 space-y-1 text-[11px]">
              ${comp.tips.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `).join('');

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

    repertoireList.innerHTML = (data.suggested_repertoire || []).map(rep => `
      <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
        <div class="flex items-center justify-between mb-1">
          <strong class="text-amber-400 font-bold">${rep.repertoire}</strong>
          <span class="text-[10px] text-slate-400">${rep.author_source}</span>
        </div>
        <p class="text-slate-300 leading-relaxed text-[11px]">${rep.application_tip}</p>
      </div>
    `).join('');

    connectivesList.innerHTML = (data.suggested_connectives || []).map(c => `
      <span class="px-2.5 py-1 bg-slate-800 text-emerald-400 border border-slate-700 rounded-lg text-xs font-semibold">
        ${c}
      </span>
    `).join('');

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

  // 12. Grafico Radar
  function renderRadarChart(competencies) {
    const ctx = document.getElementById('competenciesRadarChart');
    if (!ctx) return;
    if (radarChart) radarChart.destroy();

    const labels = (competencies || []).map(c => `C${c.id}`);
    const dataValues = (competencies || []).map(c => c.score);

    radarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Pontuação',
          data: dataValues,
          fill: true,
          backgroundColor: 'rgba(245, 158, 11, 0.25)',
          borderColor: '#f59e0b',
          pointBackgroundColor: '#f59e0b',
          pointBorderColor: '#fff',
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
        plugins: { legend: { display: false } }
      }
    });
  }

  btnCopyTranscription.addEventListener('click', () => {
    navigator.clipboard.writeText(resTranscription.textContent).then(() => {
      const originalText = btnCopyTranscription.innerHTML;
      btnCopyTranscription.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i> Copiado!';
      setTimeout(() => btnCopyTranscription.innerHTML = originalText, 2000);
    });
  });

  btnPrintReport.addEventListener('click', () => window.print());
  btnScrollToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // 13. Historico Local
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
          <i class="fa-solid fa-folder-open text-4xl mb-2 text-slate-600"></i>
          <p class="text-xs">Nenhum treino salvo ainda no histórico.</p>
          <p class="text-[11px] text-slate-500">Corrija sua primeira redação e clique em "Salvar no Histórico".</p>
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
        if (item) displayResults(item, item.theme || 'Redação Salva');
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
          y: { min: 0, max: 1000, ticks: { stepSize: 200, color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.06)' } },
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.06)' } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  btnClearHistory.addEventListener('click', () => {
    if (confirm('Deseja limpar todo o histórico de treinos salvos?')) {
      localStorage.removeItem('sophie_essays_history');
      renderHistory();
    }
  });

  // 14. Configuracoes
  btnOpenSettings.addEventListener('click', () => {
    apiKeyInput.value = localStorage.getItem('sophie_gemini_api_key') || '';
    keyStatusMsg.classList.add('hidden');
    settingsModal.classList.remove('hidden');
  });

  btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));

  btnSaveApiKey.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
      localStorage.setItem('sophie_gemini_api_key', key);
      keyStatusMsg.className = 'text-xs p-3 rounded-xl mb-4 bg-emerald-950 text-emerald-300 border border-emerald-800';
      keyStatusMsg.textContent = 'Chave personalizada salva com sucesso.';
      keyStatusDot.className = 'w-2 h-2 rounded-full bg-emerald-400 inline-block';
    } else {
      localStorage.removeItem('sophie_gemini_api_key');
      keyStatusMsg.className = 'text-xs p-3 rounded-xl mb-4 bg-amber-950 text-amber-300 border border-amber-800';
      keyStatusMsg.textContent = 'Usando a chave padrão do sistema.';
      keyStatusDot.className = 'w-2 h-2 rounded-full bg-emerald-400 inline-block';
    }
    keyStatusMsg.classList.remove('hidden');
  });

  btnTestApiKey.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim() || DEFAULT_API_KEY;
    keyStatusMsg.className = 'text-xs p-3 rounded-xl mb-4 bg-slate-950 text-slate-300 border border-slate-800';
    keyStatusMsg.textContent = 'Testando conexão com a IA da Google...';
    keyStatusMsg.classList.remove('hidden');

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${key}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Diga apenas 'OK'" }] }] })
      });
      if (resp.ok) {
        keyStatusMsg.className = 'text-xs p-3 rounded-xl mb-4 bg-emerald-950 text-emerald-300 border border-emerald-800';
        keyStatusMsg.textContent = 'Conexão ativa com sucesso com o Google Gemini!';
      } else {
        throw new Error(`Código ${resp.status}`);
      }
    } catch (err) {
      keyStatusMsg.className = 'text-xs p-3 rounded-xl mb-4 bg-rose-950 text-rose-300 border border-rose-800';
      keyStatusMsg.textContent = `Erro ao conectar: ${err.message}`;
    }
  });

  // 15. Modo Claro / Escuro
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

  const isDarkMode = localStorage.getItem('sophie_dark_mode') !== 'false';
  applyTheme(isDarkMode);

  btnToggleTheme.addEventListener('click', () => {
    const current = document.documentElement.classList.contains('dark');
    const newMode = !current;
    applyTheme(newMode);
    localStorage.setItem('sophie_dark_mode', newMode.toString());
  });

});
