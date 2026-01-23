// くじ引き結果
const results = [
  "スゥ",
  "まてぅもと",
  "黒川様",
  "たぬきち",
  "李",
  "みねやま",
  "かねこ"
];

const EFFECTS = {
  RAINBOW_CONFETTI: "rainbow_confetti",
  FAKE_STOP: "fake_stop",
  BLACKOUT_RESPIN: "blackout_respin"
};

let isSpinning = false;

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function setText(el, text) {
  if (!el) return;
  el.textContent = text;
}

function fadeIn(el, durationMs) {
  if (!el) return;
  el.style.opacity = "0";
  el.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: durationMs,
    easing: "ease-out",
    fill: "forwards"
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setStage("setup");
  renderParticipants();
  bindParticipantButtons();
  updateSelectedCount();
});

function setStage(stage) {
  document.body.classList.remove("stage-setup", "stage-roulette", "stage-result");
  document.body.classList.add(`stage-${stage}`);

  const startText = qs("#startButton .btn-text-gradient--gold");
  if (startText) {
    startText.textContent = stage === "result" ? "もう一度" : "スタート";
  }
}

function renderParticipants() {
  const root = qs("#participants");
  if (!root) return;
  root.innerHTML = "";

  results.forEach((name, idx) => {
    const id = `p_${idx}`;

    const label = document.createElement("label");
    label.className = "check-item";
    label.htmlFor = id;
    label.setAttribute("data-off", "false");

    const input = document.createElement("input");
    input.id = id;
    input.type = "checkbox";
    input.checked = true;
    input.dataset.name = name;

    const span = document.createElement("span");
    span.textContent = name;

    input.addEventListener("change", () => {
      const isOn = input.checked;
      label.setAttribute("data-off", (!isOn).toString());
      updateSelectedCount();
    });

    label.appendChild(input);
    label.appendChild(span);
    root.appendChild(label);
  });
}

function bindParticipantButtons() {
  const btnAll = qs("#selectAll");
  const btnNone = qs("#selectNone");

  if (btnAll) {
    btnAll.addEventListener("click", () => {
      qsa('#participants input[type="checkbox"]').forEach((input) => {
        input.checked = true;
        input.dispatchEvent(new Event("change"));
      });
    });
  }

  if (btnNone) {
    btnNone.addEventListener("click", () => {
      qsa('#participants input[type="checkbox"]').forEach((input) => {
        input.checked = false;
        input.dispatchEvent(new Event("change"));
      });
    });
  }
}

function updateSelectedCount() {
  const count = getSelectedParticipants().length;
  const el = qs("#selectedCount");
  setText(el, String(count));
}

function getSelectedParticipants() {
  return qsa('#participants input[type="checkbox"]:checked').map((input) => input.dataset.name);
}

function pickEffect() {
  const rand = Math.random();

  // 10%: 暗転して再抽選
  if (rand < 0.10) {
    return EFFECTS.BLACKOUT_RESPIN;
  }
  // 18%: レインボー+紙吹雪
  else if (rand < 0.28) {
    return EFFECTS.RAINBOW_CONFETTI;
  }
  // 25%: フェイント演出（止まりそうで別の人）
  else if (rand < 0.53) {
    return EFFECTS.FAKE_STOP;
  }
  // 47%: 演出なし
  return null;
}

function setButtonDisabled(disabled) {
  const btn = qs("#startButton");
  if (!btn) return;
  if (disabled) {
    btn.classList.add("disabled");
    btn.setAttribute("aria-disabled", "true");
  } else {
    btn.classList.remove("disabled");
    btn.removeAttribute("aria-disabled");
  }
}

function resetEffects() {
  qsa("#confetti").forEach((el) => {
    el.classList.remove("active");
  });
  document.body.classList.remove("fx-zoom", "fx-glitch");
  const container = qs(".container");
  if (container) container.classList.remove("fx-shake", "is-spinning");

  const confetti = qs("#confetti");
  if (confetti) confetti.innerHTML = "";
}

function triggerEffect(effect, phase) {
  // レインボー+紙吹雪演出のみ（結果表示時）
  if (!effect) return;

  if (effect === EFFECTS.RAINBOW_CONFETTI && phase === "post") {
    // 紙吹雪
    spawnConfetti();
  }
}

