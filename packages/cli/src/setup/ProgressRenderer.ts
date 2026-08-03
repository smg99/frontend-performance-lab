export const ProgressRenderer = {
  info(msg: string) {
    console.log(`ℹ️  ${msg}`)
  },
  success(msg: string) {
    console.log(`✅ ${msg}`)
  },
  error(msg: string) {
    console.error(`❌ ${msg}`)
  },
  warn(msg: string) {
    console.warn(`⚠️  ${msg}`)
  }
}
