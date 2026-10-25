const topbar = document.querySelector('.topbar');
const setTopbar = () => {
  if (!topbar) return;
  topbar.classList.toggle('is-scrolled', window.scrollY > 12);
};
window.addEventListener('scroll', setTopbar, { passive: true });
setTopbar();

document.querySelectorAll('.option').forEach((option) => {
  option.addEventListener('click', () => {
    const group = option.closest('.option-grid');
    if (!group) return;
    group.querySelectorAll('.option').forEach((item) => item.classList.remove('is-selected'));
    option.classList.add('is-selected');
  });
});

document.querySelectorAll('.text-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const group = tab.closest('.text-tabs');
    if (!group) return;
    group.querySelectorAll('.text-tab').forEach((item) => item.classList.remove('is-active'));
    tab.classList.add('is-active');
  });
});

document.querySelectorAll('.thumb').forEach((thumb) => {
  thumb.addEventListener('click', () => {
    const group = thumb.closest('.thumbs');
    if (!group) return;
    group.querySelectorAll('.thumb').forEach((item) => item.classList.remove('is-active'));
    thumb.classList.add('is-active');
  });
});

document.querySelectorAll('.qty').forEach((qty) => {
  const buttons = qty.querySelectorAll('button');
  const value = qty.querySelector('span');
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const current = Number(value.textContent || '1');
      const next = index === 0 ? Math.max(1, current - 1) : current + 1;
      value.textContent = String(next);
      updateBuyPricing();
    });
  });
});

const heroSlides = Array.from(document.querySelectorAll('.home-hero-slide'));
const heroProgressItems = Array.from(document.querySelectorAll('.hero-progress-item'));
let heroIndex = 0;
let heroTimer = null;

function setHeroSlide(nextIndex) {
  if (!heroSlides.length) return;
  heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, index) => {
    const video = slide.querySelector('video');
    const active = index === heroIndex;
    slide.classList.toggle('is-active', active);
    if (video) {
      if (active) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  });
  heroProgressItems.forEach((item, index) => {
    item.classList.toggle('is-active', index === heroIndex);
    const bar = item.querySelector('i');
    if (bar) {
      bar.style.animation = 'none';
      bar.offsetHeight;
      bar.style.animation = '';
    }
  });
}

function startHeroTimer() {
  if (!heroSlides.length) return;
  window.clearInterval(heroTimer);
  heroTimer = window.setInterval(() => setHeroSlide(heroIndex + 1), 6500);
}

heroProgressItems.forEach((item) => {
  item.addEventListener('click', () => {
    const target = Number(item.dataset.targetSlide || '0');
    setHeroSlide(target);
    startHeroTimer();
  });
});

const buyConfigTabs = Array.from(document.querySelectorAll('.buy-config-tab'));
const buyConfigPanels = Array.from(document.querySelectorAll('.buy-config-step'));
const buyNextStepButton = document.querySelector('[data-next-step]');
const cartCountNode = document.querySelector('[data-cart-count]');
const buyNextStepLabels = {
  frame: 'Choose Lens',
  lens: 'Prescription',
  prescription: 'Review'
};
let buySkipLensStep = false;
function setBuyConfigTab(target) {
  if (!target || !buyConfigTabs.length) return;
  if (target === 'lens' && buySkipLensStep) target = 'prescription';
  buyConfigTabs.forEach((tab) => {
    const active = tab.dataset.buyTab === target;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  buyConfigPanels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.buyPanel === target);
  });
  if (buyNextStepButton) {
    buyNextStepButton.textContent = target === 'frame' && buySkipLensStep
      ? 'Prescription'
      : buyNextStepLabels[target] || 'Review';
  }
}
buyConfigTabs.forEach((tab) => {
  tab.addEventListener('click', () => setBuyConfigTab(tab.dataset.buyTab));
});
if (buyNextStepButton) {
  buyNextStepButton.addEventListener('click', () => {
    const activeTab = buyConfigTabs.find((tab) => tab.classList.contains('is-active'));
    if (activeTab?.dataset.buyTab === 'prescription') {
      if (buyDetailsDrawer?.classList.contains('is-open')) {
        if (cartCountNode) {
          cartCountNode.hidden = false;
          cartCountNode.textContent = '1';
        }
        return;
      }
      setBuyDetails(true);
      buyNextStepButton.textContent = 'Add to Cart';
      return;
    }
    const activeIndex = buyConfigTabs.indexOf(activeTab);
    const nextTab = buyConfigTabs[Math.min(activeIndex + 1, buyConfigTabs.length - 1)];
    if (nextTab) setBuyConfigTab(nextTab.dataset.buyTab);
  });
}
if (buyConfigTabs.length) {
  setBuyConfigTab(buyConfigTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.buyTab || buyConfigTabs[0].dataset.buyTab);
}

