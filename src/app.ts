/* eslint-disable no-console */
import fs from 'fs/promises';
import { createObjectCsvStringifier } from 'csv-writer';
import glob from 'glob';
import { promisify } from 'util';
import pdfParser from 'pdf-parser';

const TABLE_START_MARKER = '配当金等支払日';

const TABLE_OFFSET = {
    6: '分配通貨',
    8: '配当金支払日',
    9: '国内支払日',
    10: '銘柄名',
    57: '配当金等金額',
    58: '外国源泉徴収税額',
    59: '国内課税所得額',
    61: '所得税（外貨）',
    62: '所得税（円貨）',
    63: '地方税（外貨）',
    64: '地方税（円貨）',
    65: '国内源泉徴収税額（外貨）',
} as Record<number, string>;

const TABLE_OFFSET_LAST = Math.max(...Object.keys(TABLE_OFFSET).map(e => parseInt(e, 10)));

async function* processPDF(fileName: string): AsyncGenerator<Record<string, string>>{
    const buf = await fs.readFile(fileName);
    const { pages } : { pages: { texts: { text: string }[] }[] } = await promisify(pdfParser.pdf2json)(buf);
    const texts = pages.flatMap(e => e.texts).map(e => e.text as string);

    let record: Record<string, string> | undefined;
    let offset = 0;

    for (const text of texts) {
        if (text === TABLE_START_MARKER) {
            record = {};
            offset = 0;
        }

        if (!record) {
            continue;
        }

        // console.log(`${offset}: ${text}`);

        if (TABLE_OFFSET[offset]) {
            (record[TABLE_OFFSET[offset]] = text.replace(',', ''));
        }

        if (offset === TABLE_OFFSET_LAST) {
            yield record;
            record = undefined;
        }
        
        offset++;
    }
}

(async () => {
    const stringifier = createObjectCsvStringifier({
        header: Object.values(TABLE_OFFSET).map(e => ({ id: e, title: e })),
    });
    const files = await promisify(glob)('documents/*.pdf');
    const records = [] as Record<string, string>[];
    for (const file of files) {
        // eslint-disable-next-line no-await-in-loop
        for await (const record of processPDF(file)) {
            console.error(record);
            records.push(record);
        }
    }
    console.log(stringifier.getHeaderString());
    console.log(stringifier.stringifyRecords(records));
})();
