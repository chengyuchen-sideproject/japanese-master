// ============================================================================
// 日語隨身通 Nihongo Go — 核心互動邏輯 (TTS 發音 / 語音辨識 / SRS 記憶 / 闖關測驗)
// ============================================================================

const STORAGE_KEY = "nihongo_go_state_v1";

const DEFAULT_STATE = {
  xp: 0,
  streak: 1,
  lastStudyDate: "",
  dailyXp: 0,
  dailyGoalXp: 100,
  learnedKana: {},      // { "あ": true, ... }
  srsDeck: {},          // { vocabId: { box: 1..5, nextReview: epochMs, reps: 0 } }
  completedScenarios: {},
  quizBestScore: 0
};

let STATE = loadState();
let CURRENT_TAB = "home";
let KANA_TYPE = "seion";     // seion | dakuon | yoon
let KANA_SCRIPT = "hiragana"; // hiragana | katakana
let CURRENT_SCENARIO_ID = CONVERSATIONS[0].id;
let SHOW_ROMAJI = true;
let CARDS_SUBTAB = "vocab";  // vocab | grammar
let CURRENT_JLPT_FILTER = "all";
let CURRENT_CARD_INDEX = 0;
let CARD_FLIPPED = false;

// Quiz State
let QUIZ_LEVEL_FILTER = "all";
let ACTIVE_QUIZ_LIST = [];
let QUIZ_INDEX = 0;
let QUIZ_SCORE = 0;
let QUIZ_ANSWERED = false;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initStreak({ ...DEFAULT_STATE });
    const parsed = JSON.parse(raw);
    return initStreak({ ...DEFAULT_STATE, ...parsed });
  } catch (e) {
    return { ...DEFAULT_STATE };
  }
}

function initStreak(st) {
  const today = new Date().toISOString().slice(0, 10);
  if (st.lastStudyDate !== today) {
    if (st.lastStudyDate) {
      const prev = new Date(st.lastStudyDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr - prev) / 86400000);
      if (diffDays === 1) {
        st.streak = (st.streak || 1) + 1;
      } else if (diffDays > 1) {
        st.streak = 1;
      }
    } else {
      st.streak = 1;
    }
    st.dailyXp = 0;
    st.lastStudyDate = today;
  }
  return st;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
  } catch (e) {}
  updateHeaderStats();
}

function addXP(pts) {
  STATE.xp = (STATE.xp || 0) + pts;
  STATE.dailyXp = (STATE.dailyXp || 0) + pts;
  saveState();
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// ============================================================================
// 1. Web Speech API — 日語真人語音合成 (TTS ja-JP) & 口說語音辨識
// ============================================================================
let JP_VOICE = null;

function initJapaneseVoice() {
  if (!("speechSynthesis" in window)) return;
  const pick = () => {
    const voices = window.speechSynthesis.getVoices() || [];
    JP_VOICE =
      voices.find(v => v.lang === "ja-JP" && /Kyoko|Otoya|Google|Haruka|Ichiro|Sayaka|Nanami/i.test(v.name)) ||
      voices.find(v => v.lang && v.lang.toLowerCase().startsWith("ja")) ||
      null;
  };
  pick();
  window.speechSynthesis.onvoiceschanged = pick;
}

function speakJP(text, rate = 1.0) {
  const cleanText = String(text || "").replace(/\s*\[[0-9]+\]/g, "").replace(/（[^）]*）/g, "").replace(/\([^)]*\)/g, "");
  if (window.AndroidTTS && typeof window.AndroidTTS.speak === "function") {
    window.AndroidTTS.speak(cleanText, String(rate));
    return;
  }
  if (!("speechSynthesis" in window)) {
    alert("您的瀏覽器不支援語音合成 (Web Speech API)");
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(cleanText);
  u.lang = "ja-JP";
  u.rate = rate;
  if (JP_VOICE) u.voice = JP_VOICE;
  window.speechSynthesis.speak(u);
}

function practiceShadowing(targetJp, resultDomId) {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const el = document.getElementById(resultDomId);
  if (!SpeechRec) {
    if (el) {
      el.style.display = "block";
      el.innerHTML = `💡 您的瀏覽器未開放語音辨識（建議使用手機 Chrome 或 Safari），請先點擊「🔊 正常 / 🐢 慢速」聽發音並開口跟讀 3 次！`;
    }
    addXP(5);
    return;
  }
  const rec = new SpeechRec();
  rec.lang = "ja-JP";
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  if (el) {
    el.style.display = "block";
    el.innerHTML = `<span style="color:#fde047">🎙️ 請開始說日文...（正在聆聽）</span>`;
  }

  rec.onresult = (evt) => {
    const transcript = evt.results[0][0].transcript || "";
    const norm = s => s.replace(/[、。！？!?\s]/g, "");
    const t1 = norm(transcript);
    const t2 = norm(targetJp);
    let matchCount = 0;
    for (let i = 0; i < t1.length; i++) {
      if (t2.indexOf(t1[i]) !== -1) matchCount++;
    }
    const score = Math.min(100, Math.round((matchCount / Math.max(1, t2.length)) * 100));
    addXP(10);
    if (el) {
      const badgeColor = score >= 75 ? "#4ade80" : "#fbbf24";
      el.innerHTML = `✅ 辨識結果：「<strong>${escapeHtml(transcript)}</strong>」 — 相似度 <strong style="color:${badgeColor}">${score}%</strong> (+10 XP)`;
    }
  };

  rec.onerror = () => {
    if (el) {
      el.innerHTML = `⚠️ 未能清楚收到語音，請確認麥克風權限，或直接點選「🔊 發音」跟讀練習 (+5 XP)`;
    }
    addXP(5);
  };

  rec.start();
}

// ============================================================================
// 2. Navigation & Header Stats
// ============================================================================
function updateHeaderStats() {
  const streakEl = document.getElementById("headerStreak");
  const xpEl = document.getElementById("headerXP");
  if (streakEl) streakEl.textContent = STATE.streak || 1;
  if (xpEl) xpEl.textContent = STATE.xp || 0;
}

function switchTab(tabId, filterLevel = null) {
  CURRENT_TAB = tabId;
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.toggle("active", sec.id === "view-" + tabId);
  });
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });

  if (filterLevel) {
    if (tabId === "cards") CURRENT_JLPT_FILTER = filterLevel;
    if (tabId === "quiz") QUIZ_LEVEL_FILTER = filterLevel;
  }

  if (tabId === "home") renderHomeView();
  if (tabId === "kana") renderKanaView();
  if (tabId === "conv") renderConvView();
  if (tabId === "cards") renderCardsView();
  if (tabId === "quiz") renderQuizView();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================================================================