const buyThumbs = Array.from(document.querySelectorAll('.buy-thumb'));
const buyImages = Array.from(document.querySelectorAll('.buy-product-image'));
const buyThumbStrip = document.querySelector('.buy-thumbs');
const buyAssetVersion = '20260726-lens-no-motion1';
const versionBuyAsset = (asset) => `${asset}?v=${buyAssetVersion}`;
const buyLensColorPrefixes = {
  Soul: 'DSC09941',
  Sage: 'DSC09936',
  Elite: 'DSC09939',
  Riley: 'DSC09940',
  Luna: '2-front-with-correct-temples',
  Quinn: 'DSC09935',
  Mogan: '8092b366-e5ae-4faf-b427-6d8bf50fc48e',
  Moses: 'DSC09931',
  Pilot: 'img_v3_02109-black-gold-double-bridge'
};
const buyLensColorSuffixes = {
  'Amber Orange': 'amber-orange',
  'Champagne Yellow': 'champagne-yellow',
  'Mocha Brown': 'mocha-brown',
  'Olive Green': 'olive-green',
  'Smoke Grey': 'smoke-grey'
};
const buyLensColorPreviewScales = {
  Pilot: {
    'Amber Orange': 0.922,
    'Champagne Yellow': 1.151,
    'Mocha Brown': 1,
    'Olive Green': 0.97,
    'Smoke Grey': 1.104
  }
};
const buyFrameGalleries = {
  Soul: ['assets/buy/frames/soul/2.png', 'assets/buy/frames/soul/5.png', 'assets/buy/frames/soul/3.jpg', 'assets/buy/frames/soul/4.jpg'],
  Sage: ['assets/buy/frames/sage/3.png', 'assets/buy/frames/sage/5.png', 'assets/buy/frames/sage/2.jpg', 'assets/buy/frames/sage/4.jpg'],
  Elite: ['assets/buy/frames/elite/2.png', 'assets/buy/frames/elite/5.png', 'assets/buy/frames/elite/3.jpg', 'assets/buy/frames/elite/4.jpg'],
  Riley: ['assets/buy/frames/riley/1.png', 'assets/buy/frames/riley/2.jpg', 'assets/buy/frames/riley/3.jpg', 'assets/buy/frames/riley/4.jpg'],
  Luna: ['assets/buy/frames/luna/2-front-with-correct-temples-white-render-v2.png', 'assets/buy/frames/luna/2.png', 'assets/buy/frames/luna/3.jpg', 'assets/buy/frames/luna/4.jpg'],
  Quinn: ['assets/buy/frames/quinn/2.png', 'assets/buy/frames/quinn/5.jpg', 'assets/buy/frames/quinn/3.jpg', 'assets/buy/frames/quinn/4.jpg'],
  Mogan: ['assets/buy/frames/mogan/2.png', 'assets/buy/frames/mogan/3.png', 'assets/buy/frames/mogan/5.jpg', 'assets/buy/frames/mogan/4.jpg'],
  Moses: ['assets/buy/frames/moses/2.png', 'assets/buy/frames/moses/5.png', 'assets/buy/frames/moses/3.jpg', 'assets/buy/frames/moses/4.jpg'],
  Pilot: ['assets/buy/frames/pilot/2.jpg', 'assets/buy/frames/pilot/3.jpg', 'assets/buy/frames/pilot/4.jpg', 'assets/buy/frames/pilot/5.jpg'],
  Shadow: ['assets/buy/frames/shadow/2 (2).png', 'assets/buy/frames/shadow/2.png', 'assets/buy/frames/shadow/3.jpg', 'assets/buy/frames/shadow/4.jpg'],
  Atlas: ['assets/buy/frames/atlas/2 (2).png', 'assets/buy/frames/atlas/2.png', 'assets/buy/frames/atlas/3.jpg', 'assets/buy/frames/atlas/4.jpg']
};
const buyOnlyFrameGalleries = {
  Soul: 'assets/buy/frames/soul/1.png',
  Sage: 'assets/buy/frames/sage/1.png',
  Elite: 'assets/buy/frames/elite/1.png',
  Riley: 'assets/buy/frames/riley/1.jpg',
  Luna: 'assets/buy/frames/luna/1.png',
  Quinn: 'assets/buy/frames/quinn/1.png',
  Mogan: 'assets/buy/frames/mogan/1.png',
  Moses: 'assets/buy/frames/moses/1.png',
  Pilot: 'assets/buy/frames/pilot/1.png',
  Shadow: 'assets/buy/frames/shadow/1.png',
  Atlas: 'assets/buy/frames/atlas/1.png'
};
let buyOnlyFrameMode = false;
let selectedBuyFrameName = 'Soul';
function getBuyFrameGallery(frameName, onlyFrame = false) {
  if (onlyFrame) {
    return [buyOnlyFrameGalleries[frameName] || buyOnlyFrameGalleries.Soul];
  }
  return buyFrameGalleries[frameName] || buyFrameGalleries.Soul;
}
function getBuyLensColorAsset(frameName, colorName) {
  const prefix = buyLensColorPrefixes[frameName];
  const suffix = buyLensColorSuffixes[colorName];
  if (!prefix || !suffix) return null;
  return `assets/buy/lens-colors/${prefix}-${suffix}.png`;
}
function syncBuyLensStep(frameName) {
  buySkipLensStep = frameName === 'Shadow' || frameName === 'Atlas';
  const lensTab = buyConfigTabs.find((tab) => tab.dataset.buyTab === 'lens');
  if (lensTab) {
    lensTab.hidden = buySkipLensStep;
    lensTab.disabled = buySkipLensStep;
    lensTab.setAttribute('aria-hidden', buySkipLensStep ? 'true' : 'false');
  }
  if (buySkipLensStep) {
    const transparentColor = document.querySelector('.buy-color[data-name="Transparent"]');
    document.querySelectorAll('.buy-color').forEach((color) => color.classList.remove('is-selected'));
    transparentColor?.classList.add('is-selected');
    const activeTab = buyConfigTabs.find((tab) => tab.classList.contains('is-active'));
    if (activeTab?.dataset.buyTab === 'lens') setBuyConfigTab('prescription');
  }
  const activeTab = buyConfigTabs.find((tab) => tab.classList.contains('is-active'));
  if (buyNextStepButton && activeTab?.dataset.buyTab === 'frame') {
    buyNextStepButton.textContent = buySkipLensStep ? 'Prescription' : buyNextStepLabels.frame;
  }
}
function applyBuyLensColorPreview(focusFirst = false) {
  const colorName = document.querySelector('.buy-color.is-selected')?.dataset.name || 'Transparent';
  const colorAsset = buyOnlyFrameMode ? null : getBuyLensColorAsset(selectedBuyFrameName, colorName);
  const fallbackAsset = getBuyFrameGallery(selectedBuyFrameName, buyOnlyFrameMode)[0];
  const previewAsset = colorAsset || fallbackAsset;
  const firstImage = buyImages[0];
  const firstThumbImage = buyThumbs[0]?.querySelector('img');
  const previewScale = colorAsset
    ? buyLensColorPreviewScales[selectedBuyFrameName]?.[colorName] || 1
    : 1;
  firstImage?.style.setProperty('--buy-preview-scale', String(previewScale));
  firstImage?.classList.add('is-lens-preview-image');
  firstThumbImage?.style.setProperty('--buy-preview-scale', String(previewScale));
  if (firstImage && previewAsset) {
    firstImage.src = versionBuyAsset(previewAsset);
    firstImage.alt = colorAsset
      ? `${selectedBuyFrameName} smart glasses with ${colorName} lenses`
      : `${selectedBuyFrameName} smart glasses front view`;
  }
  if (firstThumbImage && previewAsset) firstThumbImage.src = versionBuyAsset(previewAsset);
  if (focusFirst) setBuyImage('0');
}
function setBuyImage(target) {
  buyThumbs.forEach((thumb) => {
    thumb.classList.toggle('is-active', !thumb.hidden && thumb.dataset.buyThumb === target);
  });
  buyImages.forEach((image) => {
    image.classList.toggle('is-active', !image.hidden && image.dataset.buyImage === target);
  });
}
function updateBuyFrameGallery(frameName, onlyFrame = false) {
  selectedBuyFrameName = frameName;
  syncBuyLensStep(frameName);
  const gallery = getBuyFrameGallery(frameName, onlyFrame);
  buyThumbStrip?.classList.toggle('is-single', onlyFrame);
  buyImages.forEach((image, index) => {
    const asset = gallery[index];
    image.hidden = !asset;
    if (!asset) {
      image.classList.remove('is-active');
      return;
    }
    image.src = versionBuyAsset(asset);
    image.alt = onlyFrame
      ? `${frameName} optical frame front view`
      : `${frameName} smart glasses ${index === 0 ? 'front view' : `view ${index + 1}`}`;
  });
  buyThumbs.forEach((thumb, index) => {
    const asset = gallery[index];
    thumb.hidden = !asset;
    const img = thumb.querySelector('img');
    if (img && asset) img.src = versionBuyAsset(asset);
  });
  applyBuyLensColorPreview();
  setBuyImage('0');
}
buyThumbs.forEach((thumb) => {
  thumb.addEventListener('click', () => {
    if (!thumb.hidden) setBuyImage(thumb.dataset.buyThumb);
  });
});
document.querySelectorAll('.buy-option, .buy-pill, .buy-lens-item, .buy-color').forEach((option) => {
  option.addEventListener('click', () => {
    if (option.disabled) return;
    const group = option.parentElement;
    if (!group) return;
    group.querySelectorAll('.buy-option, .buy-pill, .buy-lens-item, .buy-color').forEach((item) => item.classList.remove('is-selected'));
    option.classList.add('is-selected');
    if (option.classList.contains('buy-color')) applyBuyLensColorPreview(true);
    updateBuyPricing();
  });
});

