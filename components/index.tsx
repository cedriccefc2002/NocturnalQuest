import { CSSProperties } from "preact/src/dom.d.ts";

export function App(refreshSec: number) {
  const img = () => `/image/IndexImgs/0/${crypto.randomUUID()}`;
  const imgCss: CSSProperties = { width: "100vh", height: "100vh", maxWidth: "100%", maxHeight: "100vh", objectFit: "contain" };
  const now = `${(new Date()).toLocaleTimeString()} Refresh Every ${refreshSec} seconds`;
  return (
    <html>
      <header>
        <meta http-equiv="refresh" content={`${refreshSec}`}></meta>
      </header>
      <body style={{ backgroundColor: "#000", padding: 0, margin: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <a href=".">
          <img style={imgCss} src={img()} />
        </a>
        <div style={{ position: "absolute", left: "3vh", bottom: "3vh", color: "#FFF", fontSize: "1vmax" }}>{now}</div>
      </body>
      <script>{`
        document.addEventListener('keydown', function(event) {
            if (event.key === 'PageDown') {
                // 在此執行您的動作，例如捲動頁面或載入新內容
                // console.log('你按下了 Page Down 鍵！');
                location.reload();
                // 可選：防止瀏覽器預設的捲動行為
                event.preventDefault(); 
            }
        });
      `}</script>
    </html>
  );
}