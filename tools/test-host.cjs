const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vscode=require('vscode');
exports.run=async()=>{
 const root=process.env.OSF_EXTENSION_TEST_ROOT;
 const ext=vscode.extensions.getExtension('tebla-local.open-sauce-food');
 assert.ok(ext,'Installed extension missing');
 assert.equal(ext.packageJSON.main,undefined);
 const doc=await vscode.workspace.openTextDocument(vscode.Uri.file(path.join(ext.extensionPath,'samples/example.opensauce')));
 assert.equal(doc.languageId,'opensauce');
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
 fs.writeFileSync(path.join(root,'host-test-result.json'),JSON.stringify({passed:true,language:doc.languageId,themes:['Default Dark+','Default Light+'],checks:['installed package','comments','parenthesis auto-close','angle no-auto-close','group indentation','real corpus language detection'],extensionPath:ext.extensionPath},null,2));
};
