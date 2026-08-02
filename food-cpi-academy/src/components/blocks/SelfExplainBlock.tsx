import { useState } from 'react'
import type { SelfExplain } from '../../types'

interface Props {
  selfExplain: SelfExplain
  onDone?: (missingKeywords: string[]) => void
}

/**
 * “请用自己的话解释”输入框。
 * 用关键词覆盖度做轻量检查：不判定对错，只提示遗漏的核心概念，
 * 并展示参考答案供对照。
 */
export default function SelfExplainBlock({ selfExplain, onDone }: Props) {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [missing, setMissing] = useState<string[]>([])

  const submit = () => {
    if (text.trim().length < 10) return
    const lower = text.toLowerCase()
    const miss = selfExplain.keywords.filter(
      (k) => !lower.includes(k.toLowerCase()),
    )
    setMissing(miss)
    setSubmitted(true)
    onDone?.(miss)
  }

  return (
    <div className="card p-5 border-l-4 border-l-violet2-500">
      <p className="text-xs font-semibold text-violet2-300 mb-1">✍️ 用自己的话解释</p>
      <p className="font-medium text-slate-100 mb-3">{selfExplain.prompt}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="至少写 10 个字。写出来，才是真的懂了。"
        className="input-dark w-full text-sm resize-y"
        aria-label="用自己的话解释"
        disabled={submitted}
      />
      {!submitted ? (
        <button
          onClick={submit}
          disabled={text.trim().length < 10}
          className="btn-primary mt-3 text-sm"
        >
          提交我的解释
        </button>
      ) : (
        <div className="mt-3 space-y-3 animate-slideUp">
          {missing.length > 0 ? (
            <div className="rounded-xl bg-amber2-500/10 border border-amber2-500/40 p-3 text-sm text-amber2-300" role="status">
              <p className="font-semibold mb-1">👀 你的解释里似乎缺少这些核心概念：</p>
              <p>{missing.join('、')}</p>
              <p className="mt-1 text-xs text-slate-400">它们已加入右侧「薄弱知识点」。对照参考答案，看看它们的作用。</p>
            </div>
          ) : (
            <div className="rounded-xl bg-mint-500/10 border border-mint-500/40 p-3 text-sm text-mint-200" role="status">
              ✔ 核心概念都覆盖到了！+5 XP。再对照参考答案，看表述是否准确。
            </div>
          )}
          <div className="rounded-xl bg-ink-850 border border-ink-600 p-3 text-sm">
            <p className="text-xs font-semibold text-slate-400 mb-1">📋 参考答案</p>
            <p className="text-slate-300">{selfExplain.modelAnswer}</p>
          </div>
        </div>
      )}
    </div>
  )
}
