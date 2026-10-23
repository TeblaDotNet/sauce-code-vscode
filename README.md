# Open Sauce Food for VS Code

Sauce Code is plain text: you can write and keep `.opensauce` recipes in any editor. This optional extension adds file recognition as **Sauce Code**, TextMate syntax highlighting, # comment toggling, bracket matching, surrounding pairs and basic group indentation.

Version 0.1.0 is declarative only. It provides no validation, parser diagnostics, autocomplete, hover knowledge or live preview. It requires neither a separate Core installation nor Node/npm at runtime.

## Local installation

In VS Code use **Extensions → … → Install from VSIX…** and select `open-sauce-food-0.1.0.vsix`, or:

```sh
code --install-extension "/path/to/open-sauce-food-0.1.0.vsix"
```

Open `samples/example.opensauce`; the language indicator should read **Sauce Code**. Try Default Dark+ and Default Light+.
Uninstall through Extensions, or run `code --uninstall-extension tebla-local.open-sauce-food`.

The publisher identifier `tebla-local` is for local packaging only, not a claimed Marketplace identity. Nothing has been published.

## Highlighting and editing

Themes choose all colours; no website palette or theme is installed.

| Concept | Scope |
|---|---|
| Sections | keyword.control.section.opensauce |
| Comments | comment.line.number-sign.opensauce |
| Things / ingredients | variable.other.thing.opensauce |
| Equipment declarations | support.type.equipment.opensauce |
| Variants / parts | entity.name.type.variant-part.opensauce |
| Product labels / markers | string.unquoted.product.opensauce / keyword.operator.product.opensauce |
| Actions | support.function.action.opensauce |
| Results | constant.other.result.opensauce |
| Quantities, precision and units | constant.numeric.value.opensauce |
| Operators / control words | keyword.operator.opensauce / keyword.control.opensauce |
| Original-source payload | string.unquoted.raw.opensauce |

Equipment gets a distinct scope in `::equipment`. Elsewhere parenthesised references remain generic things: TextMate cannot resolve declarations or culinary identities. This is highlighting, not a regex parser. Unknown units and qualitative quantities stay conservative; punctuation inside named products remains product text. Malformed unclosed things/actions recover at the next line. URL fragments and image syntax do not accidentally start comments.

Parentheses, braces, square brackets and angle brackets match. Parentheses, braces, square brackets and quotes auto-close and surround selections. Angle brackets deliberately do not auto-close: typing source fences and prose comparisons should not insert extra characters. Quotes are editor conveniences, not a Sauce Code escaping syntax. Only explicit square-bracket group openings/closings affect indentation; there is no formatter.

Raw source is highlighted only within the unindented `<<<` / `>>>` fence under `::source`; normal token highlighting stops inside it. Comment toggling is an editor operation even in raw text, so use it deliberately there.

## Development

The canonical language is maintained in [Core SPEC.md](https://github.com/TeblaDotNet/open-sauce-food/blob/main/SPEC.md), not in this grammar. This version was checked against Core commit `21a20f8`. The authored sample is illustrative, not culinary advice or an imported recipe.

Install development tools with `pnpm install --ignore-scripts`, run `pnpm test`, then `pnpm package`. The packaging script writes to `../_work/vscode-extension/` (create it first). Only development tooling uses Node. VSCE signing installation scripts are unnecessary for unsigned local VSIX packaging.

Tests use the real VS Code TextMate and Oniguruma engines. Optional `OSF_CORPUS` enables representative corpus checks; those files are read in place and never bundled. `tools/test-host.cjs` is an optional VS Code extension-host test, excluded from the VSIX.

## Attribution

Copyright 2026 Tebla and Open Sauce Food contributors. Grammar/configuration/tooling: MIT. README and sample encoding: CC BY 4.0, following Core's licence scopes; see LICENSE and LICENSES. No logos, source recipes or culinary knowledge are copied into the extension.
