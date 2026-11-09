(() => {
  'use strict';
  const calculator = document.querySelector('.pricing-page #calculator');
  if (!calculator) return;
  const modules = [...calculator.querySelectorAll('.calculator-modules input[type="checkbox"][data-price]')];
  const totalOutput = calculator.querySelector('#total-price');
  const summary = calculator.querySelector('#summary-items');
  const packageField = document.querySelector('#package');
  const messageField = document.querySelector('#message');
  const configurationField = document.querySelector('#configuration-field');
  const formatter = new Intl.NumberFormat('cs-CZ');
  const money = (value) => `${formatter.format(value)} Kč`;
  const base = 6900;
  let lastInsertedConfiguration = '';
  let configurationAttached = false;
  let feedback = null;

  function selectedModules() {
    return modules.filter((module) => module.checked).map((module) => ({
      name: module.dataset.name,
      price: Number(module.dataset.price)
    }));
  }

  function configuration() {
    const selected = selectedModules();
    const total = base + selected.reduce((sum, module) => sum + module.price, 0);
    return [
      'Moje konfigurace webu:',
      `Základní web: ${money(base)}`,
      ...selected.map((module) => `${module.name}: ${money(module.price)}`),
      `Orientační cena celkem: ${money(total)}`
    ].join('\n');
  }

  function summaryRow(name, price) {
    const row = document.createElement('li');
    const label = document.createElement('span');
    const value = document.createElement('span');
    label.textContent = name;
    value.textContent = money(price);
    row.append(label, value);
    return row;
  }

  function attachConfiguration() {
    if (!messageField) return;
    const next = configuration();
    const current = messageField.value;
    if (lastInsertedConfiguration && current.includes(lastInsertedConfiguration)) {
      messageField.value = current.replace(lastInsertedConfiguration, next);
    } else {
      messageField.value = current.trim() ? `${current.trim()}\n\n${next}` : `${next}\n\n`;
    }
    lastInsertedConfiguration = next;
    configurationAttached = true;
    if (configurationField) configurationField.value = next;
  }

  function clearConfiguration() {
    if (messageField && lastInsertedConfiguration && messageField.value.includes(lastInsertedConfiguration)) {
      messageField.value = messageField.value.replace(lastInsertedConfiguration, '').trim();
    }
    lastInsertedConfiguration = '';
    configurationAttached = false;
    if (configurationField) configurationField.value = '';
  }

  function updateSummary(animate = false) {
    const selected = selectedModules();
    const total = base + selected.reduce((sum, module) => sum + module.price, 0);
    totalOutput.textContent = money(total);
    summary.replaceChildren(summaryRow('Základní web', base), ...selected.map((module) => summaryRow(module.name, module.price)));
    if (configurationAttached) attachConfiguration();
    feedback?.cancel();
    if (animate && typeof totalOutput.animate === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      feedback = totalOutput.animate([{ opacity: 0.72 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
    }
  }

  modules.forEach((module) => module.addEventListener('change', () => updateSummary(true)));
  document.querySelector('#calculator-cta')?.addEventListener('click', () => {
    if (packageField) packageField.value = 'vlastni';
    attachConfiguration();
  });
  document.querySelectorAll('.offer-package-link[data-package]').forEach((link) => {
    link.addEventListener('click', () => {
      if (packageField) packageField.value = link.dataset.package;
      clearConfiguration();
    });
  });
  packageField?.addEventListener('change', () => {
    if (packageField.value !== 'vlastni') clearConfiguration();
  });
  updateSummary();
})();
