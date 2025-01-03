import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    vscode.languages.registerCodeActionsProvider("zomboid", {
        provideCodeActions(document, range) {
            const diagnostics: vscode.Diagnostic[] = [];
            const text = document.getText();

            const lines = text.split("\n");
            const bracketStack: string[] = [];
            let inInputsOrOutputs = false;

            lines.forEach((line, lineIndex) => {
                const trimmedLine = line.trim();

                // Detect if we are inside `inputs {}` or `outputs {}`
                if (trimmedLine.startsWith("inputs {") || trimmedLine.startsWith("outputs {")) {
                    inInputsOrOutputs = true;
                }
                if (trimmedLine === "}") {
                    inInputsOrOutputs = false;
                }

                // Check for trailing commas in `inputs` and `outputs`
                if (inInputsOrOutputs && trimmedLine.startsWith("item")) {
                    if (!trimmedLine.endsWith(",")) {
                        const diagnostic = new vscode.Diagnostic(
                            new vscode.Range(lineIndex, 0, lineIndex, trimmedLine.length),
                            "Each item in 'inputs' and 'outputs' must end with a comma.",
                            vscode.DiagnosticSeverity.Warning
                        );
                        diagnostics.push(diagnostic);
                    }
                }

                // Check for extra commas
                if (trimmedLine.includes(",,")) {
                    const diagnostic = new vscode.Diagnostic(
                        new vscode.Range(lineIndex, line.indexOf(",,"), lineIndex, line.indexOf(",,")),
                        "Extra comma detected",
                        vscode.DiagnosticSeverity.Warning
                    );
                    diagnostics.push(diagnostic);
                }

                // Check for unmatched brackets
                for (let char of line) {
                    if (char === "[" || char === "{") {
                        bracketStack.push(char);
                    } else if (char === "]") {
                        if (bracketStack.pop() !== "[") {
                            const diagnostic = new vscode.Diagnostic(
                                new vscode.Range(lineIndex, line.indexOf(char), lineIndex, line.indexOf(char) + 1),
                                "Unmatched ']' detected",
                                vscode.DiagnosticSeverity.Error
                            );
                            diagnostics.push(diagnostic);
                        }
                    } else if (char === "}") {
                        if (bracketStack.pop() !== "{") {
                            const diagnostic = new vscode.Diagnostic(
                                new vscode.Range(lineIndex, line.indexOf(char), lineIndex, line.indexOf(char) + 1),
                                "Unmatched '}' detected",
                                vscode.DiagnosticSeverity.Error
                            );
                            diagnostics.push(diagnostic);
                        }
                    }
                }
            });

            // Check for unclosed brackets at the end of the document
            if (bracketStack.includes("[")) {
                const diagnostic = new vscode.Diagnostic(
                    new vscode.Range(lines.length - 1, 0, lines.length - 1, lines[lines.length - 1].length),
                    "Unmatched '[' detected",
                    vscode.DiagnosticSeverity.Error
                );
                diagnostics.push(diagnostic);
            }
            if (bracketStack.includes("{")) {
                const diagnostic = new vscode.Diagnostic(
                    new vscode.Range(lines.length - 1, 0, lines.length - 1, lines[lines.length - 1].length),
                    "Unmatched '{' detected",
                    vscode.DiagnosticSeverity.Error
                );
                diagnostics.push(diagnostic);
            }

            return diagnostics;
        }
    });
}
