export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head><style>{`*{margin:0;padding:0;box-sizing:border-box}body{background:#0f0f0f}`}</style></head>
      <body>{children}</body>
    </html>
  );
}
