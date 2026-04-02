import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('kanbunse.run', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }

        const filePath = editor.document.fileName;
        if (path.extname(filePath) !== '.kse') {
            vscode.window.showErrorMessage('Not a KanbunSE (.kse) file.');
            return;
        }

        const config = vscode.workspace.getConfiguration('kanbunse');
        const racketPath = config.get<string>('racketPath') || 'racket';
        const interpreterPath = config.get<string>('interpreterPath') || '';

        if (!interpreterPath) {
            vscode.window.showErrorMessage('KanbunSE interpreter path (main.rkt) is not configured.');
            return;
        }

        const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('KanbunSE');
        terminal.show();
        
        // Ensure paths with spaces are quoted
        const command = `"${racketPath}" "${interpreterPath}" "${filePath}"`;
        terminal.sendText(command);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