const addFrameChoices = Array.from(document.querySelectorAll('[data-add-frame]'));
const addFrameStyles = document.querySelector('.buy-add-frame-styles');
const addFrameStyleOptions = Array.from(document.querySelectorAll('.buy-add-frame-styles .buy-option'));
const onlyFrameOption = document.querySelector('[data-frame-type="only"]');
const frameTypeOptions = Array.from(document.querySelectorAll('[data-buy-panel="frame"] .buy-option-grid:not(.buy-add-frame-styles) .buy-option'));
function setAddFrameStyles(show) {
  if (!addFrameStyles) return;
  addFrameStyles.hidden = !show;
}
function getSelectedAddFrameStyle() {
  return addFrameStyleOptions.find((option) => option.classList.contains('is-selected'))?.textContent.trim() || 'Soul';
}
function setOnlyFrameAddFrameLock(locked) {
  const yesChoice = document.querySelector('[data-add-frame="yes"]');
  const noChoice = document.querySelector('[data-add-frame="no"]');
  if (!yesChoice || !noChoice) return;
  noChoice.disabled = locked;
  if (locked) {
    addFrameChoices.forEach((choice) => choice.classList.remove('is-selected'));
    yesChoice.classList.add('is-selected');
    setAddFrameStyles(true);
    updateBuyPricing();
  }
}
addFrameChoices.forEach((choice) => {
  choice.addEventListener('click', () => {
    if (choice.disabled) return;
    const addingFrame = choice.dataset.addFrame === 'yes';
    setAddFrameStyles(addingFrame);
    if (buyOnlyFrameMode && addingFrame) {
      updateBuyFrameGallery(getSelectedAddFrameStyle(), true);
    }
  });
});
setAddFrameStyles(!addFrameChoices.length || addFrameChoices.some((choice) => choice.classList.contains('is-selected') && choice.dataset.addFrame === 'yes'));
frameTypeOptions.forEach((option) => {
  option.addEventListener('click', () => {
    buyOnlyFrameMode = option.dataset.frameType === 'only';
    setOnlyFrameAddFrameLock(buyOnlyFrameMode);
    updateBuyFrameGallery(
      buyOnlyFrameMode ? getSelectedAddFrameStyle() : option.textContent.trim(),
      buyOnlyFrameMode
    );
    updateBuyPricing();
  });
});
addFrameStyleOptions.forEach((option) => {
  option.addEventListener('click', () => {
    if (buyOnlyFrameMode) {
      updateBuyFrameGallery(option.textContent.trim(), true);
      updateBuyPricing();
    }
  });
});
const initialFrameOption = frameTypeOptions.find((option) => option.classList.contains('is-selected')) || frameTypeOptions[0];
buyOnlyFrameMode = initialFrameOption?.dataset.frameType === 'only';
setOnlyFrameAddFrameLock(buyOnlyFrameMode);
updateBuyFrameGallery(
  buyOnlyFrameMode ? getSelectedAddFrameStyle() : initialFrameOption?.textContent.trim() || 'Soul',
  buyOnlyFrameMode
);
const prescriptionChoices = Array.from(document.querySelectorAll('[data-prescription]'));
const prescriptionUpload = document.querySelector('.buy-upload');
const freeLensOption = document.querySelector('[data-free-lens]');
function setPrescriptionUpload(show) {
  if (!prescriptionUpload) return;
  prescriptionUpload.hidden = !show;
  if (!freeLensOption) return;
  freeLensOption.hidden = show;
  if (show && freeLensOption.classList.contains('is-selected')) {
    const paidLensOption = document.querySelector('.buy-lens-item[data-price]:not([data-free-lens])');
    if (paidLensOption) {
      freeLensOption.classList.remove('is-selected');
      paidLensOption.classList.add('is-selected');
    }
  }
}
prescriptionChoices.forEach((choice) => {
  choice.addEventListener('click', () => setPrescriptionUpload(choice.dataset.prescription === 'single'));
});
setPrescriptionUpload(prescriptionChoices.some((choice) => choice.classList.contains('is-selected') && choice.dataset.prescription === 'single'));

const buyBasePrice = 180;
const buyTotalNodes = Array.from(document.querySelectorAll('[data-buy-total], [data-detail-total]'));
const detailBase = document.querySelector('[data-detail-base]');
const detailBaseName = document.querySelector('[data-detail-base-name]');
const detailAddFrame = document.querySelector('[data-detail-add-frame]');
const detailAddFrameName = document.querySelector('[data-detail-add-frame-name]');
const detailColor = document.querySelector('[data-detail-color]');
const detailColorName = document.querySelector('[data-detail-color-name]');
const detailLens = document.querySelector('[data-detail-lens]');
const detailLensName = document.querySelector('[data-detail-lens-name]');
const detailQuantity = document.querySelector('[data-detail-quantity]');
const buyColorPrice = document.querySelector('[data-color-price]');
function formatBuyPrice(value) {
  return `$${value}`;
}
function getSelectedPrice(selector) {
  const selected = document.querySelector(selector);
  return Number(selected?.dataset.price || 0);
}
function getSelectedName(selector, fallback) {
  const selected = document.querySelector(selector);
  return selected?.dataset.name || selected?.textContent?.trim() || fallback;
}
function updateBuyPricing() {
  if (!buyTotalNodes.length) return;
  const addFramePrice = getSelectedPrice('[data-add-frame].is-selected');
  const colorPrice = getSelectedPrice('.buy-color.is-selected');
  const lensPrice = getSelectedPrice('.buy-lens-item.is-selected');
  const baseFrameName = getSelectedName('[data-buy-panel="frame"] .buy-option-grid:not(.buy-add-frame-styles) .buy-option.is-selected', 'Soul');
  const addFrameChoice = document.querySelector('[data-add-frame].is-selected');
  const addFrameName = addFrameChoice?.dataset.addFrame === 'yes'
    ? getSelectedName('.buy-add-frame-styles .buy-option.is-selected', 'Soul')
    : 'No, thanks';
  const colorName = getSelectedName('.buy-color.is-selected', 'White');
  const lensName = getSelectedName('.buy-lens-item.is-selected', 'Blue Blocker Lens');
  const quantity = Number(document.querySelector('.buy-config-panel .qty span')?.textContent || 1);
  const unitTotal = buyBasePrice + addFramePrice + colorPrice + lensPrice;
  const total = unitTotal * quantity;
  buyTotalNodes.forEach((node) => { node.textContent = formatBuyPrice(total); });
  if (buyColorPrice) buyColorPrice.textContent = colorPrice ? `+${formatBuyPrice(colorPrice)}` : 'Free';
  if (detailBaseName) detailBaseName.textContent = baseFrameName;
  if (detailBase) detailBase.textContent = formatBuyPrice(buyBasePrice);
  if (detailAddFrameName) detailAddFrameName.textContent = addFrameName;
  if (detailAddFrame) detailAddFrame.textContent = addFramePrice ? `+${formatBuyPrice(addFramePrice)}` : "Free";
  if (detailColorName) detailColorName.textContent = colorName;
  if (detailColor) detailColor.textContent = colorPrice ? `+${formatBuyPrice(colorPrice)}` : "Free";
  if (detailLensName) detailLensName.textContent = lensName;
  if (detailLens) detailLens.textContent = lensPrice ? `+${formatBuyPrice(lensPrice)}` : "Free";
  if (detailQuantity) detailQuantity.textContent = String(quantity);
}
updateBuyPricing();
setOnlyFrameAddFrameLock(Boolean(onlyFrameOption?.classList.contains('is-selected')));

const buyDetailsToggle = document.querySelector('.buy-details-toggle');
const buyDetailsDrawer = document.querySelector('.buy-details-drawer');
const buyDetailsClose = document.querySelector('.buy-details-close');
function setBuyDetails(open) {
  if (!buyDetailsDrawer || !buyDetailsToggle) return;
  buyDetailsDrawer.classList.toggle('is-open', open);
  buyDetailsDrawer.setAttribute('aria-hidden', open ? 'false' : 'true');
  buyDetailsToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  const activeTab = buyConfigTabs.find((tab) => tab.classList.contains('is-active'));
  if (buyNextStepButton && activeTab?.dataset.buyTab === 'prescription') {
    buyNextStepButton.textContent = open ? 'Add to Cart' : 'Review';
  }
}
if (buyDetailsToggle) buyDetailsToggle.addEventListener('click', () => setBuyDetails(!buyDetailsDrawer?.classList.contains('is-open')));
if (buyDetailsClose) buyDetailsClose.addEventListener('click', () => setBuyDetails(false));

setHeroSlide(0);
startHeroTimer();

const subscribeFab = document.querySelector('.subscribe-fab');
const subscribeModal = document.querySelector('.subscribe-drawer');
const subscribeCloseButtons = document.querySelectorAll('.subscribe-close, .subscribe-link');

function openSubscribeModal() {
  if (!subscribeModal || !subscribeFab) return;
  subscribeModal.classList.add('is-open');
  subscribeModal.setAttribute('aria-hidden', 'false');
  subscribeFab.setAttribute('aria-expanded', 'true');
}

function closeSubscribeModal() {
  if (!subscribeModal || !subscribeFab) return;
  subscribeModal.classList.remove('is-open');
  subscribeModal.setAttribute('aria-hidden', 'true');
  subscribeFab.setAttribute('aria-expanded', 'false');
}