function spawnConfetti() {
  const layer = qs("#confetti");
  if (!layer) return;
  layer.classList.add("active");
  layer.innerHTML = "";

  const colors = ["#ffce08", "#ff4f8a", "#6ad4ff", "#7cff6a", "#ffffff"];
  const pieceCount = 90;

  for (let i = 0; i < pieceCount; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const drift = (Math.random() - 0.5) * 160;
    const drift2 = (Math.random() - 0.5) * 160;
    const duration = 1100 + Math.random() * 900;
    const delay = Math.random() * 120;

    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${left}vw`;
    piece.style.top = "-20px";
    piece.style.background = color;
    piece.style.setProperty("--x", `${drift}px`);
    piece.style.setProperty("--x2", `${drift2}px`);
    piece.style.setProperty("--d", `${duration}ms`);
    piece.style.animationDelay = `${delay}ms`;
    layer.appendChild(piece);
  }

  setTimeout(() => {
    layer.classList.remove("active");
    layer.innerHTML = "";
  }, 2100);
}

function buildRouletteItems(selected, finalResult) {
  const items = [];
  const minSpins = 50;
  const baseCount = Math.max(minSpins, selected.length * 12);

  // 停止位置の下に「続き」が見えるように末尾に余白を作る
  const tailPadding = 6; // 3以上（要望）+ 余裕
  const total = baseCount + tailPadding;

  // 各名前が均等に登場するように配分
  const countPerPerson = Math.floor(total / selected.length);
  const remainder = total % selected.length;

  // 各名前の出現回数を配列で管理
  const pool = [];
  for (let i = 0; i < selected.length; i++) {
    const count = countPerPerson + (i < remainder ? 1 : 0);
    for (let j = 0; j < count; j++) {
      pool.push(selected[i]);
    }
  }

  // 連続しないようにシャッフルしながら配置
  let lastPicked = null;
  for (let i = 0; i < total; i++) {
    // 前回と異なる候補を取得
    const candidates = pool.filter(name => name !== lastPicked);

    if (candidates.length === 0) {
      // 候補がない場合は仕方なく同じものを使う（通常は発生しない）
      const pickIndex = Math.floor(Math.random() * pool.length);
      items.push(pool[pickIndex]);
      lastPicked = pool[pickIndex];
      pool.splice(pickIndex, 1);
    } else {
      // ランダムに選択
      const pickIndex = Math.floor(Math.random() * candidates.length);
      const picked = candidates[pickIndex];
      items.push(picked);
      lastPicked = picked;

      // poolから削除
      const poolIndex = pool.indexOf(picked);
      pool.splice(poolIndex, 1);
    }
  }

  // 当たりを末尾に置かず、末尾から tailPadding 以上手前に埋め込む
  // これにより「最後の要素＝当たり」がバレなくなる
  const maxStopIndex = items.length - 1 - tailPadding;
  const minStopIndex = Math.min(20, maxStopIndex); // 序盤過ぎる停止を避ける
  const stopIndex = Math.floor(Math.random() * (maxStopIndex - minStopIndex + 1)) + minStopIndex;
  items[stopIndex] = finalResult;

  return { items, stopIndex };
}

function startRoulette() {
  if (isSpinning) return;

  const selected = getSelectedParticipants();
  if (selected.length === 0) {
    // 結果表示はしない仕様なので、ここはalertで通知
    alert("対象者が0人です（チェックを入れてください）");
    return;
  }

  isSpinning = true;
  setButtonDisabled(true);
  resetEffects();

  // スタート押下後は「ルーレットのみ」を表示
  setStage("roulette");

  const effect = pickEffect();
  const finalResult = selected[Math.floor(Math.random() * selected.length)];

  // 抽選中テキスト表示はしない（ルーレットのみ表示）
  const container = qs(".container");
  if (container) container.classList.add("is-spinning");

  // ルーレット項目生成
  const { items, stopIndex } = buildRouletteItems(selected, finalResult);
  const roll = qs("#rouletteRoll");
  if (!roll) {
    setButtonDisabled(false);
    isSpinning = false;
    return;
  }
  roll.innerHTML = "";

  items.forEach((name) => {
    const item = document.createElement("div");
    item.className = "roulette-item";
    item.textContent = name;
    roll.appendChild(item);
  });

  // 初期位置リセット
  const rollEl = roll;
  rollEl.style.transition = "none";
  rollEl.style.transform = "translateY(0px)";
  // reflow
  void rollEl.offsetHeight;

  // 演出（回転中）
  triggerEffect(effect, "pre");

  // 目標位置（中央のインジケーターに当たり要素が合う）
  const itemHeight = 72;
  const windowHeight = 280;
  const centerY = windowHeight / 2 - itemHeight / 2;
  const targetY = Math.round(centerY - stopIndex * itemHeight);

  // 暗転→再抽選演出の場合
  if (effect === EFFECTS.BLACKOUT_RESPIN) {
    // 第1回：フェイクの結果を選んでルーレット回転
    const fakeResult = selected[Math.floor(Math.random() * selected.length)];
    const { items: items1, stopIndex: stopIndex1 } = buildRouletteItems(selected, fakeResult);

    // 第1回のアイテムを生成
    roll.innerHTML = "";
    items1.forEach((name) => {
      const item = document.createElement("div");
      item.className = "roulette-item";
      item.textContent = name;
      roll.appendChild(item);
    });

    const targetY1 = Math.round(centerY - stopIndex1 * itemHeight);
    const duration1 = 2500;
    rollEl.style.transition = `transform ${duration1}ms cubic-bezier(0.12, 0.78, 0.12, 0.98)`;
    rollEl.style.transform = `translateY(${targetY1}px)`;

    // 第1回停止後に暗転開始
    setTimeout(() => {
      const fxBlackout = qs("#fxBlackout");
      if (fxBlackout) fxBlackout.classList.add("active");

      // 暗転中にルーレットリセット&本番の項目生成
      setTimeout(() => {
        // 本番のアイテムを生成
        roll.innerHTML = "";
        items.forEach((name) => {
          const item = document.createElement("div");
          item.className = "roulette-item";
          item.textContent = name;
          roll.appendChild(item);
        });

        // 初期位置にリセット
        rollEl.style.transition = "none";
        rollEl.style.transform = "translateY(0px)";
        void rollEl.offsetHeight;

        // 暗転解除してから第2回回転開始
        setTimeout(() => {
          if (fxBlackout) fxBlackout.classList.remove("active");

          const duration2 = 3000;
          rollEl.style.transition = `transform ${duration2}ms cubic-bezier(0.12, 0.78, 0.12, 0.98)`;
          rollEl.style.transform = `translateY(${targetY}px)`;

          // 結果表示
          setTimeout(() => {
            const container2 = qs(".container");
            if (container2) container2.classList.remove("is-spinning");
            showResult(finalResult, effect);
          }, duration2 + 120);
        }, 800); // 暗転解除後の待機
      }, 2500); // 暗転中
    }, duration1 + 200); // 第1回停止後
  } else if (effect === EFFECTS.FAKE_STOP) {
    // フェイク停止位置（本当の位置の1〜3個手前）
    const fakeOffset = Math.floor(Math.random() * 3) + 1;
    const fakeStopIndex = stopIndex - fakeOffset;
    const fakeTargetY = Math.round(centerY - fakeStopIndex * itemHeight);

    // 第1段階：フェイク位置まで減速（止まりそうに見せる）
    const duration1 = 2800;
    rollEl.style.transition = `transform ${duration1}ms cubic-bezier(0.12, 0.78, 0.25, 0.95)`;
    rollEl.style.transform = `translateY(${fakeTargetY}px)`;

    // 第2段階：少し待ってから本当の位置へ（サプライズ）
    setTimeout(() => {
      const duration2 = 800;
      rollEl.style.transition = `transform ${duration2}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
      rollEl.style.transform = `translateY(${targetY}px)`;

      // 結果表示
      setTimeout(() => {
        const container2 = qs(".container");
        if (container2) container2.classList.remove("is-spinning");
        showResult(finalResult, effect);
      }, duration2 + 120);
    }, duration1 + 400); // フェイク停止で少し止まる
  } else {
    // 通常演出
    const duration = effect ? 4200 : 3200;
    rollEl.style.transition = `transform ${duration}ms cubic-bezier(0.12, 0.78, 0.12, 0.98)`;
    rollEl.style.transform = `translateY(${targetY}px)`;

    // 結果表示
    setTimeout(() => {
      const container2 = qs(".container");
      if (container2) container2.classList.remove("is-spinning");
      showResult(finalResult, effect);
    }, duration + 120);
  }
}

function showResult(name, effect) {
  // 結果表示前の演出
  triggerEffect(effect, "post");

  // 結果確定後は結果表示と「もう一度」を表示（対象者選択は出さない）
  setStage("result");

  // 結果テキストは表示しない（中央停止の項目が結果）
  void name;

  // 後片付け
  setTimeout(() => {
    setButtonDisabled(false);
    isSpinning = false;
  }, 1000);
}

function getResult() {
  startRoulette();
}

// グローバルから呼べるように（onclick用）
window.startRoulette = startRoulette;

