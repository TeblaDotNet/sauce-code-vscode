import {build} from 'esbuild';
import {readFile,writeFile,mkdir,copyFile,readdir} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {createHash} from 'node:crypto';
const server=resolve('../language-server'),expected='8cf1de9af9742db231999d3ff088468f2d3e43e2';
const info=JSON.parse(await readFile(resolve(server,'dist/build-info.json'),'utf8')),bytes=await readFile(resolve(server,'dist/server.cjs'));
if(info.serverVersion!=='0.2.1'||info.coreCommit!==expected||info.serverSha256!==createHash('sha256').update(bytes).digest('hex'))throw Error('Server artifact does not match the approved Core revision/build manifest');
const pin=JSON.parse(await readFile('server-input.json','utf8'));
for(const [key,value]of Object.entries(pin))if(info[key]!==value)throw Error('Server input pin mismatch: '+key);
await mkdir('dist',{recursive:true});await mkdir('server',{recursive:true});await mkdir('THIRD-PARTY-LICENSES',{recursive:true});
await writeFile('server/server.cjs',bytes);await copyFile(resolve(server,'dist/build-info.json'),'server/build-info.json');
for(const name of (await readdir(resolve(server,'LICENSES'))).filter(n=>n!=='Bun-1.4.4.md'))await copyFile(resolve(server,'LICENSES',name),resolve('THIRD-PARTY-LICENSES','server-'+name));
const result=await build({entryPoints:['src/extension.ts'],outfile:'dist/extension.cjs',bundle:true,platform:'node',format:'cjs',target:'node18',external:['vscode'],metafile:true,legalComments:'eof'});
const packages=new Map();
for(const input of Object.keys(result.metafile.inputs).filter(p=>p.includes('node_modules/'))){let dir=dirname(resolve(input));while(true){try{const pkg=JSON.parse(await readFile(resolve(dir,'package.json'),'utf8'));if(pkg.name){packages.set(pkg.name+'@'+pkg.version,{dir,pkg});break;}}catch{}const next=dirname(dir);if(dir===next)throw Error('No package for '+input);dir=next;}}
for(const [key,{dir,pkg}]of packages){let copied=false;for(const name of ['License.txt','LICENSE','LICENSE.md','LICENSE.txt']){try{await copyFile(resolve(dir,name),resolve('THIRD-PARTY-LICENSES',key.replaceAll('/','-')+'.txt'));copied=true;break;}catch{}}if(!copied)throw Error('Missing licence for '+pkg.name);}
await writeFile('dist/runtime-inventory.json',JSON.stringify({coreCommit:expected,serverSourceRevision:info.serverSourceRevision,canonicalDigest:info.canonicalDigest,snapshotSha256:info.snapshotSha256,serverSha256:info.serverSha256,clientPackages:[...packages.keys()].sort()},null,2)+'\n');
console.log('Bundled server and client; Core '+expected);
