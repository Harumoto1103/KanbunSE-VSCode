import * as vscode from 'vscode';
import * as path from 'path';

const KEYWORD_DETAILS: { [key: string]: { label: string, detail: string, documentation: string, insertText?: string } } = {
    '名': {
        label: '名 (ming)',
        detail: 'Definition',
        documentation: 'Defines a variable.\nUsage: (名 [value] 以 [name])',
        insertText: '名 ${1:value} 以 ${2:name}'
    },
    '以': {
        label: '以 (yi)',
        detail: 'Keyword for definition or operation',
        documentation: 'Used in definitions (名 ... 以 ...) or arithmetic (加 ... 以 ...).'
    },
    '者': {
        label: '者 (zhe)',
        detail: 'Classical Definition',
        documentation: 'Defines a variable in Classical style.\nUsage: ([name] 者 [value] 也)',
        insertText: '${1:name} 者 ${2:value} 也'
    },
    '也': {
        label: '也 (ye)',
        detail: 'Classical Termination',
        documentation: 'Terminates a classical definition (... 者 ... 也).'
    },
    '夫': {
        label: '夫 (fu)',
        detail: 'Function Definition',
        documentation: 'Defines an anonymous function (lambda).\nUsage: (夫 ([params]) ([body]))',
        insertText: '夫 (${1:params}) (\n\t${2:body}\n)'
    },
    '施': {
        label: '施 (shi)',
        detail: 'Function Application',
        documentation: 'Calls a function or method.\nUsage: (施 [func] 於 [args])',
        insertText: '施 ${1:func} 於 ${2:args}'
    },
    '於': {
        label: '於 (yu)',
        detail: 'Call Argument Keyword',
        documentation: 'Used in function calls (施 ... 於 ...).'
    },
    '書': {
        label: '書 (shu)',
        detail: 'Print',
        documentation: 'Prints a value to the console with a newline.\nUsage: (書 [expr])',
        insertText: '書 ${1:expr}'
    },
    '未善': {
        label: '未善 (wei shan)',
        detail: 'Print (No Newline)',
        documentation: 'Prints a value without a newline.\nUsage: (書 [expr] 未善)'
    },
    '若': {
        label: '若 (ruo)',
        detail: 'Conditional (If)',
        documentation: 'Starts a conditional branch.\nUsage: (若 [cond] 則 [then] 若非 [else])',
        insertText: '若 ${1:condition} \n\t則 ${2:then} \n\t若非 ${3:else}'
    },
    '則': {
        label: '則 (ze)',
        detail: 'Then',
        documentation: 'The "then" branch of a conditional.'
    },
    '若非': {
        label: '若非 (ruo fei)',
        detail: 'Else',
        documentation: 'The "else" branch of a conditional.'
    },
    '大衍': {
        label: '大衍 (da yan)',
        detail: 'Loop (Iterator)',
        documentation: 'An indexed loop (for-loop).\nUsage: (大衍 [var] 自 [start] 至 [end] 為 [body])',
        insertText: '大衍 ${1:var} 自 ${2:start} 至 ${3:end} 為 \n\t${4:body}\n'
    },
    '為': {
        label: '為 (wei)',
        detail: 'Loop (Repeat)',
        documentation: 'Repeats an action N times.\nUsage: (為 [expr] [n] 遍)',
        insertText: '為 ${1:expr} ${2:n} 遍'
    },
    '自': { label: '自 (zi)', detail: 'Loop Start', documentation: 'Start value for 大衍 loop.' },
    '至': { label: '至 (zhi)', detail: 'Loop End', documentation: 'End value for 大衍 loop.' },
    '遍': { label: '遍 (bian)', detail: 'Loop Repeat Unit', documentation: 'Used in 為 ... 遍 loop.' },
    '立': {
        label: '立 (li)',
        detail: 'Class Definition',
        documentation: 'Defines a new class.\nUsage: (立 [Name] 承 [Parent] 具 ([attrs]) 能 ([methods]))',
        insertText: '立 ${1:ClassName} \n\t承 ${2:ParentClass|無} \n\t具 (${3:attributes}) \n\t能 (\n\t\t(${4:method_name} (${5:params}) (\n\t\t\t${6:body}\n\t\t))\n\t)\n'
    },
    '承': { label: '承 (cheng)', detail: 'Inheritance', documentation: 'Inherit from a parent class.' },
    '具': { label: '具 (ju)', detail: 'Attributes', documentation: 'Define class attributes.' },
    '能': { label: '能 (neng)', detail: 'Methods', documentation: 'Define class methods.' },
    '造': {
        label: '造 (zao)',
        detail: 'Instantiation',
        documentation: 'Creates an instance of a class.\nUsage: (造 [ClassName] 之實體)',
        insertText: '造 ${1:ClassName} 之實體'
    },
    '之': { label: '之 (zhi)', detail: 'Accessor', documentation: 'Access object properties or list elements.' },
    '令': {
        label: '令 (ling)',
        detail: 'Set Property',
        documentation: 'Sets a property of an object.\nUsage: (令 [obj] 之 [prop] 為 [val])',
        insertText: '令 ${1:obj} 之 ${2:prop} 為 ${3:val}'
    },
    '充': {
        label: '充 (chong)',
        detail: 'List Append',
        documentation: 'Appends a value to a list.\nUsage: (充 [list] 以 [val])',
        insertText: '充 ${1:list} 以 ${2:value}'
    },
    '為列以': {
        label: '為列以 (wei lie yi)',
        detail: 'List Creation',
        documentation: 'Creates a list from items.\nUsage: (為列以 ([items]))',
        insertText: '為列以 (${1:items})'
    },
    '卦': {
        label: '卦 (gua)',
        detail: 'Pattern Match (Switch)',
        documentation: 'Matches a value against patterns.\nUsage: (卦 [val] 而 (([pat] 則 [res])...))',
        insertText: '卦 ${1:expr} 而 (\n\t(${2:case} 則 ${3:result})\n)'
    },
    '而': { label: '而 (er)', detail: 'Match Connector', documentation: 'Used in 卦 ... 而 ...' },
    '加': { label: '加', detail: 'Addition', documentation: '(加 甲 以 乙)' },
    '減': { label: '減', detail: 'Subtraction', documentation: '(減 甲 以 乙)' },
    '乘': { label: '乘', detail: 'Multiplication', documentation: '(乘 甲 以 乙)' },
    '除': { label: '除', detail: 'Division', documentation: '(除 甲 以 乙) or (除 甲 以 乙 所餘)' },
    '所餘': { label: '所餘', detail: 'Remainder', documentation: 'Modulus operator.' },
    '整除': { label: '整除', detail: 'Integer Division', documentation: 'Quotient operator.' },
    '等於': { label: '等於', detail: 'Equality', documentation: 'Check if two values are equal.' },
    '大於': { label: '大於', detail: 'Greater Than', documentation: 'Check if A > B.' },
    '小於': { label: '小於', detail: 'Less Than', documentation: 'Check if A < B.' },
    '陽': { label: '陽', detail: 'Boolean True', documentation: 'The value for True.' },
    '陰': { label: '陰', detail: 'Boolean False', documentation: 'The value for False.' },
    '此': { label: '此', detail: 'Self/This', documentation: 'Refers to the current instance in a method.' }
};

