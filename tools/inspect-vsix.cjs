const assert=require('node:assert/strict'),fs=require('node:fs'),{createRequire}=require('node:module'),{createHash}=require('node:crypto');
const yauzl=createRequire(require.resolve('@vscode/vsce'))('yauzl');
const filename=process.argv[2];if(!filename)throw Error('Supply a VSIX path');
yauzl.open(filename,{lazyEntries:true},(error,zip)=>{if(error)throw error;const files=new Map();zip.readEntry();zip.on('entry',entry=>{
 if(entry.fileName.endsWith('/')){zip.readEntry();return;}assert.ok(!entry.fileName.includes('..'));zip.openReadStream(entry,(err,stream)=>{if(err)throw err;const chunks=[];stream.on('data',b=>chunks.push(b));stream.on('end',()=>{files.set(entry.fileName,Buffer.concat(chunks));zip.readEntry();});});
});zip.on('end',()=>{
 for(const name of files.keys()){assert.ok(!/\/(node_modules|tests|tools|src|vendor|knowledge|corpus)\//.test(name),name);assert.ok(!/\.(map|yaml|tgz)$/.test(name),name);if(name.endsWith('.opensauce'))assert.equal(name,'extension/samples/example.opensauce');}
 const info=JSON.parse(files.get('extension/server/build-info.json'));assert.equal(info.coreCommit,'ce601f0039a84f00f8809a1618cbb145fad47c9b');assert.equal(createHash('sha256').update(files.get('extension/server/server.cjs')).digest('hex'),info.serverSha256);
 assert.ok(files.has('extension/dist/extension.cjs'));assert.ok(files.has('extension/THIRD-PARTY-NOTICES.md'));assert.ok([...files.keys()].some(n=>n.includes('Core-CC0')));
 const bytes=fs.statSync(filename).size;assert.ok(bytes<3_000_000,'Unexpected package size');const result={files:files.size,bytes,sha256:createHash('sha256').update(fs.readFileSync(filename)).digest('hex'),coreCommit:info.coreCommit,entries:[...files.keys()].sort()};console.log(JSON.stringify(result,null,2));if(process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(result,null,2)+'\n');
});});
