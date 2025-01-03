# Zomboid Scripting Language Extension for Visual Studio Code

![Zomboid Scripting Extension](https://img.shields.io/badge/Zomboid-Scripting-green)  
**Enhance your Project Zomboid scripting experience with syntax highlighting, error checking, and auto-completion. Designed for Build 42 and beyond.**

## Features

- **Syntax Highlighting**
  - Supports all keywords, tags, and parameters for `.txt` scripting.
  - Keywords, tags, and other script elements are color-coded for better readability.

- **Error Checking**
  - Detects missing or extra commas.
  - Validates proper use of brackets (`[`, `]`) and braces (`{`, `}`).
  - Highlights unmatched or misplaced syntax elements.

- **Auto-Completion**
  - Provides suggestions for keywords, tags, skills, and timed actions.
  - Simplifies script creation with intelligent suggestions based on the context.

- **Support for Custom Tags**
  - Allows for easy integration of user-defined tags and elements.

## Examples
![Example of the extension in action](https://imgur.com/a/J88YbZH)

## Installation

### **1. Download the Extension**
- Clone the repository or download the `.vsix` file from the [releases](https://github.com/KuroNeko87/zomboid-scripting/releases) section.

### **2. Install in Visual Studio Code**
1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or pressing `Ctrl+Shift+X`.
3. Click on the "..." menu in the top right corner and select **Install from VSIX**.
4. Navigate to the downloaded `.vsix` file and select it.

### **3. Activate the Extension**
- Open a `.txt` script or any file associated with Project Zomboid modding to activate the extension.

---

## How to Use

1. Open a `.txt` script file in Visual Studio Code.
2. Syntax highlighting is applied automatically.
3. Errors like missing commas or unmatched brackets will be highlighted.
4. Use `Ctrl+Space` for auto-completion suggestions.

---

## Supported Features

### **Script Elements**
- `module`, `imports`, `craftRecipe`, `entity`, and more.

### **Parameters**
- `timedAction`, `SkillRequired`, `inputs`, `outputs`, and others.

### **Skills**
- Includes all base game skills, e.g., `MetalWelding`, `Carpentry`, `Cooking`.

### **Timed Actions**
- Recognizes `BuildWoodenStructureSmall`, `Sew`, `Welding`, and many more.

---

## Contributing

We welcome contributions! If you have suggestions for improvements or encounter any bugs:
- Open an issue in the [GitHub repository](https://github.com/KuroNeko87/zomboid-scripting/issues).
- Submit a pull request with your proposed changes.

---

## Known Issues

- Some user-defined tags might not be recognized unless explicitly added to the extension settings.
- Error detection may not cover edge cases with deeply nested scripts.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
