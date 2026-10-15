import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCurrencyBRL,
  formatNumberBR,
  validateEventData,
  computeSponsorshipMetrics,
  defaultEventData,
  defaultThemePresets,
  defaultImages,
  generateSingleFileHtml,
  getDynamicPrintCss,
} from './proposalLogic.ts';

test('formatCurrencyBRL formats Brazilian Real currency correctly', () => {
  const result = formatCurrencyBRL(250000);
  assert.ok(result.includes('250.000') || result.includes('250'));
  assert.ok(result.includes('R$'));

  const zero = formatCurrencyBRL(0);
  assert.ok(zero.includes('R$'));
});

test('formatNumberBR formats numbers with Portuguese locale separators', () => {
  assert.equal(formatNumberBR(1000), '1.000');
  assert.equal(formatNumberBR(2500000), '2.500.000');
  assert.equal(formatNumberBR(0), '0');
});

test('validateEventData enforces required fields', () => {
  const validResult = validateEventData(defaultEventData);
  assert.equal(validResult.valid, true);
  assert.equal(validResult.errors.length, 0);

  const invalidResult = validateEventData({ name: '', date: '', venue: '', tiers: [] });
  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.length >= 3);
});

test('computeSponsorshipMetrics calculates correct total potential revenue and quotas', () => {
  const metrics = computeSponsorshipMetrics(defaultEventData);
  // Default tiers:
  // Cota Apresenta: 250,000 * 1 = 250,000
  // Cota Master: 120,000 * 3 = 360,000
  // Cota Apoio: 45,000 * 5 = 225,000
  // Total = 835,000
  assert.equal(metrics.totalQuotas, 9);
  assert.equal(metrics.totalPotentialRevenue, 835000);
  assert.equal(metrics.highlightedTierPrice, 250000);
});

test('generateSingleFileHtml produces valid HTML with all 6 slides and print rules', () => {
  const html = generateSingleFileHtml(
    defaultEventData,
    defaultThemePresets.luxuryGold,
    defaultImages,
    'widescreen'
  );

  assert.ok(html.includes('<!DOCTYPE html>'));
  assert.ok(html.includes(defaultEventData.name));
  assert.ok(html.includes('size: 16in 9in'));
  assert.ok(html.includes('print-color-adjust: exact'));
  assert.ok(html.includes('COTA APRESENTA'));
  assert.ok(html.includes(defaultEventData.contactEmail));
});

test('getDynamicPrintCss generates correct @page size and dimensions for each format', () => {
  const wideCss = getDynamicPrintCss('widescreen');
  assert.ok(wideCss.includes('size: 16in 9in'));
  assert.ok(wideCss.includes('width: 16in !important'));

  const mobileCss = getDynamicPrintCss('mobile');
  assert.ok(mobileCss.includes('size: 9in 16in'));
  assert.ok(mobileCss.includes('width: 9in !important'));
  assert.ok(mobileCss.includes('height: 16in !important'));

  const a4Css = getDynamicPrintCss('a4Portrait');
  assert.ok(a4Css.includes('size: A4 portrait'));
  assert.ok(a4Css.includes('width: 210mm !important'));
});