if (subscribeFab) {
  subscribeFab.addEventListener('click', () => {
    if (subscribeModal && subscribeModal.classList.contains('is-open')) {
      closeSubscribeModal();
    } else {
      openSubscribeModal();
    }
  });
}
subscribeCloseButtons.forEach((button) => button.addEventListener('click', closeSubscribeModal));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeSubscribeModal();
});


const familyTabs = Array.from(document.querySelectorAll('.family-tab'));
const familyPanels = Array.from(document.querySelectorAll('.family-product'));
const familyStage = document.querySelector('.family-stage');
const productFamilySection = document.querySelector('.product-family');
const familyPrev = document.querySelector('.family-arrow-prev');
const familyNext = document.querySelector('.family-arrow-next');
let familyIndex = Math.max(0, familyTabs.findIndex((tab) => tab.classList.contains('is-active')));

function setFamily(index) {
  if (!familyTabs.length) return;
  familyIndex = (index + familyTabs.length) % familyTabs.length;
  const target = familyTabs[familyIndex].dataset.family;
  if (familyStage && target) familyStage.dataset.activeFamily = target;
  if (productFamilySection && target) productFamilySection.dataset.activeFamily = target;
  familyTabs.forEach((tab, tabIndex) => tab.classList.toggle('is-active', tabIndex === familyIndex));
  familyPanels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.familyPanel === target);
  });
}

familyTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setFamily(index));
});
if (familyPrev) familyPrev.addEventListener('click', () => setFamily(familyIndex - 1));
if (familyNext) familyNext.addEventListener('click', () => setFamily(familyIndex + 1));

let familyDragStart = null;
if (familyStage) {
  familyStage.addEventListener('pointerdown', (event) => {
    familyDragStart = event.clientX;
    familyStage.classList.add('is-dragging');
  });
  familyStage.addEventListener('pointerup', (event) => {
    if (familyDragStart === null) return;
    const delta = event.clientX - familyDragStart;
    familyStage.classList.remove('is-dragging');
    familyDragStart = null;
    if (Math.abs(delta) < 48) return;
    setFamily(delta < 0 ? familyIndex + 1 : familyIndex - 1);
  });
  familyStage.addEventListener('pointerleave', () => {
    familyDragStart = null;
    familyStage.classList.remove('is-dragging');
  });
}
setFamily(familyIndex);
const scenarioTabs = Array.from(document.querySelectorAll('.scenario-tab'));
const scenarioPanels = Array.from(document.querySelectorAll('.scenario-panel'));
const scenarioLede = document.querySelector('.scenario-lede');

function setScenario(target) {
  if (!target || !scenarioTabs.length) return;
  scenarioTabs.forEach((tab) => {
    const active = tab.dataset.scenario === target;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  scenarioPanels.forEach((panel) => {
    const active = panel.dataset.scenarioPanel === target;
    panel.classList.toggle('is-active', active);
    if (active && scenarioLede) scenarioLede.textContent = panel.dataset.lede || '';
  });
}

scenarioTabs.forEach((tab) => {
  const activate = () => setScenario(tab.dataset.scenario);
  tab.addEventListener('mouseenter', activate);
  tab.addEventListener('focus', activate);
  tab.addEventListener('click', activate);
});
if (scenarioTabs.length) setScenario(scenarioTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.scenario || scenarioTabs[0].dataset.scenario);
const storiesOrbitCards = Array.from(document.querySelectorAll('.stories-orbit .story-card'));
if (storiesOrbitCards.length) {
  const storiesSection = document.querySelector('.stories-moments');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const updateStoriesByScroll = () => {
    if (!storiesSection || prefersReducedMotion) {
      storiesOrbitCards.forEach((card) => card.classList.add('is-visible'));
      return;
    }
    const sectionTop = storiesSection.getBoundingClientRect().top + window.scrollY;
    const progress = clamp((window.scrollY - sectionTop) / (window.innerHeight * 0.82), 0, 1);
    storiesOrbitCards.forEach((card, index) => {
      const start = index / storiesOrbitCards.length * 0.72;
      const itemProgress = clamp((progress - start) * 7.2, 0, 1);
      if (itemProgress > 0.02) {
        card.classList.add('is-visible');
      } else {
        card.classList.remove('is-visible');
      }
      card.style.setProperty('--story-opacity', itemProgress.toFixed(3));
      card.style.setProperty('--story-y', `${Math.round((1 - itemProgress) * 28)}px`);
      card.style.setProperty('--story-scale', (0.982 + itemProgress * 0.018).toFixed(3));
    });
  };
  updateStoriesByScroll();
  let storiesRaf = null;
  const tickStories = () => {
    updateStoriesByScroll();
    storiesRaf = window.requestAnimationFrame(tickStories);
  };
  storiesRaf = window.requestAnimationFrame(tickStories);
  window.addEventListener('scroll', updateStoriesByScroll, { passive: true });
  window.addEventListener('resize', updateStoriesByScroll);
}

const materialTrack = document.querySelector('.material-flow-track');
const materialViewport = document.querySelector('.material-flow-viewport');
const materialOriginalSlides = Array.from(document.querySelectorAll('[data-material-slide]'));
const materialDots = Array.from(document.querySelectorAll('.material-flow-dots button'));
const materialPrev = document.querySelector('.material-flow-prev');
const materialNext = document.querySelector('.material-flow-next');
let materialSlides = materialOriginalSlides;
let materialIndex = materialOriginalSlides.length ? 1 : 0;
let materialTimer = null;
let materialIsMoving = false;
let materialMoveFallback = null;

function prepareMaterialImages() {
  materialOriginalSlides.forEach((slide) => {
    slide.querySelectorAll('img').forEach((img) => {
      img.loading = 'eager';
      img.decoding = 'async';
      if (img.complete) return;
      img.addEventListener('load', () => updateMaterialFlow(false), { once: true });
      img.addEventListener('error', () => updateMaterialFlow(false), { once: true });
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {});
      }
    });
  });
}

function getMaterialRealIndex() {
  if (!materialOriginalSlides.length) return 0;
  return (materialIndex - 1 + materialOriginalSlides.length) % materialOriginalSlides.length;
}

function centerMaterialSlide(animate = true) {
  if (!materialTrack || !materialViewport || !materialSlides.length) return;
  const slide = materialSlides[materialIndex];
  const viewportRect = materialViewport.getBoundingClientRect();
  const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
  const offset = viewportRect.width / 2 - slideCenter;
  const arrowTop = slide.offsetTop + slide.offsetHeight / 2;
  [materialPrev, materialNext].forEach((arrow) => {
    if (arrow) arrow.style.top = `${arrowTop}px`;
  });
  materialTrack.style.transition = animate ? '' : 'none';
  materialTrack.style.transform = `translate3d(${offset}px, 0, 0)`;
  if (!animate) {
    materialTrack.offsetHeight;
    materialTrack.style.transition = '';
  }
}

function updateMaterialState() {
  const realIndex = getMaterialRealIndex();
  materialSlides.forEach((item, index) => item.classList.toggle('is-active', index === materialIndex));
  materialDots.forEach((dot, index) => dot.classList.toggle('is-active', index === realIndex));
}

function updateMaterialFlow(animate = true) {
  centerMaterialSlide(animate);
  updateMaterialState();
}

function normalizeMaterialLoop() {
  if (!materialOriginalSlides.length) return;
  if (materialIndex === 0) {
    materialIndex = materialOriginalSlides.length;
    updateMaterialFlow(false);
  } else if (materialIndex === materialSlides.length - 1) {
    materialIndex = 1;
    updateMaterialFlow(false);
  }
  materialIsMoving = false;
  window.clearTimeout(materialMoveFallback);
}

function setMaterialFlow(index, animate = true) {
  if (!materialSlides.length) return;
  if (animate && materialIsMoving) return;
  materialIndex = Math.max(0, Math.min(index, materialSlides.length - 1));
  materialIsMoving = animate;
  updateMaterialFlow(animate);
  window.clearTimeout(materialMoveFallback);
  if (animate) materialMoveFallback = window.setTimeout(normalizeMaterialLoop, 760);
}