export function activate(context: vscode.ExtensionContext) {
    let runDisposable = vscode.commands.registerCommand('kanbunse.run', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        const filePath = editor.document.fileName;
        const config = vscode.workspace.getConfiguration('kanbunse');
        const racketPath = config.get<string>('racketPath') || 'racket';
        const interpreterPath = config.get<string>('interpreterPath') || '';
        if (!interpreterPath) {
            vscode.window.showErrorMessage('KanbunSE interpreter path (main.rkt) is not configured.');
            return;
        }
        const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('KanbunSE');
        terminal.show();
        terminal.sendText(`"${racketPath}" "${interpreterPath}" "${filePath}"`);
    });

    let hoverProvider = vscode.languages.registerHoverProvider('kanbunse', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            if (!range) return null;
            const word = document.getText(range);
            const detail = KEYWORD_DETAILS[word];
            if (detail) {
                const markdown = new vscode.MarkdownString();
                markdown.appendMarkdown('### ' + detail.label + '\n\n');
                markdown.appendMarkdown('**' + detail.detail + '**\n\n');
                markdown.appendMarkdown(detail.documentation);
                return new vscode.Hover(markdown);
            }
            return null;
        }
    });

    let completionProvider = vscode.languages.registerCompletionItemProvider('kanbunse', {
        provideCompletionItems(document, position, token, context) {
            return Object.entries(KEYWORD_DETAILS).map(([kw, detail]) => {
                const item = new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword);
                item.detail = detail.detail;
                item.documentation = new vscode.MarkdownString(detail.documentation);
                if (detail.insertText) {
                    item.insertText = new vscode.SnippetString(detail.insertText);
                    item.kind = vscode.CompletionItemKind.Snippet;
                }
                return item;
            });
        }
    });

    context.subscriptions.push(runDisposable, hoverProvider, completionProvider);
}

export function deactivate() {}
