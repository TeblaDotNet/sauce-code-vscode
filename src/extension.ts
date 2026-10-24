import * as vscode from 'vscode';
import {LanguageClient,TransportKind} from 'vscode-languageclient/node';
let client:LanguageClient|undefined;
export async function activate(context:vscode.ExtensionContext){
 const server=context.asAbsolutePath('server/server.cjs');
 client=new LanguageClient('sauceCode','Sauce Code Language Server',{run:{module:server,transport:TransportKind.stdio},debug:{module:server,transport:TransportKind.stdio}},{documentSelector:[{language:'opensauce',scheme:'file'},{language:'opensauce',scheme:'untitled'}]});
 context.subscriptions.push(client);
 await client.start();
}
export async function deactivate(){await client?.stop();}