// 3. View 1: 學習藍圖 & 今日目標 (Home / Roadmap)
// ============================================================================
function renderHomeView() {
  const learnedKanaCount = Object.keys(STATE.learnedKana || {}).length;
  const totalSeion = KANA_DATA.seion.filter(x => !x.empty).length;
  const masteredVocabCount = Object.values(STATE.srsDeck || {}).filter(x => x.box >= 3).length;
  const dailyPct = Math.min(100, Math.round(((STATE.dailyXp || 0) / (STATE.dailyGoalXp || 100)) * 100));

  const container = document.getElementById("view-home");
  container.innerHTML = `
    <div class="card hero-card">
      <div class="section-header" style="margin-bottom:6px">
        <div>
          <span class="jlpt-badge lvl-zero">零基礎 ➔ 日常對話 ➔ JLPT N1</span>
          <h2 style="margin:6px 0 2px;font-size:1.25rem">今日日語學習進度</h2>
        </div>
        <div style="text-align:right">
          <div style="font-size:1.35rem;font-weight:800;color:#fde047">${STATE.dailyXp || 0} / ${STATE.dailyGoalXp || 100} XP</div>
          <div style="font-size:0.74rem;color:#cbd5e1">每日建議 15 分鐘</div>
        </div>
      </div>
      <div class="progress-wrap">
        <div class="progress-fill" style="width:${dailyPct}%"></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px;text-align:center">
        <div style="background:rgba(15,23,42,0.6);padding:8px;border-radius:10px">
          <div style="font-size:0.72rem;color:var(--muted)">已掌握五十音</div>
          <div style="font-size:1.1rem;font-weight:800;color:#4ade80">${learnedKanaCount} / ${totalSeion}</div>
        </div>
        <div style="background:rgba(15,23,42,0.6);padding:8px;border-radius:10px">
          <div style="font-size:0.72rem;color:var(--muted)">已熟記單字閃卡</div>
          <div style="font-size:1.1rem;font-weight:800;color:#38bdf8">${masteredVocabCount} / ${VOCAB_LIST.length}</div>
        </div>
        <div style="background:rgba(15,23,42,0.6);padding:8px;border-radius:10px">
          <div style="font-size:0.72rem;color:var(--muted)">完成情境對話</div>
          <div style="font-size:1.1rem;font-weight:800;color:#fb7185">${Object.keys(STATE.completedScenarios || {}).length} / ${CONVERSATIONS.length}</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
        <button class="btn btn-primary" style="flex:1" onclick="switchTab('kana')">🔤 1. 先背五十音</button>
        <button class="btn btn-accent" style="flex:1" onclick="switchTab('conv')">💬 2. 開口練對話</button>
        <button class="btn" style="flex:1" onclick="switchTab('cards', 'N1')">🏆 3. N5~N1 閃卡</button>
      </div>
    </div>

    <div class="section-header" style="margin-top:18px">
      <h3 class="section-title">🗺️ 零基礎到簡單對話 & JLPT N1 攻頂藍圖</h3>
      <span style="font-size:0.75rem;color:var(--muted)">點擊任一階段直接開始練習</span>
    </div>

    <div class="roadmap-list">
      ${ROADMAP_STAGES.map((st, i) => `
        <div class="roadmap-item" onclick="switchTab('${st.actionTab}', '${st.level === 'zero' ? 'all' : st.level}')">
          <div class="roadmap-step-num">${i}</div>
          <div style="flex:1">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
              <span class="jlpt-badge lvl-${st.level}">${escapeHtml(st.badge)}</span>
              <span style="font-size:0.73rem;color:var(--muted)">${escapeHtml(st.period)}</span>
            </div>
            <div style="font-size:1.02rem;font-weight:800;margin:6px 0 3px;color:#fff">${escapeHtml(st.title)}</div>
            <div style="font-size:0.82rem;color:var(--accent);margin-bottom:6px">🎯 目標：${escapeHtml(st.goal)}</div>
            <ul style="margin:0;padding-left:18px;font-size:0.78rem;color:#cbd5e1">
              ${st.checkpoints.map(cp => `<li style="margin-bottom:3px">${escapeHtml(cp)}</li>`).join("")}
            </ul>
            <div style="margin-top:8px">
              <span class="btn btn-sm btn-accent">${escapeHtml(st.actionLabel)} ➔</span>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// ============================================================================
// 4. View 2: 五十音互動發音表 (Kana Master)
// ============================================================================
function renderKanaView() {
  const container = document.getElementById("view-kana");
  const list = KANA_DATA[KANA_TYPE] || KANA_DATA.seion;
  const cols = KANA_TYPE === "yoon" ? 3 : 5;

  container.innerHTML = `
    <div class="card">
      <div class="section-header">
        <div>
          <h2 class="section-title">🔤 五十音互動發音表</h2>
          <div style="font-size:0.78rem;color:var(--muted);margin-top:2px">點擊任一假名立即聽真人發音、查看「零基礎聯想記憶口訣」與代表單字</div>
        </div>
        <button class="btn btn-sm btn-primary" onclick="switchTab('quiz', 'zero')">⚡ 五十音隨堂測驗</button>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px">
        <div class="chip-group" style="margin-bottom:0">
          <button class="chip ${KANA_TYPE === 'seion' ? 'active' : ''}" onclick="KANA_TYPE='seion';renderKanaView()">清音 (46音)</button>
          <button class="chip ${KANA_TYPE === 'dakuon' ? 'active' : ''}" onclick="KANA_TYPE='dakuon';renderKanaView()">濁音・半濁音 (25音)</button>
          <button class="chip ${KANA_TYPE === 'yoon' ? 'active' : ''}" onclick="KANA_TYPE='yoon';renderKanaView()">拗音 (きゃ/しゃ)</button>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm ${KANA_SCRIPT === 'hiragana' ? 'btn-accent' : ''}" onclick="KANA_SCRIPT='hiragana';renderKanaView()">平假名 (あ)</button>
          <button class="btn btn-sm ${KANA_SCRIPT === 'katakana' ? 'btn-accent' : ''}" onclick="KANA_SCRIPT='katakana';renderKanaView()">片假名 (ア)</button>
        </div>
      </div>

      <div class="kana-grid" style="grid-template-columns:repeat(${cols}, 1fr)">
        ${list.map((item, idx) => {
          if (item.empty) return `<div class="kana-cell empty"></div>`;
          const mainChar = KANA_SCRIPT === "hiragana" ? item.h : item.k;
          const subChar = KANA_SCRIPT === "hiragana" ? item.k : item.h;
          const isLearned = STATE.learnedKana && STATE.learnedKana[item.h];
          return `
            <div class="kana-cell ${isLearned ? 'learned' : ''}" onclick="openKanaModal('${KANA_TYPE}', ${idx})">
              <div class="kana-char">${escapeHtml(mainChar)}</div>
              <div class="kana-sub">${escapeHtml(item.r)}</div>
              <div class="kana-other">對照: ${escapeHtml(subChar)} ${isLearned ? '✅' : ''}</div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function openKanaModal(type, idx) {
  const item = (KANA_DATA[type] || [])[idx];
  if (!item || item.empty) return;
  speakJP(item.h, 0.9);
  addXP(3);

  const isLearned = STATE.learnedKana && STATE.learnedKana[item.h];
  const modal = document.getElementById("kanaModal");
  const content = document.getElementById("kanaModalContent");
  content.innerHTML = `
    <div style="display:flex;justify-content:center;gap:18px;align-items:baseline;margin-bottom:8px">
      <div>
        <div style="font-size:0.75rem;color:var(--muted)">平假名</div>
        <div style="font-size:3.2rem;font-weight:800;color:#fff">${escapeHtml(item.h)}</div>
      </div>
      <div>
        <div style="font-size:0.75rem;color:var(--muted)">片假名</div>
        <div style="font-size:3.2rem;font-weight:800;color:#38bdf8">${escapeHtml(item.k)}</div>
      </div>
    </div>
    <div style="font-size:1.1rem;font-weight:700;color:#fde047;margin-bottom:10px">羅馬拼音：[ ${escapeHtml(item.r)} ] （${escapeHtml(item.row)}）</div>
    <div style="background:rgba(15,23,42,0.8);border:1px solid var(--border);border-radius:12px;padding:12px;text-align:left;margin-bottom:12px">
      <div style="font-size:0.8rem;color:#fb7185;font-weight:700;margin-bottom:4px">💡 零基礎秒記口訣：</div>
      <div style="font-size:0.9rem;color:#f1f5f9">${escapeHtml(item.mnemonic)}</div>
      <div style="margin-top:10px;padding-top:8px;border-top:1px dashed var(--border);display:flex;justify-content:space-between;align-items:center">
        <div>
          <span style="font-size:0.76rem;color:var(--muted)">代表單字：</span>
          <strong style="color:#38bdf8">${escapeHtml(item.word)}</strong> — ${escapeHtml(item.wordZh)}
        </div>
        <button class="btn btn-sm btn-accent" onclick="speakJP('${escapeHtml(item.word.split(' ')[0])}', 0.9)">🔊 聽單字</button>
      </div>
    </div>
    <div style="display:flex;gap:8px;justify-content:center">
      <button class="btn btn-accent" onclick="speakJP('${escapeHtml(item.h)}', 0.85)">🔊 再聽一次</button>
      <button class="btn ${isLearned ? '' : 'btn-primary'}" onclick="toggleKanaLearned('${escapeHtml(item.h)}', '${type}', ${idx})">
        ${isLearned ? '✅ 已標記熟記 (點擊取消)' : '✔️ 標記為已記住 (+5 XP)'}
      </button>
      <button class="btn" onclick="document.getElementById('kanaModal').style.display='none'">關閉</button>
    </div>
  `;
  modal.style.display = "flex";
}

function toggleKanaLearned(hChar, type, idx) {
  if (!STATE.learnedKana) STATE.learnedKana = {};
  if (STATE.learnedKana[hChar]) {
    delete STATE.learnedKana[hChar];
  } else {
    STATE.learnedKana[hChar] = true;
    addXP(5);
  }
  saveState();
  document.getElementById("kanaModal").style.display = "none";
  renderKanaView();
}

// ============================================================================
// 5. View 3: 情境對話模擬器 & 口說跟讀 (Conversation Simulator)
// ============================================================================
function renderConvView() {
  const container = document.getElementById("view-conv");
  const scenario = CONVERSATIONS.find(c => c.id === CURRENT_SCENARIO_ID) || CONVERSATIONS[0];
  const isDone = STATE.completedScenarios && STATE.completedScenarios[scenario.id];

  container.innerHTML = `
    <div class="card">
      <div class="section-header">
        <div>
          <h2 class="section-title">💬 真實情境對話模擬器</h2>
          <div style="font-size:0.78rem;color:var(--muted)">支援「🔊 正常語速」、「🐢 0.75倍慢速分解」與「🎙️ 手機麥克風開口跟讀」</div>
        </div>
        <button class="btn btn-sm ${SHOW_ROMAJI ? 'btn-accent' : ''}" onclick="SHOW_ROMAJI=!SHOW_ROMAJI;renderConvView()">
          ${SHOW_ROMAJI ? '🔤 隱藏羅馬拼音' : '🔤 顯示羅馬拼音'}
        </button>
      </div>

      <div class="chip-group">
        ${CONVERSATIONS.map(c => `
          <button class="chip ${c.id === scenario.id ? 'active' : ''}" onclick="CURRENT_SCENARIO_ID='${c.id}';renderConvView()">
            [${c.level}] ${escapeHtml(c.title)} ${STATE.completedScenarios && STATE.completedScenarios[c.id] ? '✅' : ''}
          </button>
        `).join("")}
      </div>

      <div style="background:rgba(15,23,42,0.65);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <span class="jlpt-badge lvl-${scenario.level}">JLPT ${escapeHtml(scenario.level)}</span>
          <strong style="margin-left:6px;font-size:0.98rem">${escapeHtml(scenario.title)}</strong>
          <div style="font-size:0.78rem;color:var(--muted);margin-top:3px">情境：${escapeHtml(scenario.situation)}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm btn-primary" onclick="playAllScenarioLines()">▶️ 連續播放整段對話</button>
          <button class="btn btn-sm ${isDone ? 'btn-accent' : ''}" onclick="markScenarioDone('${scenario.id}')">
            ${isDone ? '✅ 已完成練習' : '✔️ 完成此對話 (+20 XP)'}
          </button>
        </div>
      </div>

      <div class="chat-list">
        ${scenario.lines.map((ln, idx) => `
          <div class="chat-bubble ${ln.role === 'B' ? 'role-b' : ''}">
            <div class="chat-speaker">
              <span>${ln.role === 'B' ? '🗣️ ' : '👤 '}${escapeHtml(ln.speaker)}</span>
              <div style="display:flex;gap:6px">
                <button class="btn btn-sm btn-accent" onclick="speakJP('${escapeHtml(ln.jp)}', 1.0);addXP(2)">🔊 正常</button>
                <button class="btn btn-sm" onclick="speakJP('${escapeHtml(ln.jp)}', 0.72);addXP(2)">🐢 慢速</button>
                <button class="btn btn-sm btn-primary" onclick="practiceShadowing('${escapeHtml(ln.jp)}', 'shadow-res-${idx}')">🎙️ 跟讀</button>
              </div>
            </div>
            <div class="chat-jp">${escapeHtml(ln.jp)}</div>
            <div class="chat-kana">${escapeHtml(ln.kana)}</div>
            ${SHOW_ROMAJI ? `<div class="chat-romaji">${escapeHtml(ln.romaji)}</div>` : ''}
            <div class="chat-zh">${escapeHtml(ln.zh)}</div>
            <div class="chat-tip">💡 <strong>句型解析：</strong>${escapeHtml(ln.tip)}</div>
            <div id="shadow-res-${idx}" style="display:none;margin-top:8px;font-size:0.8rem;background:#090d16;padding:8px 10px;border-radius:8px"></div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function playAllScenarioLines() {
  const scenario = CONVERSATIONS.find(c => c.id === CURRENT_SCENARIO_ID) || CONVERSATIONS[0];
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  scenario.lines.forEach(ln => {
    const u = new SpeechSynthesisUtterance(ln.jp);
    u.lang = "ja-JP";
    u.rate = 0.92;
    if (JP_VOICE) u.voice = JP_VOICE;
    window.speechSynthesis.speak(u);
  });
  addXP(10);
}

function markScenarioDone(scId) {
  if (!STATE.completedScenarios) STATE.completedScenarios = {};
  if (!STATE.completedScenarios[scId]) {
    STATE.completedScenarios[scId] = true;
    addXP(20);
  }
  saveState();
  renderConvView();
}

// ============================================================================
// 6. View 4: SRS 單字閃卡 & N5~N1 文法百科 (SRS Flashcards & Grammar)
// ============================================================================
function getFilteredVocab() {
  if (CURRENT_JLPT_FILTER === "all") return VOCAB_LIST;
  return VOCAB_LIST.filter(v => v.level === CURRENT_JLPT_FILTER);
}

function getFilteredGrammar() {
  if (CURRENT_JLPT_FILTER === "all" || CURRENT_JLPT_FILTER === "zero") return GRAMMAR_LIST;
  return GRAMMAR_LIST.filter(g => g.level === CURRENT_JLPT_FILTER);
}

function renderCardsView() {
  const container = document.getElementById("view-cards");
  const levels = [
    { id: "all", label: "全部等級 (All)" },
    { id: "zero", label: "🌱 零基礎必背" },
    { id: "N5", label: "N5 基礎" },
    { id: "N4", label: "N4 日常" },
    { id: "N3", label: "N3 核心" },
    { id: "N2", label: "N2 商務" },
    { id: "N1", label: "🔥 N1 攻頂" }
  ];

  const vList = getFilteredVocab();
  if (CURRENT_CARD_INDEX >= vList.length) CURRENT_CARD_INDEX = 0;
  const curCard = vList[CURRENT_CARD_INDEX] || VOCAB_LIST[0];
  const srsInfo = (STATE.srsDeck && STATE.srsDeck[curCard.id]) || { box: 0, reps: 0 };

  let bodyHtml = "";
  if (CARDS_SUBTAB === "vocab") {
    bodyHtml = `
      <div class="flashcard-box" onclick="if(!CARD_FLIPPED){CARD_FLIPPED=true;speakJP('${escapeHtml(curCard.word)}', 0.95);renderCardsView();}">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span class="jlpt-badge lvl-${curCard.level}">JLPT ${escapeHtml(curCard.level.toUpperCase())} · ${escapeHtml(curCard.pos)}</span>
          <span style="font-size:0.76rem;color:var(--muted)">卡片 ${CURRENT_CARD_INDEX + 1} / ${vList.length} (熟練度 Lv.${srsInfo.box || 0})</span>
        </div>

        <div>
          <div class="fc-word">${escapeHtml(curCard.word)}</div>
          <div class="fc-reading">${escapeHtml(curCard.reading)}</div>
          <div class="fc-romaji">${escapeHtml(curCard.romaji)}</div>
          <div style="margin-top:10px;display:flex;justify-content:center;gap:8px" onclick="event.stopPropagation()">
            <button class="btn btn-sm btn-accent" onclick="speakJP('${escapeHtml(curCard.word)}', 0.95)">🔊 聽單字發音</button>
            <button class="btn btn-sm" onclick="speakJP('${escapeHtml(curCard.exJp)}', 0.9)">🔊 聽例句發音</button>
          </div>
        </div>

        ${CARD_FLIPPED ? `
          <div class="fc-answer" onclick="event.stopPropagation()">
            <div class="fc-meaning">${escapeHtml(curCard.meaning)}</div>
            <div class="fc-example">
              <div style="color:#fff;font-weight:700">${escapeHtml(curCard.exJp)}</div>
              <div style="color:var(--muted);font-size:0.8rem;margin-top:2px">${escapeHtml(curCard.exZh)}</div>
            </div>
          </div>
        ` : `
          <div style="padding:16px 0;color:var(--accent);font-size:0.86rem;font-weight:600">
            👆 點擊卡片翻面看中文解釋與例句
          </div>
        `}
      </div>

      ${CARD_FLIPPED ? `
        <div class="srs-buttons">
          <button class="srs-btn srs-again" onclick="gradeCard('${curCard.id}', 1)">😵 忘記了<br><span style="font-size:0.68rem">1分鐘後重現</span></button>
          <button class="srs-btn srs-hard" onclick="gradeCard('${curCard.id}', 2)">🤔 有點模糊<br><span style="font-size:0.68rem">+5 XP</span></button>
          <button class="srs-btn srs-good" onclick="gradeCard('${curCard.id}', 3)">😊 記住了<br><span style="font-size:0.68rem">+10 XP</span></button>
          <button class="srs-btn srs-easy" onclick="gradeCard('${curCard.id}', 4)">⚡ 秒答熟練<br><span style="font-size:0.68rem">+15 XP</span></button>
        </div>
      ` : `
        <div style="display:flex;gap:8px">
          <button class="btn" style="flex:1" onclick="prevCard()">⬅️ 上一張</button>
          <button class="btn btn-primary" style="flex:2" onclick="CARD_FLIPPED=true;speakJP('${escapeHtml(curCard.word)}', 0.95);renderCardsView()">翻開答案 👁️</button>
          <button class="btn" style="flex:1" onclick="nextCard()">下一張 ➡️</button>
        </div>
      `}
    `;
  } else {
    const gList = getFilteredGrammar();
    bodyHtml = `
      <div style="display:flex;flex-direction:column;gap:12px">
        ${gList.map(g => `
          <div class="card" style="margin-bottom:0">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
              <span class="jlpt-badge lvl-${g.level}">JLPT ${escapeHtml(g.level)} 核心文法</span>
              <button class="btn btn-sm btn-accent" onclick="speakJP('${escapeHtml(g.exJp)}', 0.92);addXP(3)">🔊 聽例句</button>
            </div>
            <div style="font-size:1.15rem;font-weight:800;color:#fde047;margin:8px 0 4px">${escapeHtml(g.pattern)}</div>
            <div style="font-size:0.95rem;font-weight:700;color:var(--accent);margin-bottom:6px">意思：${escapeHtml(g.meaning)}</div>
            <div style="font-size:0.78rem;color:#cbd5e1;background:#090d16;padding:6px 10px;border-radius:8px;margin-bottom:8px">
              <strong>🔗 接續：</strong>${escapeHtml(g.connection)}
            </div>
            <div style="font-size:0.83rem;color:#e2e8f0;margin-bottom:8px">💡 <strong>語感與考點：</strong>${escapeHtml(g.nuance)}</div>
            <div style="background:rgba(56,189,248,0.08);border-left:3px solid var(--accent);padding:8px 10px;border-radius:0 8px 8px 0;font-size:0.84rem">
              <div style="font-weight:700;color:#fff">${escapeHtml(g.exJp)}</div>
              <div style="color:var(--muted);margin-top:2px">${escapeHtml(g.exZh)}</div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  container.innerHTML = `
    <div class="card">
      <div class="section-header">
        <h2 class="section-title">🗂️ SRS 記憶閃卡 & N5~N1 文法庫</h2>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm ${CARDS_SUBTAB === 'vocab' ? 'btn-primary' : ''}" onclick="CARDS_SUBTAB='vocab';renderCardsView()">🗂️ 單字閃卡 (${VOCAB_LIST.length})</button>
          <button class="btn btn-sm ${CARDS_SUBTAB === 'grammar' ? 'btn-primary' : ''}" onclick="CARDS_SUBTAB='grammar';renderCardsView()">📘 N5~N1 文法 (${GRAMMAR_LIST.length})</button>
        </div>
      </div>

      <div class="chip-group">
        ${levels.map(lv => `
          <button class="chip ${CURRENT_JLPT_FILTER === lv.id ? 'active' : ''}" onclick="CURRENT_JLPT_FILTER='${lv.id}';CURRENT_CARD_INDEX=0;CARD_FLIPPED=false;renderCardsView()">
            ${escapeHtml(lv.label)}
          </button>
        `).join("")}
      </div>

      ${bodyHtml}
    </div>
  `;
}

function gradeCard(vocabId, grade) {
  if (!STATE.srsDeck) STATE.srsDeck = {};
  const prev = STATE.srsDeck[vocabId] || { box: 0, reps: 0 };
  const newBox = grade === 1 ? 1 : Math.min(5, (prev.box || 0) + (grade >= 3 ? 1 : 0));
  STATE.srsDeck[vocabId] = {
    box: newBox,
    reps: (prev.reps || 0) + 1,
    lastGrade: grade,
    updatedAt: Date.now()
  };
  addXP(grade === 1 ? 2 : grade * 4);
  nextCard();
}

function nextCard() {
  const vList = getFilteredVocab();
  CURRENT_CARD_INDEX = (CURRENT_CARD_INDEX + 1) % Math.max(1, vList.length);
  CARD_FLIPPED = false;
  renderCardsView();
}

function prevCard() {
  const vList = getFilteredVocab();
  CURRENT_CARD_INDEX = (CURRENT_CARD_INDEX - 1 + vList.length) % Math.max(1, vList.length);
  CARD_FLIPPED = false;
  renderCardsView();
}

// ============================================================================
// 7. View 5: 綜合闖關測驗 & N1 檢定模擬 (JLPT Quiz Arena)
// ============================================================================
function buildQuizList() {
  const pool = QUIZ_BANK.filter(q => QUIZ_LEVEL_FILTER === "all" || q.level === QUIZ_LEVEL_FILTER);
  return pool.map(q => {
    const opts = q.options.map((text, idx) => ({ text, isCorrect: idx === q.answer }));
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
    }
    return { ...q, shuffledOptions: opts };
  });
}

function startNewQuiz(levelFilter = QUIZ_LEVEL_FILTER) {
  QUIZ_LEVEL_FILTER = levelFilter;
  ACTIVE_QUIZ_LIST = buildQuizList();
  QUIZ_INDEX = 0;
  QUIZ_SCORE = 0;
  QUIZ_ANSWERED = false;
  renderQuizView();
}

function renderQuizView() {
  const container = document.getElementById("view-quiz");
  if (!ACTIVE_QUIZ_LIST.length) {
    ACTIVE_QUIZ_LIST = buildQuizList();
  }

  const levels = [
    { id: "all", label: "綜合挑戰 (零基礎~N1)" },
    { id: "zero", label: "🔤 五十音與生存" },
    { id: "N5", label: "N5 會話" },
    { id: "N4", label: "N4 文法" },
    { id: "N3", label: "N3 敬語" },
    { id: "N2", label: "N2 商務" },
    { id: "N1", label: "🔥 N1 模擬題" }
  ];

  if (QUIZ_INDEX >= ACTIVE_QUIZ_LIST.length) {
    const pct = Math.round((QUIZ_SCORE / Math.max(1, ACTIVE_QUIZ_LIST.length)) * 100);
    container.innerHTML = `
      <div class="card" style="text-align:center;padding:28px 18px">
        <div style="font-size:3rem">🏆</div>
        <h2 style="margin:8px 0">闖關完成！得分：${QUIZ_SCORE} / ${ACTIVE_QUIZ_LIST.length} (${pct}%)</h2>
        <p style="color:var(--muted);font-size:0.9rem">持續透過語音跟讀與閃卡複習，從日常會話一路邁向 JLPT N1！</p>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:16px">
          <button class="btn btn-primary" onclick="startNewQuiz('${QUIZ_LEVEL_FILTER}')">🔄 再挑戰一次</button>
          <button class="btn btn-accent" onclick="switchTab('cards')">🗂️ 前往複習閃卡</button>
        </div>
      </div>
    `;
    return;
  }

  const q = ACTIVE_QUIZ_LIST[QUIZ_INDEX];

  container.innerHTML = `
    <div class="card">
      <div class="section-header">
        <h2 class="section-title">🏆 日語實力闖關 & JLPT N1 模擬考</h2>
        <span style="font-size:0.8rem;color:var(--accent);font-weight:700">第 ${QUIZ_INDEX + 1} / ${ACTIVE_QUIZ_LIST.length} 題 · 得分 ${QUIZ_SCORE}</span>
      </div>

      <div class="chip-group">
        ${levels.map(lv => `
          <button class="chip ${QUIZ_LEVEL_FILTER === lv.id ? 'active' : ''}" onclick="startNewQuiz('${lv.id}')">
            ${escapeHtml(lv.label)}
          </button>
        `).join("")}
      </div>

      <div style="background:rgba(15,23,42,0.75);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span class="jlpt-badge lvl-${q.level}">難度：${escapeHtml(q.level.toUpperCase())}</span>
          ${q.audioText ? `<button class="btn btn-sm btn-accent" onclick="speakJP('${escapeHtml(q.audioText)}', 0.92)">🔊 聽日文發音</button>` : ''}
        </div>
        <div style="font-size:1.08rem;font-weight:700;color:#fff">${escapeHtml(q.question)}</div>
      </div>

      <div id="quizOptionsBox">
        ${q.shuffledOptions.map((opt, idx) => `
          <button class="quiz-option" id="qopt-${idx}" onclick="submitQuizAnswer(${idx})">
            ${idx + 1}. ${escapeHtml(opt.text)}
          </button>
        `).join("")}
      </div>

      <div id="quizExplainBox" style="display:none;background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.35);border-radius:12px;padding:14px;margin-top:12px">
        <div id="quizResultTitle" style="font-weight:800;margin-bottom:4px"></div>
        <div style="font-size:0.86rem;color:#e2e8f0">💡 <strong>詳解：</strong>${escapeHtml(q.explanation)}</div>
        <div style="margin-top:12px;text-align:right">
          <button class="btn btn-primary" onclick="QUIZ_INDEX++;QUIZ_ANSWERED=false;renderQuizView()">下一題 ➡️</button>
        </div>
      </div>
    </div>
  `;
}

function submitQuizAnswer(optIdx) {
  if (QUIZ_ANSWERED) return;
  QUIZ_ANSWERED = true;
  const q = ACTIVE_QUIZ_LIST[QUIZ_INDEX];
  const chosen = q.shuffledOptions[optIdx];
  if (q.audioText) speakJP(q.audioText, 0.95);

  q.shuffledOptions.forEach((opt, i) => {
    const btn = document.getElementById("qopt-" + i);
    if (!btn) return;
    if (opt.isCorrect) btn.classList.add("correct");
    else if (i === optIdx) btn.classList.add("wrong");
  });

  const expBox = document.getElementById("quizExplainBox");
  const titleEl = document.getElementById("quizResultTitle");
  if (chosen && chosen.isCorrect) {
    QUIZ_SCORE++;
    addXP(15);
    if (titleEl) {
      titleEl.style.color = "#4ade80";
      titleEl.textContent = "✅ 答對了！ (+15 XP)";
    }
  } else {
    addXP(5);
    if (titleEl) {
      titleEl.style.color = "#f87171";
      titleEl.textContent = "❌ 答錯了，看下方詳解記起來吧！ (+5 XP)";
    }
  }
  if (expBox) expBox.style.display = "block";
}

// ============================================================================
// 8. Initialization & PWA Service Worker Registration
// ============================================================================
window.addEventListener("DOMContentLoaded", () => {
  initJapaneseVoice();
  updateHeaderStats();
  renderHomeView();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
});
