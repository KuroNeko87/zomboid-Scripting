const vscode = require("vscode");

function activate(context) {
    const diagnosticCollection = vscode.languages.createDiagnosticCollection("zomboid");

    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(checkDocument),
        vscode.workspace.onDidChangeTextDocument((event) => checkDocument(event.document)),
        vscode.workspace.onDidSaveTextDocument(checkDocument)
    );

    function checkDocument(document) {
        if (document.languageId !== "zomboid") return;

        const diagnostics = [];
        const text = document.getText();
        const lines = text.split("\n");

        const blockStack = []; // Stack to track `{` and `}`
        let currentBlockType = null; // Tracks "inputs" or "outputs"
        let inInputsOrOutputs = false; // Determines if inside `inputs` or `outputs` block
        let inCommentBlock = false; // n: tracks wheter we are inside a comment block

        lines.forEach((line, lineIndex) => {
            const trimmedLine = line.trim();
            
            //n: check for the start and end of block comments
            if (trimmedLine.startsWith("/*")) {
                inCommentBlock = true;
            }
            if (inCommentBlock) {
                if (trimmedLine.endsWith("*/")) {
                    inCommentBlock = false;
                }
                return; // n: skip if this line is inside a comment block
            }

            // n: single-line comments
            if (trimmedLine.startsWith("//")) {
                return;
            }

            // Check for block openings and closings
            if (trimmedLine.endsWith("{")) {
                const blockType = trimmedLine.split(" ")[0];
                blockStack.push({ type: blockType, line: lineIndex });
                if (blockType === "inputs" || blockType === "outputs") {
                    currentBlockType = blockType;
                    inInputsOrOutputs = true;
                }
            } else if (trimmedLine === "}") {
                if (blockStack.length === 0) {
                    // Unmatched closing brace
                    diagnostics.push(
                        new vscode.Diagnostic(
                            new vscode.Range(lineIndex, 0, lineIndex, trimmedLine.length),
                            "Unmatched '}' detected.",
                            vscode.DiagnosticSeverity.Error
                        )
                    );
                } else {
                    const lastBlock = blockStack.pop();
                    if (lastBlock.type === "inputs" || lastBlock.type === "outputs") {
                        currentBlockType = null;
                        inInputsOrOutputs = false;
                    }
                }
            }

            // Check for missing trailing commas in parameters
            const paramRegex = /^\s*\w+\s*=\s*[\w"']+/; // Matches `key = value`
            if (paramRegex.test(trimmedLine) && !trimmedLine.endsWith(",")) {
                diagnostics.push(
                    new vscode.Diagnostic(
                        new vscode.Range(lineIndex, 0, lineIndex, trimmedLine.length),
                        "Missing trailing comma after parameter definition.",
                        vscode.DiagnosticSeverity.Warning
                    )
                );
            }

            // Check for trailing commas in `inputs` and `outputs` blocks
            if (inInputsOrOutputs && trimmedLine.startsWith("item")) {
                if (!trimmedLine.endsWith(",")) {
                    diagnostics.push(
                        new vscode.Diagnostic(
                            new vscode.Range(lineIndex, 0, lineIndex, trimmedLine.length),
                            "Missing trailing comma in inputs/outputs block.",
                            vscode.DiagnosticSeverity.Warning
                        )
                    );
                }
            }

            // Check for invalid square bracket usage
            if (currentBlockType === "inputs" && trimmedLine.startsWith("item")) {
                if (!/\[.*?\]/.test(trimmedLine)) {
                    diagnostics.push(
                        new vscode.Diagnostic(
                            new vscode.Range(lineIndex, 0, lineIndex, trimmedLine.length),
                            "Items, tags, or flags in 'inputs' must be enclosed in square brackets.",
                            vscode.DiagnosticSeverity.Error
                        )
                    );
                }
            } else if (currentBlockType === "outputs" && trimmedLine.startsWith("item")) {
                if (/\[.*?\]/.test(trimmedLine)) {
                    diagnostics.push(
                        new vscode.Diagnostic(
                            new vscode.Range(lineIndex, 0, lineIndex, trimmedLine.length),
                            "Items in 'outputs' must not be enclosed in square brackets.",
                            vscode.DiagnosticSeverity.Error
                        )
                    );
                }
            }
        });

        // Check for unclosed blocks at the end of the document
        if (blockStack.length > 0) {
            blockStack.forEach((block) => {
                diagnostics.push(
                    new vscode.Diagnostic(
                        new vscode.Range(block.line, 0, block.line, lines[block.line].length),
                        `Unclosed block '${block.type}' detected.`,
                        vscode.DiagnosticSeverity.Error
                    )
                );
            });
        }

        diagnosticCollection.set(document.uri, diagnostics);
    }

    context.subscriptions.push(diagnosticCollection);
}

exports.activate = activate;
