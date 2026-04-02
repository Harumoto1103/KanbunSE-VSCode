# KanbunSE VS Code Extension

Language support and execution for **KanbunSE** (Kanbun S-expression), a programming language with Classical Chinese syntax and S-expressions.

## Features

- **Syntax Highlighting**: Full support for Classical Chinese keywords, operators, and S-expressions.
- **Rich Snippets**: Quick templates for variables (`名`/`者`), functions (`夫`), loops (`大衍`/`為`), classes (`立`/`造`), and more.
- **Execution Support**: One-click Run button in the editor title bar to execute `.kse` files using Racket.
- **Configurable Paths**: Customize the path to your Racket executable and KanbunSE interpreter (`main.rkt`) in settings.

## Getting Started

1.  Open any `.kse` file.
2.  Use snippets like `ming` or `fu` to write code.
3.  Click the **Play icon** in the top-right corner or search for **Run KanbunSE** in the command palette.

## Requirements

- [Racket](https://racket-lang.org/) installed on your system.
- The KanbunSE interpreter (`main.rkt`) should be present on your local machine.

## Configuration

Go to VS Code Settings and search for `KanbunSE`:
- `KanbunSE: Racket Path`: Path to your `racket` binary (Default: `/opt/homebrew/bin/racket`).
- `KanbunSE: Interpreter Path`: Path to your `main.rkt` file (Default: `/Users/harumoto/KanbunSE/main.rkt`).

## License

MIT