function restartMaterialFlow() {
  if (!materialSlides.length) return;
  window.clearInterval(materialTimer);
  materialTimer = window.setInterval(() => setMaterialFlow(materialIndex + 1), 5200);
}

if (materialOriginalSlides.length && materialTrack) {
  prepareMaterialImages();
  const firstClone = materialOriginalSlides[0].cloneNode(true);
  const lastClone = materialOriginalSlides[materialOriginalSlides.length - 1].cloneNode(true);
  firstClone.setAttribute('aria-hidden', 'true');
  lastClone.setAttribute('aria-hidden', 'true');
  materialTrack.insertBefore(lastClone, materialOriginalSlides[0]);
  materialTrack.appendChild(firstClone);
  materialSlides = Array.from(materialTrack.querySelectorAll('.material-flow-card'));
  materialTrack.addEventListener('transitionend', normalizeMaterialLoop);
  materialDots.forEach((dot, index) => dot.addEventListener('click', () => {
    setMaterialFlow(index + 1);
    restartMaterialFlow();
  }));
  if (materialPrev) materialPrev.addEventListener('click', () => {
    setMaterialFlow(materialIndex - 1);
    restartMaterialFlow();
  });
  if (materialNext) materialNext.addEventListener('click', () => {
    setMaterialFlow(materialIndex + 1);
    restartMaterialFlow();
  });
  window.addEventListener('resize', () => updateMaterialFlow(false));
  updateMaterialFlow(false);
  restartMaterialFlow();
}

const notesAccordionItems = Array.from(document.querySelectorAll('.notes-accordion-item'));
const notesAccordionImages = Array.from(document.querySelectorAll('.notes-accordion-image'));
const notesMagicRings = document.querySelector('[data-magic-rings]');
const notesMagicVisual = notesMagicRings ? notesMagicRings.closest('.notes-accordion-visual') : null;
function setNotesAccordion(targetItem) {
  if (!targetItem) return;
  const targetIndex = targetItem.dataset.notesIndex || '0';
  if (notesMagicVisual) notesMagicVisual.classList.toggle('has-magic-rings', targetIndex === '1');
  notesAccordionItems.forEach((item) => {
    const open = item === targetItem;
    item.classList.toggle('is-open', open);
    const button = item.querySelector('button');
    if (button) button.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  notesAccordionImages.forEach((image) => {
    const active = image.dataset.notesImage === targetIndex;
    image.classList.toggle('is-active', active);
    if (image.tagName === 'VIDEO') {
      if (active) {
        image.play().catch(() => {});
      } else {
        image.pause();
      }
    }
  });
}
notesAccordionItems.forEach((item) => {
  const button = item.querySelector('button');
  if (button) button.addEventListener('click', () => setNotesAccordion(item));
});
if (notesAccordionItems.length) {
  setNotesAccordion(notesAccordionItems.find((item) => item.classList.contains('is-open')) || notesAccordionItems[0]);
}

function initNotesMagicRings(mount, options = {}) {
  if (!mount || !window.WebGLRenderingContext) return;
  const settings = {
    speed: .78,
    attenuation: 7.8,
    lineThickness: 1.85,
    baseRadius: .22,
    radiusStep: .075,
    scaleRate: .14,
    opacity: .96,
    noiseAmount: .018,
    rotation: -.34,
    ringGap: 1.35,
    fadeIn: .7,
    fadeOut: 2.75,
    hoverScale: 1.16,
    ringCount: 5,
    phaseStagger: 2.95,
    coreRadius: 0,
    outwardOnly: false,
    color: [.43, .22, 1],
    colorTwo: [.74, .62, 1],
    ...options
  };
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  mount.appendChild(canvas);
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false
  });
  if (!gl) return;

  const vertexSource = `
    attribute vec2 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;
  const fragmentSource = `
    precision highp float;
    uniform float uTime, uAttenuation, uLineThickness;
    uniform float uBaseRadius, uRadiusStep, uScaleRate;
    uniform float uOpacity, uNoiseAmount, uRotation, uRingGap;
    uniform float uFadeIn, uFadeOut;
    uniform float uHoverAmount, uHoverScale, uPhaseStagger, uCoreRadius;
    uniform vec2 uResolution;
    uniform vec3 uColor, uColorTwo;
    uniform int uRingCount, uOutwardOnly;
    const float HP = 1.5707963;
    const float CYCLE = 3.45;

    float fade(float t) {
      return t < uFadeIn ? smoothstep(0.0, uFadeIn, t) : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
    }

    float ring(vec2 p, float ri, float cut, float t0, float px) {
      float t = mod(uTime + t0, CYCLE);
      float r = ri + t / CYCLE * uScaleRate;
      float d = abs(length(p) - r);
      float a = atan(abs(p.y), abs(p.x)) / HP;
      float th = max(1.0 - a, 0.5) * px * uLineThickness;
      float h = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
      d += pow(cut * a, 3.0) * r;
      return h * exp(-uAttenuation * d) * fade(t);
    }

    void main() {
      float px = 1.0 / min(uResolution.x, uResolution.y);
      vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;
      float cr = cos(uRotation);
      float sr = sin(uRotation);
      p = mat2(cr, -sr, sr, cr) * p;
      p /= mix(1.0, uHoverScale, uHoverAmount);
      vec3 color = vec3(0.0);
      float glowMask = 0.0;
      float ringCount = max(float(uRingCount) - 1.0, 1.0);
      for (int i = 0; i < 8; i++) {
        if (i >= uRingCount) break;
        float fi = float(i);
        vec3 ringColor = mix(uColor, uColorTwo, fi / ringCount);
        float alpha = clamp(
          uOutwardOnly == 1 ? 0.0 : ring(p, uBaseRadius + fi * uRadiusStep, pow(uRingGap, fi), fi * uPhaseStagger, px),
          0.0,
          1.0
        );
        if (uOutwardOnly == 1) {
          float age = mod(uTime - fi * uPhaseStagger, CYCLE);
          float progress = age / CYCLE;
          float radius = uBaseRadius + progress * uScaleRate;
          float distanceToRing = abs(length(p) - radius);
          float angle = atan(abs(p.y), abs(p.x)) / HP;
          distanceToRing += pow(uRingGap * angle, 3.0) * radius;
          float thickness = max(1.0 - angle, 0.5) * px * uLineThickness;
          float line = 1.0 - smoothstep(thickness, thickness * 1.55, distanceToRing);
          float glow = exp(-uAttenuation * distanceToRing) * 0.7;
          float life = smoothstep(0.0, 0.08, progress) * (1.0 - smoothstep(0.72, 1.0, progress));
          float outwardFade = mix(1.0, 0.18, smoothstep(0.0, 1.0, progress));
          alpha = clamp((line + glow) * life * outwardFade, 0.0, 1.0);
        }
        color = mix(color, ringColor, vec3(alpha));
        glowMask = max(glowMask, alpha);
      }
      float core = 1.0 - smoothstep(uCoreRadius, uCoreRadius + px * 2.5, length(p));
      core *= step(0.0001, uCoreRadius);
      color = mix(color, uColor, core);
      glowMask = max(glowMask, core);
      float noise = fract(sin(dot(gl_FragCoord.xy + uTime * 48.0, vec2(12.9898, 78.233))) * 43758.5453);
      color = max(color + (noise - 0.5) * uNoiseAmount * glowMask, vec3(0.0));
      color = clamp(color, 0.0, 1.0);
      float intensity = max(color.r, max(color.g, color.b));
      float finalAlpha = smoothstep(0.55, 0.92, intensity) * uOpacity;
      if (finalAlpha < 0.008) discard;
      vec3 visibleColor = intensity > 0.0001 ? color / intensity : vec3(0.0);
      gl_FragColor = vec4(visibleColor, finalAlpha);
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1
  ]), gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, 'aPosition');
  const uniforms = {
    time: gl.getUniformLocation(program, 'uTime'),
    attenuation: gl.getUniformLocation(program, 'uAttenuation'),
    lineThickness: gl.getUniformLocation(program, 'uLineThickness'),
    baseRadius: gl.getUniformLocation(program, 'uBaseRadius'),
    radiusStep: gl.getUniformLocation(program, 'uRadiusStep'),
    scaleRate: gl.getUniformLocation(program, 'uScaleRate'),
    opacity: gl.getUniformLocation(program, 'uOpacity'),
    noiseAmount: gl.getUniformLocation(program, 'uNoiseAmount'),
    rotation: gl.getUniformLocation(program, 'uRotation'),
    ringGap: gl.getUniformLocation(program, 'uRingGap'),
    fadeIn: gl.getUniformLocation(program, 'uFadeIn'),
    fadeOut: gl.getUniformLocation(program, 'uFadeOut'),
    hoverAmount: gl.getUniformLocation(program, 'uHoverAmount'),
    hoverScale: gl.getUniformLocation(program, 'uHoverScale'),
    phaseStagger: gl.getUniformLocation(program, 'uPhaseStagger'),
    coreRadius: gl.getUniformLocation(program, 'uCoreRadius'),
    outwardOnly: gl.getUniformLocation(program, 'uOutwardOnly'),
    resolution: gl.getUniformLocation(program, 'uResolution'),
    color: gl.getUniformLocation(program, 'uColor'),
    colorTwo: gl.getUniformLocation(program, 'uColorTwo'),
    ringCount: gl.getUniformLocation(program, 'uRingCount')
  };

  let hovered = false;
  let hoverAmount = 0;
  const hoverTarget = mount.closest('.notes-accordion-visual') || mount;
  hoverTarget.addEventListener('mouseenter', () => { hovered = true; });
  hoverTarget.addEventListener('mouseleave', () => { hovered = false; });

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(mount.clientWidth * dpr));
    const height = Math.max(1, Math.floor(mount.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
    return { width, height };
  }

  gl.disable(gl.BLEND);
  gl.useProgram(program);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  function render(time) {
    const { width, height } = resize();
    hoverAmount += ((hovered ? 1 : 0) - hoverAmount) * 0.08;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uniforms.time, time * 0.001 * settings.speed);
    gl.uniform1f(uniforms.attenuation, settings.attenuation);
    gl.uniform1f(uniforms.lineThickness, settings.lineThickness);
    gl.uniform1f(uniforms.baseRadius, settings.baseRadius);
    gl.uniform1f(uniforms.radiusStep, settings.radiusStep);
    gl.uniform1f(uniforms.scaleRate, settings.scaleRate);
    gl.uniform1f(uniforms.opacity, settings.opacity);
    gl.uniform1f(uniforms.noiseAmount, settings.noiseAmount);
    gl.uniform1f(uniforms.rotation, settings.rotation);
    gl.uniform1f(uniforms.ringGap, settings.ringGap);
    gl.uniform1f(uniforms.fadeIn, settings.fadeIn);
    gl.uniform1f(uniforms.fadeOut, settings.fadeOut);
    gl.uniform1f(uniforms.hoverAmount, hoverAmount);
    gl.uniform1f(uniforms.hoverScale, settings.hoverScale);
    gl.uniform1f(uniforms.phaseStagger, settings.phaseStagger);
    gl.uniform1f(uniforms.coreRadius, settings.coreRadius);
    gl.uniform1i(uniforms.outwardOnly, settings.outwardOnly ? 1 : 0);
    gl.uniform2f(uniforms.resolution, width, height);
    gl.uniform3f(uniforms.color, ...settings.color);
    gl.uniform3f(uniforms.colorTwo, ...settings.colorTwo);
    gl.uniform1i(uniforms.ringCount, settings.ringCount);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
initNotesMagicRings(notesMagicRings);
const audioWaveRings = document.querySelector('[data-audio-wave-rings]');
initNotesMagicRings(audioWaveRings, {
  speed: .86,
  attenuation: 16,
  lineThickness: 1.55,
  baseRadius: .025,
  radiusStep: 0,
  scaleRate: .48,
  opacity: 1,
  noiseAmount: 0,
  rotation: 0,
  ringGap: .82,
  fadeIn: .45,
  fadeOut: 2.8,
  hoverScale: 1.2,
  ringCount: 4,
  phaseStagger: .72,
  coreRadius: 0,
  outwardOnly: true,
  color: [.66, .33, .97],
  colorTwo: [.39, .4, .95]
});

const assistantTabs = Array.from(document.querySelectorAll('.assistant-tab'));
const assistantPanels = Array.from(document.querySelectorAll('.assistant-panel'));
function setAssistantPanel(target) {
  if (!target || !assistantTabs.length) return;
  assistantTabs.forEach((tab) => {
    const active = tab.dataset.assistant === target;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  assistantPanels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.assistantPanel === target);
  });
}
assistantTabs.forEach((tab) => {
  tab.addEventListener('click', () => setAssistantPanel(tab.dataset.assistant));
});
if (assistantTabs.length) {
  setAssistantPanel(assistantTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.assistant || assistantTabs[0].dataset.assistant);
}

