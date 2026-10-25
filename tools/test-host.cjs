const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vscode=require('vscode');
exports.run=async()=>{
 const root=process.env.OSF_EXTENSION_TEST_ROOT;
 const ext=vscode.extensions.getExtension('tebla-local.open-sauce-food');
 assert.ok(ext,'Installed extension missing');
 assert.equal(ext.packageJSON.version,'0.3.1');
 const info=JSON.parse(fs.readFileSync(path.join(ext.extensionPath,'server/build-info.json'))),pin=JSON.parse(fs.readFileSync(path.join(ext.extensionPath,'server-input.json')));for(const [key,value]of Object.entries(pin))assert.equal(info[key],value,key);
 assert.equal(info.coreCommit,'8cf1de9af9742db231999d3ff088468f2d3e43e2');
 assert.equal(info.canonicalDigest,'20f61b876c2d966e04f9b145343297e728bc9cd8488af2f245f326d3c704a046');
 assert.equal(ext.packageJSON.main,'./dist/extension.cjs');
 const doc=await vscode.workspace.openTextDocument(vscode.Uri.file(path.join(ext.extensionPath,'samples/example.opensauce')));
 assert.equal(doc.languageId,'opensauce');
 const activationDeadline=Date.now()+10000;
 while(!ext.isActive){if(Date.now()>activationDeadline)throw Error('Automatic onLanguage activation timed out');await new Promise(resolve=>setTimeout(resolve,25));}
 assert.equal(ext.isActive,true);
 for(const theme of ['Default Dark+','Default Light+']){
  await vscode.workspace.getConfiguration('workbench').update('colorTheme',theme,vscode.ConfigurationTarget.Global);
  const scratch=await vscode.workspace.openTextDocument({language:'opensauce',content:'(flour)'});
  const editor=await vscode.window.showTextDocument(scratch);
  editor.selection=new vscode.Selection(0,0,0,0);
  await vscode.commands.executeCommand('editor.action.commentLine');
  assert.match(scratch.getText(),/^#\s*\(flour\)/);
  await vscode.commands.executeCommand('editor.action.commentLine');
  assert.equal(scratch.getText(),'(flour)');
  await editor.edit(e=>e.replace(new vscode.Range(0,0,0,7),''));
  await vscode.commands.executeCommand('type',{text:'('});
  assert.equal(scratch.getText(),'()');
  await editor.edit(e=>e.replace(new vscode.Range(0,0,0,2),''));
  await vscode.commands.executeCommand('type',{text:'<'});
  assert.equal(scratch.getText(),'<');
  await editor.edit(e=>e.replace(new vscode.Range(0,0,0,1),'Optional ['));
  editor.selection=new vscode.Selection(0,10,0,10);
  editor.options={...editor.options,insertSpaces:true,tabSize:4};
  await vscode.commands.executeCommand('type',{text:'\n'});
  assert.match(scratch.getText(),/Optional \[\r?\n +$/);
  await vscode.commands.executeCommand('workbench.action.revertAndCloseActiveEditor');
 }
 for(const name of ['ravioli','no-knead-bread']){
 const real=await vscode.workspace.openTextDocument(vscode.Uri.file(path.join(process.env.OSF_CORPUS,'examples/public-domain-recipes',name,name+'.opensauce')));
 assert.equal(real.languageId,'opensauce');
 }
 await vscode.workspace.getConfiguration('workbench').update('colorTheme','Default Dark+',vscode.ConfigurationTarget.Global);
 const cases=[
 ['::instructions\n<jul','julienne'],
 ['::instructions\n<velv','velvet'],
 ['::equipment\n(pasta extr','pasta extruder'],
 ['::equipment\n(mix','mixing bowl'],
 ['::equipment\n(flour bowl)\n::instructions\n(fl','flour bowl'],
 ['::ingredients\n(cour','courgette'],
 ['::instructions\n<put','put'],
 ['::instructions\n# <jul',null],
 ['::source\n<<<\n::instructions\n<jul',null]
 ];
 for(let i=0;i<cases.length;i++){
  const [text,expected]=cases[i],file=path.join(root,'completion-'+i+'.opensauce');fs.writeFileSync(file,text);
  const d=await vscode.workspace.openTextDocument(vscode.Uri.file(file));assert.equal(d.languageId,'opensauce');
  await vscode.window.showTextDocument(d);const before=d.getText();
  const result=await vscode.commands.executeCommand('vscode.executeCompletionItemProvider',d.uri,d.positionAt(text.length));
  const labels=(result?.items??[]).filter(x=>/^(process:|equipment:|ingredient:|Declared )/.test(x.detail??'')).map(x=>typeof x.label==='string'?x.label:x.label.label);
  if(expected){assert.ok(labels.includes(expected),JSON.stringify({text,expected,labels}));if(expected==='flour bowl')assert.equal(labels[0],expected);}else assert.deepEqual(labels,[]);
  assert.equal(d.getText(),before,'Request must not edit document');
 }
 fs.writeFileSync(path.join(root,'host-test-result.json'),JSON.stringify({passed:true,language:doc.languageId,themes:['Default Dark+','Default Light+'],checks:['installed package','automatic onLanguage activation','comments','parenthesis auto-close','angle no-auto-close','group indentation','real corpus language detection','installed bundled LSP completion: actions, equipment, local roles, ingredients, generic aliases','comments and raw source suppressed','completion requests do not edit documents'],extensionPath:ext.extensionPath},null,2));
};
