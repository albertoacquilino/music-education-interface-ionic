const fs = require('fs');
const path = require('path');

const docPath = path.join(__dirname, '../docs/documentation.json');
const outputPath = path.join(__dirname, '../docs/PUBLIC_API.md');

const TO_BE_INCLUDED = [
    {
        name: 'Reusable components',
        description: 'Components that can be reused across different views',
        paths: [
            'src/app/components/chromatic-tuner', 
            'src/app/components/note-selector',
            'src/app/components/note-selector',
            'src/app/components/score',
        ]
    }
];

const formatMethod = (method) => {
    const args = method.args && method.args.map(a => `${a.name}: ${a.type}`).join(', ') || '';
    const returnType = method.returnType || 'void';
    return `- \`${method.name}(${args}): ${returnType}\``;
};

const doc = JSON.parse(fs.readFileSync(docPath, 'utf-8'));
const md = [];

md.push(`# \ud83d\udcd8 Public API Documentation\n`);
md.push('_Auto-generated from Compodoc. Do not edit manually._\n');

md.push('## Table of Contents\n');
TO_BE_INCLUDED.forEach(i => {
    md.push(`- [${i.name}](#${i.name.toLowerCase().replace(/\s+/g, '-')})`);
});
md.push('\n---\n');

for (const item of TO_BE_INCLUDED) {
    md.push(`\n## ${item.name}\n`);
    md.push(`${item.description}\n`);

    const paths = item.paths;
    const isIncluded = (docItem) => {
        if (!docItem || typeof docItem.file !== 'string') return false;
        return paths.some(dir => docItem.file.startsWith(dir));
    };

    md.push('### \ud83e\uddf9 Components\n');
    (doc.components || []).forEach(c => {
        if (c.selector && !c.name.startsWith('\u0275') && isIncluded(c)) {
            md.push(`#### ${c.name}`);
            md.push(`- **Selector**: \`${c.selector}\``);
            if (c.description) md.push(`${c.description}`);
            (c.inputsClass || []).forEach(i => {
                md.push(`- **@Input()** \`${i.name}: ${i.type}\`${i.description ? ' - ' + i.description : ''}`);
            });
            (c.outputsClass || []).forEach(o => {
                md.push(`- **@Output()** \`${o.name}: ${o.type}\`${o.description ? ' - ' + o.description : ''}`);
            });
            md.push('');
        }
    });

    md.push('### \u2699\ufe0f Services\n');
    (doc.injectables || []).forEach(s => {
        const methods = (s.methods || []).filter(m => !m.modifier || m.modifier === 'public');
        if (methods.length && !s.name.startsWith('\u0275') && isIncluded(s)) {
            md.push(`#### ${s.name}`);
            if (s.description) md.push(`- ${s.description}`);
            methods.forEach(m => {
                md.push(formatMethod(m));
                if (m.description) md.push(`  - ${m.description}`);
            });
            md.push('');
        }
    });

    md.push('### \ud83d\udd90\ufe0f Interfaces\n');
    (doc.interfaces || []).forEach(i => {
        if (!i.name.startsWith('\u0275') && isIncluded(i)) {
            md.push(`#### ${i.name}`);
            if (i.description) md.push(`${i.description}`);
            md.push('```ts');
            (i.properties || []).forEach(p => {
                md.push(`${p.name}${p.optional ? '?' : ''}: ${p.type};${p.description ? ' // ' + p.description : ''}`);
            });
            md.push('```');
            md.push('');
        }
    });

    md.push('### Functions\n');
    (doc.miscellaneous.functions || []).forEach(f => {
        if (!f.name.startsWith('\u0275') && isIncluded(f)) {
            md.push(`#### ${f.name}`);
            if (f.description) md.push(`${f.description}`);
            md.push(formatMethod(f));
            md.push('');
        }
    });
}

fs.writeFileSync(outputPath, md.join('\n'), 'utf-8');
console.log(`✅ Public API extracted to ${outputPath}`);