const reviewRatingButtons = Array.from(document.querySelectorAll('[data-user-rating]'));
const reviewRatingMessage = document.querySelector('[data-user-rating-message]');
reviewRatingButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const rating = Number(button.dataset.userRating || 0);
    reviewRatingButtons.forEach((item) => {
      item.classList.toggle('is-active', Number(item.dataset.userRating || 0) <= rating);
    });
    if (reviewRatingMessage) {
      reviewRatingMessage.textContent = `Thanks for rating ${rating} star${rating > 1 ? 's' : ''}.`;
    }
  });
});

const reviewMoreButton = document.querySelector('[data-review-more]');
const reviewList = document.querySelector('[data-review-list]');
if (reviewMoreButton && reviewList) {
  reviewMoreButton.addEventListener('click', () => {
    const open = reviewList.classList.toggle('is-open');
    reviewMoreButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    reviewMoreButton.textContent = open ? 'Less' : 'More';
  });
}

const reviewCommentModal = document.querySelector('#review-comment-modal');
const reviewCommentOpen = document.querySelector('[data-open-review-comment]');
const reviewCommentClose = document.querySelector('.review-comment-close');
const reviewCommentSubmit = document.querySelector('[data-submit-comment]');
const reviewCommentStars = Array.from(document.querySelectorAll('[data-comment-rating]'));
function setReviewCommentModal(open) {
  if (!reviewCommentModal) return;
  reviewCommentModal.classList.toggle('is-open', open);
  reviewCommentModal.setAttribute('aria-hidden', open ? 'false' : 'true');
}
reviewCommentOpen?.addEventListener('click', () => setReviewCommentModal(true));
reviewCommentClose?.addEventListener('click', () => setReviewCommentModal(false));
reviewCommentModal?.addEventListener('click', (event) => {
  if (event.target === reviewCommentModal) setReviewCommentModal(false);
});
reviewCommentStars.forEach((button) => {
  button.addEventListener('click', () => {
    const rating = Number(button.dataset.commentRating || 0);
    reviewCommentStars.forEach((item) => {
      item.classList.toggle('is-active', Number(item.dataset.commentRating || 0) <= rating);
    });
  });
});
reviewCommentSubmit?.addEventListener('click', () => {
  if (reviewRatingMessage) reviewRatingMessage.textContent = 'Thanks for your comment.';
  setReviewCommentModal(false);
});

