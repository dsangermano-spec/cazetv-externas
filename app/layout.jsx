export const metadata = { title: "Cazé TV — Externas", description: "Sistema de pautas e métricas" };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, background: "#0f0f0f" }}>
        {children}
      </body>
    </html>
  );
}
