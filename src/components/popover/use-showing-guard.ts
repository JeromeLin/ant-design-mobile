import { useEffect, useRef } from 'react'

/**
 * 保证通过 `ref.show()` 打开的 Popover 不会被同一次交互立即关闭。
 *
 * 当外部元素的点击回调调用 `ref.show()` 时，当前点击事件仍会继续冒泡到
 * document，并触发 `useClickAway`。因此需要在当前事件任务结束前保持 guarding
 * 状态，让 click-away 跳过这一次关闭；进入下一个任务后再解除 guarding，保证
 * 后续的外部点击仍能正常关闭 Popover。
 */
export function useShowingGuard() {
  const showingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const markShowing = () => {
    // 使用 ref 而不是 state，确保同一次事件冒泡到 document 时可以同步读取到标记。
    showingRef.current = true

    // 连续调用 show() 时重置保护窗口，避免旧定时器提前清除最新一次的标记。
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      // 定时器会在当前事件任务完成后执行，此时可以恢复正常的 click-away 行为。
      showingRef.current = false
    })
  }

  const isShowing = () => showingRef.current

  useEffect(() => {
    return () => {
      // 组件卸载后不再需要更新 guarding 标记，同时清理未执行的定时器。
      clearTimeout(timerRef.current)
    }
  }, [])

  return { markShowing, isShowing }
}