// Codex ai agent orbit module
(() => {
  const module = document.querySelector('.ai-orbit');
  if (!module) return;

  const hero = module.querySelector('.hero-glasses');
  const cards = [...module.querySelectorAll('.float-card')];

  const prepareEntrance = () => {
    if (!hero || !cards.length) {
      module.classList.remove('is-entering');
      module.classList.add('is-ready');
      return;
    }

    const heroRect = hero.getBoundingClientRect();
    const originX = heroRect.left + heroRect.width / 2;
    const originY = heroRect.top + heroRect.height / 2;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardX = rect.left + rect.width / 2;
      const cardY = rect.top + rect.height / 2;
      card.style.setProperty('--scatter-x', `${originX - cardX}px`);
      card.style.setProperty('--scatter-y', `${originY - cardY}px`);
      card.style.setProperty('--intro-delay', `${(index % 7) * 34}ms`);
    });

    requestAnimationFrame(() => {
      module.classList.remove('is-entering');
      module.classList.add('is-ready');
    });
  };

  requestAnimationFrame(() => requestAnimationFrame(prepareEntrance));


  const setPlayback = (visible) => {
    module.classList.toggle('is-paused', !visible);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      ([entry]) => setPlayback(entry.isIntersecting),
      { threshold: 0.08 }
    );
    observer.observe(module);
  } else {
    setPlayback(true);
  }
})();
// Codex travel assistant module
(() => {
  const module = document.querySelector('.travel-space');
  if (!module) return;

  const scene = module.querySelector('.travel-space__scene');
  const cards = [...module.querySelectorAll('.travel-card')];
  const layers = [...module.querySelectorAll('.space-layer')];
  let activeCard = null;
  let lockedCard = null;
  let isDragging = false;
  let dragStart = null;

  module.querySelectorAll('.travel-card__front img').forEach((image) => {
    image.style.setProperty('--fallback-position', image.dataset.fallbackPosition || 'center');
    const hideBrokenImage = () => {
      image.closest('.travel-card__front')?.classList.add('is-image-missing');
      image.hidden = true;
    };
    image.addEventListener('error', hideBrokenImage, { once: true });
    if (image.complete && image.naturalWidth === 0) hideBrokenImage();
  });

  const clearFocus = () => {
    if (lockedCard || isDragging) return;
    activeCard?.classList.remove('is-focused', 'is-flipped');
    activeCard?.setAttribute('aria-pressed', 'false');
    activeCard = null;
    scene?.classList.remove('has-focus');
  };

  const resetTravelFocus = () => {
    lockedCard = null;
    cards.forEach((card) => {
      card.classList.remove('is-flipped', 'is-focused');
      card.setAttribute('aria-pressed', 'false');
    });
    activeCard = null;
    scene?.classList.remove('has-focus');
  };

  const focusCard = (card, lock = false, flip = true) => {
    if (!card || !scene) return;
    cards.forEach((item) => {
      if (item !== card) {
        item.classList.remove('is-focused', 'is-flipped');
        item.setAttribute('aria-pressed', 'false');
      }
    });
    activeCard = card;
    if (lock) lockedCard = card;
    card.classList.add('is-focused');
    if (flip) {
      card.classList.add('is-flipped');
      card.setAttribute('aria-pressed', 'true');
    }
    scene.classList.add('has-focus');
  };

  const findNearestCard = (event) => {
    let bestCard = null;
    let bestScore = Infinity;
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const padX = Math.max(18, rect.width * 0.22);
      const padY = Math.max(18, rect.height * 0.22);
      if (
        event.clientX < rect.left - padX ||
        event.clientX > rect.right + padX ||
        event.clientY < rect.top - padY ||
        event.clientY > rect.bottom + padY
      ) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const score = Math.hypot(event.clientX - cx, event.clientY - cy);
      if (score < bestScore) {
        bestScore = score;
        bestCard = card;
      }
    });
    return bestCard;
  };

  let scenePressTimer = null;
  let scenePressStart = null;
  let scenePressCard = null;
  let suppressClickCard = null;

  const clearScenePressTimer = () => {
    if (!scenePressTimer) return;
    window.clearTimeout(scenePressTimer);
    scenePressTimer = null;
  };

  module.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const card = event.target.closest('.travel-card');
    if (!card) return;
    event.stopPropagation();
    scenePressStart = { x: event.clientX, y: event.clientY };
    scenePressCard = card;
    clearScenePressTimer();
  }, true);

  module.addEventListener('pointermove', (event) => {
    if (!scenePressStart) return;
    const moved = Math.hypot(event.clientX - scenePressStart.x, event.clientY - scenePressStart.y);
    if (moved > 14) clearScenePressTimer();
  }, true);

  ['pointerup', 'pointercancel'].forEach((eventName) => {
    module.addEventListener(eventName, () => {
      scenePressStart = null;
      scenePressCard = null;
      clearScenePressTimer();
    }, true);
  });

  cards.forEach((card) => {
    let pressTimer = null;
    let longPressTriggered = false;
    let pressStart = null;

    const clearPressTimer = () => {
      if (!pressTimer) return;
      window.clearTimeout(pressTimer);
      pressTimer = null;
    };

    card.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      event.stopPropagation();
      longPressTriggered = false;
      pressStart = { x: event.clientX, y: event.clientY };
      clearPressTimer();
    });

    card.addEventListener('pointermove', (event) => {
      if (!pressStart) return;
      const moved = Math.hypot(event.clientX - pressStart.x, event.clientY - pressStart.y);
      if (moved > 12) clearPressTimer();
    });
    card.addEventListener('pointerup', () => {
      pressStart = null;
      clearPressTimer();
    });
    card.addEventListener('pointercancel', () => {
      pressStart = null;
      clearPressTimer();
    });

    card.addEventListener('focus', () => focusCard(card, false, false));
    card.addEventListener('blur', clearFocus);
    card.addEventListener('click', (event) => {
      event.stopPropagation();
      if (suppressClickCard === card) {
        suppressClickCard = null;
        return;
      }
      if (longPressTriggered) {
        longPressTriggered = false;
        return;
      }
      if (lockedCard === card) {
        resetTravelFocus();
        return;
      }
      focusCard(card, true, false);
      card.setAttribute('aria-pressed', 'true');
    });
  });

  module.addEventListener('click', (event) => {
    const card = event.target.closest('.travel-card');
    if (card) {
      if (lockedCard === card) {
        resetTravelFocus();
        return;
      }
      focusCard(card, true, false);
      card.setAttribute('aria-pressed', 'true');
      return;
    }
    resetTravelFocus();
  });

  const supportsFinePointer = matchMedia('(pointer: fine)').matches;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (scene && supportsFinePointer && !reduceMotion) {
    module.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      isDragging = true;
      dragStart = { x: event.clientX, y: event.clientY };
      module.classList.add('is-dragging');
      module.setPointerCapture?.(event.pointerId);
    });

    module.addEventListener('pointermove', (event) => {
      const rect = module.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      scene.style.setProperty('--scene-ry', `${nx * 7.5}deg`);
      scene.style.setProperty('--scene-rx', `${ny * -5.2}deg`);
      scene.style.setProperty('--travel-pan-x', `${nx * -34}px`);
      scene.style.setProperty('--travel-pan-y', `${ny * -24}px`);

      cards.forEach((card) => {
        const depth = Number(card.style.getPropertyValue('--depth') || 1);
        card.style.setProperty('--px', `${nx * 34 * depth}px`);
        card.style.setProperty('--py', `${ny * 24 * depth}px`);
      });
      layers.forEach((layer) => {
        const depth = Number(layer.style.getPropertyValue('--layer-depth') || 0.5);
        layer.style.setProperty('--lx', `${nx * 42 * depth}px`);
        layer.style.setProperty('--ly', `${ny * 30 * depth}px`);
      });

    });

    const endDrag = (event) => {
      if (!isDragging) return;
      isDragging = false;
      module.classList.remove('is-dragging');
      module.releasePointerCapture?.(event.pointerId);
      if (!dragStart) return;
      const moved = Math.hypot(event.clientX - dragStart.x, event.clientY - dragStart.y);
      dragStart = null;
    };

    module.addEventListener('pointerup', endDrag);
    module.addEventListener('pointercancel', endDrag);

    module.addEventListener('pointerleave', () => {
      if (lockedCard || isDragging) return;
      scene.style.setProperty('--scene-ry', '0deg');
      scene.style.setProperty('--scene-rx', '0deg');
      scene.style.setProperty('--travel-pan-x', '0px');
      scene.style.setProperty('--travel-pan-y', '0px');
      cards.forEach((card) => {
        card.style.setProperty('--px', '0px');
        card.style.setProperty('--py', '0px');
      });
      layers.forEach((layer) => {
        layer.style.setProperty('--lx', '0px');
        layer.style.setProperty('--ly', '0px');
      });
      clearFocus();
    });
  }
})();

