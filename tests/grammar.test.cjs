const assert=require('node:assert/strict');
const {test}=require('node:test');
const fs=require('node:fs');
const path=require('node:path');
const tm=require('vscode-textmate');
const onig=require('vscode-oniguruma');
const raw=JSON.parse(fs.readFileSync(path.join(__dirname,'../syntaxes/opensauce.tmLanguage.json'),'utf8'));
const ready=(async()=>{await onig.loadWASM(fs.readFileSync(require.resolve('vscode-oniguruma/release/onig.wasm')).buffer);
 const registry=new tm.Registry({onigLib:Promise.resolve({createOnigScanner:s=>new onig.OnigScanner(s),createOnigString:s=>new onig.OnigString(s)}),loadGrammar:async()=>raw});
 return registry.loadGrammar('source.opensauce');})();
async function tokens(text){const grammar=await ready;let stack=tm.INITIAL;return text.split(/\r?\n/).map(line=>{const r=grammar.tokenizeLine(line,stack);stack=r.ruleStack;return r.tokens.map(t=>({text:line.slice(t.startIndex,t.endIndex),scopes:t.scopes}));});}
function has(rows,text,scope){return rows.flat().some(t=>t.text.includes(text)&&t.scopes.includes(scope));}
test('representative sections, things, equipment, actions, results, operators and quantities',async()=>{
 const rows=await tokens(fs.readFileSync(path.join(__dirname,'../samples/example.opensauce'),'utf8'));
 for(const [text,scope] of [['::recipe','keyword.control.section.opensauce'],['flour','variable.other.thing.opensauce'],['mixing bowl','support.type.equipment.opensauce'],['mix','support.function.action.opensauce'],['{dough}','constant.other.result.opensauce'],['?=','keyword.operator.opensauce'],['250g','constant.numeric.value.opensauce'],['Optional','keyword.control.opensauce'],['# example','comment.line.number-sign.opensauce'],['plain','entity.name.type.variant-part.opensauce'],['Beefeater','string.unquoted.product.opensauce']]) assert.ok(has(rows,text,scope),text);
});
test('raw source fences suppress normal syntax including section-like lines',async()=>{
 const rows=await tokens('::source\n<<<\n(flour) <mix> # raw\n::ingredients\n>>>\n::instructions\n<mix>');
 assert.ok(has(rows,'<<<','punctuation.definition.source.begin.opensauce'));
 assert.ok(has(rows,'>>>','punctuation.definition.source.end.opensauce'));
 assert.ok(has([rows[2]],'# raw','string.unquoted.raw.opensauce'));
 assert.ok(has([rows[3]],'::ingredients','string.unquoted.raw.opensauce'));
 assert.ok(has([rows[6]],'mix','support.function.action.opensauce'));
});
test('URL/image hashes are literal; comments and prose stay conservative',async()=>{
 const rows=await tokens('::recipe\nsource: https://example.org/#fragment\n::instructions\n![alt # literal](image.png#fragment) # comment\n::notes\nOptional prose (not a token)\n::instructions\nOptional word\n<broken\n(flour)');
 assert.ok(!has([rows[1]],'#fragment','comment.line.number-sign.opensauce'));
 assert.ok(has([rows[3]],'# comment','comment.line.number-sign.opensauce'));
 assert.ok(!has([rows[5]],'not a token','variable.other.thing.opensauce'));
 assert.ok(!has([rows[7]],'Optional','keyword.control.opensauce'));
 assert.ok(has([rows[9]],'flour','variable.other.thing.opensauce'));
});
test('product punctuation is not interpreted as variant/quantity precision',async()=>{
 const rows=await tokens('(gin; London dry @ !Maker: reserve; 12) ~~100ml');
 assert.ok(has(rows,'Maker: reserve; 12','string.unquoted.product.opensauce'));
 assert.ok(has(rows,'~~100ml','constant.numeric.value.opensauce'));
});
test('language configuration survives LSP activation',()=>{
 const pkg=require('../package.json'),config=require('../language-configuration.json');
 assert.equal(pkg.contributes.languages[0].id,'opensauce');assert.deepEqual(pkg.contributes.languages[0].extensions,['.opensauce']);
 assert.equal(pkg.main,'./dist/extension.cjs');assert.equal(pkg.dependencies,undefined);assert.equal(config.comments.lineComment,'#');
 assert.ok(!config.autoClosingPairs.some(p=>p.open==='<'));
 assert.ok(new RegExp(config.indentationRules.increaseIndentPattern).test('Optional ['));
 assert.ok(new RegExp(config.indentationRules.decreaseIndentPattern).test('    ]'));
});
test('real corpus files tokenize with bounded scopes and preserved text',{skip:!process.env.OSF_CORPUS},async()=>{
 for(const rel of ['examples/public-domain-recipes/ravioli/ravioli.opensauce','examples/public-domain-recipes/no-knead-bread/no-knead-bread.opensauce','examples/cocktail-specs/cointreau-margarita/cointreau-margarita.opensauce']){
 const text=fs.readFileSync(path.join(process.env.OSF_CORPUS,rel),'utf8');const rows=await tokens(text);
 assert.ok(has(rows,'::ingredients','keyword.control.section.opensauce'),rel);
 assert.ok(rows.flat().some(t=>t.scopes.includes('support.function.action.opensauce')),rel);
 assert.equal(rows.map(r=>r.map(t=>t.text).join('')).join('\n'),text.replaceAll('\r\n','\n'));
 assert.ok(rows.flat().every(t=>t.scopes.length<20));
 }
});
