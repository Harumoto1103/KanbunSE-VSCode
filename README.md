# KanbunSE VS Code Extension

This extension provides language support for **KanbunSE** (Kanbun S-expression), a programming language with a syntax inspired by Classical Chinese and S-expressions.

## Features

- **Syntax Highlighting**: Supports keywords, operators, strings (「...」), numbers (including Chinese numbers), and comments (;).
- **Snippets**: Quick access to common language constructs like `名...以...`, `夫`, `施`, `大衍`, etc.
- **Language Configuration**: Support for automatic bracket matching and indentation.

## File Support

- `.kse`

## Syntax Example

```kse
; 定義
(名 三點一四一五九二六五三五八九七九 以 圓周率)
(書 圓周率)

; 函式
(名 (夫 (甲)
    (
        (名 零 以 乙)
        (大衍 丙 自 一 至 甲 為
            (乙 者 (加 乙 以 丙) 也)
        )
        乙
    )
) 以 求和)

(書 (施 求和 於 百))
```

## License

MIT