(() => {
  const sequence = document.querySelector('#audioModelSequence');
  const viewer = document.querySelector('#audioModelViewer');
  if (!sequence || !viewer) return;

  const fill = document.querySelector('#audioProgressFill');
  const status = document.querySelector('#audioSequenceStatus');
  const dots = [...document.querySelectorAll('.audio-progress-rail span')];
  const nodes = [...sequence.querySelectorAll('.audio-node')];
  const stage = sequence.querySelector('.audio-model-stage');
  const listeningCopy = sequence.querySelector('.audio-feature-listening');
  const callsCopy = sequence.querySelector('.audio-feature-calls');
  const soundWave = sequence.querySelector('.audio-sound-wave');
  const mobileQuery = matchMedia('(max-width: 780px)');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const keyframes = [
    { at: 0, orbit: [34, 112, .31], target: [0, -.003, -.068] },
    { at: .42, orbit: [90, 90, .295], target: [0, -.003, -.068] },
    { at: .60, orbit: [58, 106, .088], target: [.061, .008, -.022] },
    { at: .82, orbit: [58, 106, .088], target: [.061, .008, -.022] },
    { at: 1, orbit: [0, 90, .285], target: [0, -.002, -.068] }
  ];

  const chapters = [
    { title: '01 / Underside View', labels: [] },
    { title: '02 / Right Temple Audio', labels: ['node-detach', 'node-vent', 'node-power', 'node-touch-panel', 'node-speaker'] },
    { title: '03 / Temple Detach', labels: [] },
    { title: '04 / Front Frame', labels: [] }
  ];

  let targetProgress = 0;
  let displayProgress = 0;
  let rafId = 0;
  let currentChapter = -1;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smoothstep = (t) => t * t * (3 - 2 * t);
  const vector = (values) => `${values[0].toFixed(4)}m ${values[1].toFixed(4)}m ${values[2].toFixed(4)}m`;
  const fadeWindow = (progress, start, fadeInEnd, fadeOutStart, end) => {
    if (progress <= start || progress >= end) return 0;
    if (progress < fadeInEnd) return smoothstep((progress - start) / (fadeInEnd - start));
    if (progress <= fadeOutStart) return 1;
    return 1 - smoothstep((progress - fadeOutStart) / (end - fadeOutStart));
  };

  const updateChapter = (progress) => {
    const stage = progress < .21 ? 0 : progress < .56 ? 1 : progress < .91 ? 2 : 3;
    if (stage === currentChapter) return;
    currentChapter = stage;
    const chapter = chapters[stage];
    if (status) status.textContent = chapter.title;
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === stage));
    nodes.forEach((node) => {
      const active = chapter.labels.some((name) => node.classList.contains(name));
      node.classList.toggle('sequence-active', active);
    });
  };

  const renderSequence = (progress) => {
    const nextIndex = keyframes.findIndex((frame, index) => index > 0 && progress <= frame.at);
    const endIndex = nextIndex < 0 ? keyframes.length - 1 : nextIndex;
    const startIndex = Math.max(0, endIndex - 1);
    const start = keyframes[startIndex];
    const end = keyframes[endIndex];
    const local = smoothstep(clamp((progress - start.at) / (end.at - start.at), 0, 1));
    const orbit = start.orbit.map((value, index) => lerp(value, end.orbit[index], local));
    const target = start.target.map((value, index) => lerp(value, end.target[index], local));
    const distanceScale = mobileQuery.matches ? 1.24 : 1;

    viewer.cameraOrbit = `${orbit[0].toFixed(3)}deg ${orbit[1].toFixed(3)}deg ${(orbit[2] * distanceScale).toFixed(4)}m`;
    viewer.cameraTarget = vector(target);

    if (typeof viewer.currentTime === 'number') {
      const detach = progress < .71 ? smoothstep(clamp((progress - .56) / .15, 0, 1)) :
        1 - smoothstep(clamp((progress - .71) / .20, 0, 1));
      viewer.currentTime = detach;
    }

    if (fill) fill.style.transform = `scaleY(${progress})`;

    const listeningOpacity = fadeWindow(progress, .195, .245, .325, .385);
    const callsOpacity = fadeWindow(progress, .395, .445, .540, .610);
    if (listeningCopy) {
      listeningCopy.style.opacity = listeningOpacity.toFixed(3);
      listeningCopy.style.transform = `translate3d(-50%, calc(-50% + ${(1 - listeningOpacity) * 18}px), 0)`;
      listeningCopy.style.filter = `blur(${(1 - listeningOpacity) * 5}px)`;
      listeningCopy.setAttribute('aria-hidden', listeningOpacity < .05 ? 'true' : 'false');
    }
    if (callsCopy) {
      callsCopy.style.opacity = callsOpacity.toFixed(3);
      callsCopy.style.transform = `translate3d(-50%, calc(-50% + ${(1 - callsOpacity) * 18}px), 0)`;
      callsCopy.style.filter = `blur(${(1 - callsOpacity) * 5}px)`;
      callsCopy.setAttribute('aria-hidden', callsOpacity < .05 ? 'true' : 'false');
    }
    if (soundWave) {
      const waveStrength = Math.max(listeningOpacity, callsOpacity);
      soundWave.style.setProperty('--wave-opacity', (waveStrength * .82).toFixed(3));
      soundWave.style.setProperty('--wave-scale', (.9 + waveStrength * .1).toFixed(3));
    }

    updateChapter(progress);
  };

  const animate = () => {
    const damping = reduceMotion.matches ? 1 : .16;
    displayProgress += (targetProgress - displayProgress) * damping;
    if (Math.abs(targetProgress - displayProgress) < .0001) displayProgress = targetProgress;
    renderSequence(displayProgress);
    if (displayProgress !== targetProgress) rafId = requestAnimationFrame(animate);
    else rafId = 0;
  };

  const requestRender = () => {
    if (!rafId) rafId = requestAnimationFrame(animate);
  };

  const moveSequence = (delta) => {
    targetProgress = clamp(targetProgress + delta, 0, 1);
    requestRender();
  };

  stage?.addEventListener('wheel', (event) => {
    event.preventDefault();
    const delta = event.deltaMode === 1 ? event.deltaY * 18 : event.deltaY;
    moveSequence(delta / 1200);
  }, { passive: false });

  stage?.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') targetProgress = 0;
    else if (event.key === 'End') targetProgress = 1;
    else {
      const step = event.key === 'PageUp' || event.key === 'PageDown' ? 1 / 3 : 1 / 6;
      moveSequence(event.key === 'ArrowUp' || event.key === 'PageUp' ? -step : step);
    }
    requestRender();
  });

  let touchY = null;
  stage?.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    touchY = event.clientY;
    stage.setPointerCapture?.(event.pointerId);
  });
  stage?.addEventListener('pointermove', (event) => {
    if (touchY === null || event.pointerType === 'mouse') return;
    event.preventDefault();
    const delta = touchY - event.clientY;
    touchY = event.clientY;
    moveSequence(delta / 520);
  }, { passive: false });
  ['pointerup', 'pointercancel'].forEach((eventName) => {
    stage?.addEventListener(eventName, (event) => {
      touchY = null;
      stage.releasePointerCapture?.(event.pointerId);
    });
  });

  viewer.addEventListener('load', () => {
    if (typeof viewer.pause === 'function') viewer.pause();
    targetProgress = displayProgress = 0;
    renderSequence(displayProgress);
  });

  viewer.addEventListener('error', () => {
    if (status) status.textContent = '3D model loading failed';
  });

  window.addEventListener('resize', requestRender, { passive: true });
  mobileQuery.addEventListener('change', requestRender);
  reduceMotion.addEventListener('change', requestRender);
  renderSequence(0);
  requestRender();
})();







