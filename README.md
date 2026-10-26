# Sauce Code for VS Code

Syntax highlighting and autocomplete for `.opensauce` recipes in Visual Studio Code.

The extension recognises Sauce Code files, highlights ingredients and actions, supports comments and brackets, and suggests names as you type. It works with your usual VS Code theme.

**Related repositories:** [Sauce Code Core](https://github.com/TeblaDotNet/sauce-code) · [Language Server](https://github.com/TeblaDotNet/sauce-code-language-server) · [Recipes](https://github.com/TeblaDotNet/open-sauce-food-corpus) · [Vim/Neovim](https://github.com/TeblaDotNet/sauce-code-vim)

## Install

Download `sauce-code-vscode-v0.3.1.vsix` from the [Releases page](https://github.com/TeblaDotNet/sauce-code-vscode/releases/latest). In VS Code, choose **Extensions → … → Install from VSIX…** and select it. Or use:

```sh
code --install-extension "/path/to/sauce-code-vscode-v0.3.1.vsix"
```

Open a `.opensauce` file; the language indicator should say **Sauce Code**. The existing extension ID is `tebla-local.open-sauce-food`, which is retained for compatibility with earlier installations. Installing a VSIX from GitHub doesn't automatically provide Marketplace updates.

## Writing recipes

- Sections, ingredients, equipment, actions, quantities and result names are highlighted.
- `#` comments, matching brackets and basic indentation use VS Code's usual editing commands.
- Autocomplete suggests ingredients, equipment and actions. Try `<jul` in `::instructions` or `(mix` under `::equipment`. Press `Ctrl+Space` to request suggestions.
- Names declared in the current recipe are prioritised where appropriate. Accepting a suggestion replaces the name, not the surrounding punctuation.

Version 0.3.1 includes a bundled Sauce Code Language Server. The extension currently provides completion rather than live recipe previews or diagnostics.

## Development

For the pinned language-server build, package checks and extension-host tests, see [development notes](docs/development.md). The [language specification](https://github.com/TeblaDotNet/sauce-code/blob/main/SPEC.md) lives in Core, not in the highlighting grammar.

The extension's code is under the scopes described in [LICENSE](LICENSE) and its bundled dependencies have their own notices in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md). Reports and contributions are welcome through this repository's Issues.
