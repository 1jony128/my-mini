'use client'

interface ProUsageStatsProps {
  userTokens: number
  isPro: boolean
}

export function ProUsageStats({ userTokens, isPro }: ProUsageStatsProps) {
  return (
    <div className="text-sm text-text-secondary">
      Использование: {userTokens} токенов {isPro ? '(PRO)' : '(Free)'}
    </div>
  )
}
