export const fixNumber = (value: number): string=>{
  if(value >= 1e6)return `${(value/1e6).toFixed(1)}M`
  else if(value >= 1e3) return `${(value/1e3).toFixed(1)}K`
  else return `${value}`
}
