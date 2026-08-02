import { Fragment } from 'react'
import type { ReactNode } from 'react'

/**
 * 极简 Markdown 渲染：支持段落、**加粗**、`行内代码`、
 * 有序/无序列表。课程文案只使用这些语法。
 */
function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  // 按 **bold** 与 `code` 切分
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(<Fragment key={key++}>{text.slice(last, m.index)}</Fragment>)
    const tok = m[0]
    if (tok.startsWith('**')) {
      out.push(<strong key={key++} className="text-slate-100 font-semibold">{tok.slice(2, -2)}</strong>)
    } else {
      out.push(<code key={key++} className="font-mono text-[0.9em] text-sky2-300 bg-ink-800 rounded px-1 py-0.5">{tok.slice(1, -1)}</code>)
    }
    last = m.index + tok.length
  }
  if (last < text.length) out.push(<Fragment key={key++}>{text.slice(last)}</Fragment>)
  return out
}

export default function Markdown({ md, className = '' }: { md: string; className?: string }) {
  const paragraphs = md.split(/\n\n+/)
  return (
    <div className={`space-y-3 leading-relaxed text-slate-300 ${className}`}>
      {paragraphs.map((p, i) => {
        const lines = p.split('\n')
        const isOl = lines.every((l) => /^\s*\d+\.\s/.test(l))
        const isUl = lines.every((l) => /^\s*[-•]\s/.test(l))
        if (isOl) {
          return (
            <ol key={i} className="list-decimal list-outside pl-6 space-y-1.5">
              {lines.map((l, j) => <li key={j}>{renderInline(l.replace(/^\s*\d+\.\s/, ''))}</li>)}
            </ol>
          )
        }
        if (isUl) {
          return (
            <ul key={i} className="list-disc list-outside pl-6 space-y-1.5">
              {lines.map((l, j) => <li key={j}>{renderInline(l.replace(/^\s*[-•]\s/, ''))}</li>)}
            </ul>
          )
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {renderInline(l)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}
