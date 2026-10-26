# Developing the VS Code extension

The [README](../README.md) covers ordinary installation and use. This file collects packaging instructions and editing behaviour relevant to contributors.

## Version and compatibility

The current extension version is `0.3.1`, with VS Code extension ID `tebla-local.open-sauce-food` and Sauce Code language ID `opensauce`. The manifest's package name and publisher are kept for compatibility. Language Server `0.2.1` and the approved canonical-only Core snapshot are bundled; Knowledge articles, photographs and measurements are not.

The extension uses `server-input.json` to pin the exact server source revision, bundle, vocabulary snapshot and checksums. A checkout of the current Language Server HEAD may differ from that pin. To reproduce a VSIX, use an isolated sibling `language-server` checkout matching `serverSourceRevision`, use the approved Windows CRLF checkout (`core.autocrlf=true`) because the source pin hashes file bytes, build it with locked dependencies, then build/package this extension. Do not modify pins just to satisfy the build or overwrite another working checkout.

The approved server revision is `543cf070ed49ff45281c82fc587ab040dcb07bcc`, retaining Core `8cf1de9af9742db231999d3ff088468f2d3e43e2`. The later public Language Server release has the same version but is not a substitute for this pinned input.

## Build and validate

Development requires Node.js 24+ and pnpm. Install project dependencies, then:

```sh
pnpm install --ignore-scripts
pnpm test
pnpm build
pnpm check
pnpm package
```

The packaging script writes under `../_work/vscode-extension/`; create that parent first. The VSIX bundles the validated server and dependencies using the VS Code extension-host runtime. It does not install Core separately.

TextMate and Oniguruma tests cover syntax scopes. `OSF_CORPUS` enables tests on representative recipes. `tools/test-host.cjs` tests the installed extension in an isolated editor profile and needs `OSF_EXTENSION_TEST_ROOT` and `OSF_CORPUS`. `tools/inspect-vsix.cjs` checks archive contents and notices, and rejects source trees, fixtures, `node_modules`, Core YAML and duplicate snapshots. The test-host script is not packaged.

## Highlighting and editing details

The grammar uses VS Code theme-defined TextMate scopes for sections, comments, things, equipment declarations, parts/variants, product labels, actions, results, quantities/operators and raw-source payloads. Equipment receives a distinct scope in `::equipment`; elsewhere parentheses get generic thing styling. TextMate highlighting is lexical and does not perform canonical resolution.

Parentheses, braces, square brackets and quotes auto-close; angle brackets match but do not auto-close, to avoid changing source fences and prose comparisons. Only explicit square-bracket groups influence indentation; the extension does not format recipes. Raw-source highlighting is limited to the `<<<` / `>>>` fence under `::source`.

Completion comes from the bundled language server and only replaces recognised name text when chosen. It doesn't alter qualifiers, parts, variants, product labels or bracket structure. VS Code may independently offer ordinary word completions in comments or raw text; these are not language-server responses.

Earlier VSIX versions can be replaced using **Install from VSIX** and reloading when prompted. The extension is locally packaged with the existing identifier; nothing here implies a Marketplace publication.
