import dedent from 'dedent';
import { geminiClient } from '~/app/clients/gemini.client';
import { prisma } from '~/app/prisma';
import { unclassifiedEmojis } from '~/utils/dicts/emojis.dict';
import { findIndexes } from '~/utils/misc/find-indexes';
import { isEmoji } from '~/utils/misc/is-emoji';
import { pickStable } from '~/utils/misc/pick-stable';
import { unique } from '~/utils/misc/unique';

/**
 * Ищет emoji, которые соответствуют указанным строкам. Ожидается, что эти строки будет названием товаров из чека.
 * Сначала пробует распознать по локальному словарю, потом отправляет запросы к AI если не получилось.
 * Если и через AI не получится, то просто выдаст случайные emoji
 */
export async function lookupEmojis(queries: Array<string>): Promise<Array<string>> {
  queries = queries.map((query) => query.trim().toLowerCase());

  const results = lookupEmojisByKeywords(queries);
  const missing = unique(queries.filter((_, index) => !results[index]));

  if (!missing.length) {
    return results as Array<string>;
  }

  const resultsWithAI = await lookupEmojisWithAI(missing).catch((error) => {
    console.error(`🤡 Нейросеть устроила бунт:`, error);

    return [];
  });

  for (let i = 0; i <= resultsWithAI.length; i++) {
    const resultWithAI = resultsWithAI[i];
    const indexes = findIndexes(queries, missing[i]);
    for (const index of indexes) {
      results[index] = resultWithAI;
    }
  }

  return queries.map((query, index) => {
    if (results[index]) {
      return results[index];
    } else {
      return pickStable(unclassifiedEmojis, query);
    }
  });
}

/** Ищет emoji по локальному словарю ключевых слов. Используется как быстрый способ сопоставления без AI */
function lookupEmojisByKeywords(queries: Array<string>): Array<Nullish<string>> {
  return queries.map((query) => {
    const match = query.toLowerCase().match(keywordsRegex);

    if (match) {
      return keywords[match[0]] ?? null;
    }

    return null;
  });
}

// Ключевые слова для поиска
// prettier-ignore
const keywords: Record<string, string> = {
  // Напитки
  'пиво': '🍺',
  'стаут': '🍺',
  'хеллес': '🍺',
  'водка': '🍸',
  'онегин': '🍸',
  'виски': '🥃',
  'вино': '🍷',
  'наливка': '🍷',
  'настойка': '🍷',
  '50мл': '🍷',
  '100мл': '🍷',
  'чай': '🫖',
  'напиток': '🥤',
  'боржоми': '💧',
  'вода': '💧',
  // Еда
  'овощи': '🥗',
  'огурцы': '🥒',
  'пельмени': '🥟',
  'манты': '🥟',
  'хинкали': '🥟',
  'чебурек': '🥟',
  'ростбиф': '🥩',
  'холодец': '🥩',
  'гренки': '🥖',
  'ребра': '🍖',
  'бифштекс': '🥩',
  'бутерброд': '🥪',
  'шпроты': '🐟',
  'семг': '🐠',
  'лосос': '🐠',
  'форел': '🐠',
  'щук': '🐠',
  'щучь': '🐠',
  'креветки': '🍤',
  'грибы': '🍄',
  'грузди': '🍄',
  'разносолы': '🥒',
  'печенье': '🍪',
  'рис': '🍚',
  'борщ': '🍛',
  'щи': '🥘',
  'харчо': '🥘',
  'лагман': '🥘',
  'уха': '🍲',
  'окрошка': '🥣',
  'суп': '🥣',
  'люля-кебаб': '🍢',
  'сало': '🥓',
  'вишня': '🍒',
  'краб': '🦀',
  'салат': '🥗',
  'хачапури': '🫓',
  'шакшука': '🍳',
  'омлет': '🍳',
  'яичница': '🍳',
  'хлеб': '🍞',
  'блин': '🥞',
  'лепешк': '🫓',
  'сыр': '🧀',
  'мед': '🍯',
  'курица': '🍗',
  'колбас': '🍖',
  'мясо': '🥩',
  'картофель': '🥔',
  'уксус': '🧪',
  // Услуги
  'массаж': '🙌',
  'парение': '🌿',
  'вмр': '🧖‍♂️',
  'пмр': '🧖‍♂️',
  'дмр': '🧖‍♂️',
  'джр': '🧖‍♀️',
  'жр': '🧖‍♀️',
  // Товары
  'халат': '👘',
  'простыня': '🎀',
  'полотенце': '🧣',
  'килт': '🩳',
  'тапки': '🩴',
  'шапка': '🎩',
  'мыло': '🧼'
};

// Предварительная оптимизация
const keywordsRegex = new RegExp(Object.keys(keywords).join('|'), 'i'); // 'пиво|водка|виски|...'

/** Ищет emoji через запрос к AI. Дополнительно кеширует результаты запросов */
async function lookupEmojisWithAI(queries: Array<string>): Promise<Array<Nullish<string>>> {
  const cached = await prisma.emojiLookup.findMany({
    where: { query: { in: queries.filter(Boolean) } }
  });

  const results = new Map(cached.map((lookup) => [lookup.query, lookup.result]));
  const missing = queries.filter((query) => !results.has(query));

  if (missing.length === 1) {
    const query = missing[0];
    const prompt = `Select a single emoji that best represents the following item: ${query}\n\nThe item may be a product, a prepared dish, or a beverage. Respond with ONLY ONE EMOJI and no additional text.`;

    const text = await geminiClient.generateTextContent(prompt);

    if (text && isEmoji(text)) {
      await prisma.emojiLookup.create({
        data: { query, result: text }
      });

      results.set(query, text);
    }
  } else if (missing.length > 1) {
    const prompt = dedent`
    For each item in the list below, return one emoji that best represents it. The item may be a food product, prepared dish, or beverage.

    Respond with a numbered list (1–N), where each line contains ONLY AN EMOJI and no additional text.

    Items:
    ${missing.map((query, index) => `${index + 1}. ${query}`).join('\n')}
  `;

    const text = await geminiClient.generateTextContent(prompt);
    const nextResults =
      text
        ?.split('\n')
        .map((line) => line.trim().match(/^(\d+)\.\s*(.+)$/))
        .filter(Boolean)
        .reduce((acc, [_, i, result]) => {
          const index = Number(i) - 1;
          const query = missing[index];

          if (!query) {
            return acc;
          }

          result = result.trim();

          if (result && isEmoji(result)) {
            acc.set(query, result);
          }

          return acc;
        }, new Map<string, string>()) ?? null;

    if (nextResults) {
      await prisma.emojiLookup.createMany({
        data: Array.from(nextResults.entries()).map(([query, result]) => ({ query, result })),
        skipDuplicates: true
      });

      for (const [query, result] of nextResults.entries()) {
        results.set(query, result);
      }
    }
  }

  return queries.map((query) => results.get(query) ?? null);
}
