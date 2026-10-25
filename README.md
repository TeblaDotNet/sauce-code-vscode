# Open Sauce Food for VS Code

Sauce Code is plain text: you can write and keep `.opensauce` recipes in any editor. This optional extension adds file recognition as **Sauce Code**, TextMate syntax highlighting, # comment toggling, bracket matching, surrounding pairs and basic group indentation.

Version 0.3.1 adds Core-backed autocomplete through a bundled, editor-independent Sauce Code language server. It provides no diagnostics, hover, navigation, formatting or live preview. VS Code supplies the Node runtime: no separate Node, Core or server installation is needed.

## Local installation

In VS Code use **Extensions → … → Install from VSIX…** and select `open-sauce-food-0.3.1.vsix`, or:

```sh
code --install-extension "/path/to/open-sauce-food-0.3.1.vsix"
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

The canonical language is maintained in [Core SPEC.md](https://github.com/TeblaDotNet/open-sauce-food/blob/main/SPEC.md), not in this grammar. Completion uses the pinned Core commit `8cf1de9af9742db231999d3ff088468f2d3e43e2` (canonical-only Stage 4B Core). The authored sample is illustrative, not culinary advice or an imported recipe.

Install development tools with `pnpm install --ignore-scripts`, run `pnpm test`, then `pnpm package`. The packaging script writes to `../_work/vscode-extension/` (create it first). Development requires Node.js 24+; the installed extension uses VS Code’s bundled runtime. Build the sibling `language-server` with `pnpm build`, then run `pnpm build` and `pnpm check` here before packaging. The extension build verifies and copies the server artifact; it never falls back to a global Core installation. VSCE signing installation scripts are unnecessary for unsigned local VSIX packaging.

Tests use the real VS Code TextMate and Oniguruma engines. Optional `OSF_CORPUS` enables representative corpus checks; those files are read in place and never bundled. `tools/test-host.cjs` is an optional VS Code extension-host test, excluded from the VSIX.

## Attribution

Copyright 2026 Tebla and Open Sauce Food contributors. Grammar/configuration/tooling: MIT. README and sample encoding: CC BY 4.0, following Core's licence scopes; see LICENSE and LICENSES. No logos or source recipes are bundled. A generated semantic vocabulary snapshot and Core parser/resolver are bundled with their original licences; see THIRD-PARTY-NOTICES.md.

## Autocomplete

Open a `.opensauce` file; the language server activates automatically. Type `<jul` in instructions for actions, or `(mix` under `::equipment` for equipment. Under `::ingredients`, existing ingredient names and aliases are offered as assistance, never a list of permitted ingredients. Unknown names remain valid. Use Ctrl+Space to request completion manually.

In instruction parentheses, locally declared equipment and ingredients rank first. A role such as `flour bowl` remains `flour bowl`; it is not renamed to a canonical bowl. Since parentheses can denote either domain, global fallback candidates include both with domain labels. Canonical/alias matches deduplicate by identity and results are capped at 60, refreshing as you type. Generic actions remain available even without a reference page.

Incomplete brackets work. Comments, raw-source payloads, metadata/prose, qualifiers, parts, variants, product labels and malformed/ambiguous contexts do not receive suggestions. Completion changes only the name when explicitly accepted; it does not close brackets, reformat recipes or publish diagnostics. Existing TextMate highlighting still determines colours.

The VSIX bundles one server, one semantic vocabulary snapshot and all runtime dependencies, using VS Code’s extension-host Node process. No dependency installation or network access occurs at runtime. Standalone stdio operation and Neovim setup are documented in the sibling language-server repository; native Neovim validation is recorded in the server validation report.

## Validation and package inspection

Run `pnpm test` for existing TextMate/configuration checks; set `OSF_CORPUS` for the real-recipe cases. `tools/test-host.cjs` tests installed-package activation and completion as well as existing editor behaviour in an isolated VS Code profile. It requires `OSF_EXTENSION_TEST_ROOT` for evidence and `OSF_CORPUS` for representative files. Package inspection must reject source trees, test fixtures, node_modules, Core YAML and duplicate knowledge snapshots. See `tools/inspect-vsix.cjs`.

VS Code may independently offer word-based suggestions in comments or raw text. Those are editor suggestions, not Sauce Code language-server results; this extension does not change that preference.

## Upgrade from v0.2.0

Install the locally built open-sauce-food-0.3.1.vsix over v0.2.0 using Install
from VSIX or code --install-extension /path/to/open-sauce-food-0.3.1.vsix.
The publisher/extension identity is unchanged. Reload VS Code when prompted.

This version bundles Language Server 0.2.1 and Core
8cf1de9af9742db231999d3ff088468f2d3e43e2: 969 identities (414 ingredients,
255 equipment, 300 processes/actions). For example, pasta extruder and velvet
are now available. Highlighting, editing and completion rules are unchanged.
No separate runtime or standalone executable is needed by the VSIX.

## Stage 5 ownership boundary

The 0.3.1 patch keeps the extension identifier and editing behaviour unchanged. It bundles Language Server 0.2.1 built against canonical-only Core 8cf1de9. All 969 identities remain available, independently of article availability. No Open Sauce Food Knowledge checkout, articles, photographs, measurements or browsing taxonomy are loaded. server-input.json pins the exact server source revision, bundle and snapshot hashes and canonical digest. Future optional knowledge hovers are outside this release. Angle-bracket auto-closing remains intentionally unchanged.
