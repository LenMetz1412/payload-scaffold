export const FooterSpacer = ({ enabled }: { enabled: boolean }) => {
  if (!enabled) return null
  return <div id="footer-spacer" className="h-16 desktop:h-48" />
}
