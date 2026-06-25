#!/usr/bin/env python3
"""Convert Five_Layer_Defense_Framework.html to Markdown blog post."""
import re, html as htmllib, sys

src = "/Users/mulloy/Downloads/Five_Layer_Defense_Framework.html"
dst = "/Users/mulloy/dev/mulloymorrow.github.io/src/content/blog/five-layer-defense-framework.md"

with open(src, encoding="utf-8") as f:
    raw = f.read()

m = re.search(r'<main class="article">(.*?)</main>', raw, re.DOTALL)
if not m:
    sys.exit("Could not find <main class='article'>")
body = m.group(1)

def clean_inline(s):
    """Convert inline HTML to Markdown. Input may contain HTML entities."""
    # strip block-level wrappers, keep content
    s = re.sub(r'<p[^>]*>(.*?)</p>', r'\1 ', s, flags=re.DOTALL)
    # inline formatting
    s = re.sub(r'<strong>(.*?)</strong>', r'**\1**', s, flags=re.DOTALL)
    s = re.sub(r'<em>(.*?)</em>', r'*\1*', s, flags=re.DOTALL)
    s = re.sub(r'<code>(.*?)</code>', r'`\1`', s, flags=re.DOTALL)
    s = re.sub(r'<a[^>]*>(.*?)</a>', r'\1', s, flags=re.DOTALL)
    s = re.sub(r'<br\s*/?>', ' ', s)
    # Only strip actual HTML tags (start with letter), NOT things like <2% or <= 72
    s = re.sub(r'</?\s*[a-zA-Z][^>]*>', '', s)
    s = htmllib.unescape(s)
    # escape pipe chars that are literal content inside table cells
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def convert_table(m):
    table_html = m.group(0)
    result = []
    header_rows = re.findall(r'<thead>(.*?)</thead>', table_html, re.DOTALL)
    body_rows_html = re.findall(r'<tbody>(.*?)</tbody>', table_html, re.DOTALL)

    if header_rows:
        cells = re.findall(r'<th[^>]*>(.*?)</th>', header_rows[0], re.DOTALL)
        cells = [clean_inline(c) for c in cells]
        result.append('| ' + ' | '.join(cells) + ' |')
        result.append('| ' + ' | '.join(['---'] * len(cells)) + ' |')

    if body_rows_html:
        trs = re.findall(r'<tr[^>]*>(.*?)</tr>', body_rows_html[0], re.DOTALL)
        for tr in trs:
            cells = re.findall(r'<td[^>]*>(.*?)</td>', tr, re.DOTALL)
            cells = [clean_inline(c) for c in cells]
            result.append('| ' + ' | '.join(cells) + ' |')

    return '\n' + '\n'.join(result) + '\n'

def convert_pre(m):
    inner = m.group(1)
    # strip <code> / </code> wrapper if present
    inner = re.sub(r'^<code[^>]*>', '', inner.strip())
    inner = re.sub(r'</code>$', '', inner.strip())
    # unescape entities but DON'T run tag-stripping on code content
    inner = htmllib.unescape(inner)
    return '\n```\n' + inner + '\n```\n'

def convert(text):
    t = text

    # 1. Tables (wrapped in .tablewrap div)
    t = re.sub(r'<div class="tablewrap">(.*?)</div>', convert_table, t, flags=re.DOTALL)
    # 2. Any remaining bare tables
    t = re.sub(r'<table>.*?</table>', convert_table, t, flags=re.DOTALL)

    # 3. Code blocks (before heading/paragraph processing)
    t = re.sub(r'<pre>(.*?)</pre>', convert_pre, t, flags=re.DOTALL)

    # 4. Headings
    t = re.sub(r'<h1[^>]*>(.*?)</h1>', lambda m: '\n# ' + clean_inline(m.group(1)) + '\n', t, flags=re.DOTALL)
    t = re.sub(r'<h2[^>]*>(.*?)</h2>', lambda m: '\n## ' + clean_inline(m.group(1)) + '\n', t, flags=re.DOTALL)
    t = re.sub(r'<h3[^>]*>(.*?)</h3>', lambda m: '\n### ' + clean_inline(m.group(1)) + '\n', t, flags=re.DOTALL)
    t = re.sub(r'<h4[^>]*>(.*?)</h4>', lambda m: '\n#### ' + clean_inline(m.group(1)) + '\n', t, flags=re.DOTALL)

    # 5. Blockquotes
    def convert_bq(m):
        inner = m.group(1)
        inner = re.sub(r'<p[^>]*>(.*?)</p>', lambda mm: clean_inline(mm.group(1)) + '\n', inner, flags=re.DOTALL)
        inner = re.sub(r'</?\s*[a-zA-Z][^>]*>', '', inner)
        inner = htmllib.unescape(inner)
        lines_bq = inner.strip().splitlines()
        return '\n' + '\n'.join('> ' + l if l.strip() else '>' for l in lines_bq) + '\n'
    t = re.sub(r'<blockquote>(.*?)</blockquote>', convert_bq, t, flags=re.DOTALL)

    # 6. Lists
    def convert_ul(m):
        inner = m.group(1)
        items = re.findall(r'<li[^>]*>(.*?)</li>', inner, re.DOTALL)
        result = []
        for item in items:
            item_text = re.sub(r'<p[^>]*>(.*?)</p>', r'\1\n', item, flags=re.DOTALL)
            result.append('- ' + clean_inline(item_text))
        return '\n' + '\n'.join(result) + '\n'

    def convert_ol(m):
        inner = m.group(1)
        items = re.findall(r'<li[^>]*>(.*?)</li>', inner, re.DOTALL)
        result = []
        for n, item in enumerate(items, 1):
            item_text = re.sub(r'<p[^>]*>(.*?)</p>', r'\1\n', item, flags=re.DOTALL)
            result.append(f'{n}. ' + clean_inline(item_text))
        return '\n' + '\n'.join(result) + '\n'

    t = re.sub(r'<ul[^>]*>(.*?)</ul>', convert_ul, t, flags=re.DOTALL)
    t = re.sub(r'<ol[^>]*>(.*?)</ol>', convert_ol, t, flags=re.DOTALL)

    # 7. Paragraphs
    t = re.sub(r'<p[^>]*>(.*?)</p>',
               lambda m: '\n' + clean_inline(m.group(1)) + '\n' if m.group(1).strip() else '',
               t, flags=re.DOTALL)

    # 8. HR
    t = re.sub(r'<hr\s*/?>', '\n---\n', t)

    # 9. Strip only real HTML tags (not <2% or <=)
    t = re.sub(r'</?\s*[a-zA-Z][^>]*>', '', t)

    # 10. Decode remaining HTML entities (outside code blocks these are in plain text)
    t = htmllib.unescape(t)

    # 11. Normalize blank lines
    t = re.sub(r'\n{4,}', '\n\n\n', t)

    return t.strip()

frontmatter = """\
---
title: "The Five-Layer Defense Architecture for AI Agents in Regulated, Evidence-Bound Industries"
description: "A generic defense-in-depth framework for AI agents in regulated industries, with worked examples in healthcare, legal, and financial services."
publishedAt: 2026-06-25
tags:
  - AI Agents
  - Regulated Industries
  - AI Safety
  - Architecture
draft: false
---
"""

content = convert(body)
output = frontmatter + "\n" + content + "\n"

with open(dst, "w", encoding="utf-8") as f:
    f.write(output)

print(f"Written: {len(output)} chars, {len(output.splitlines())} lines")
