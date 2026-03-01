export const loadMidtransScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.snap) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js"
    script.setAttribute(
      "data-client-key",
      import.meta.env.VITE_MIDTRANS_CLIENT_KEY
    )
    script.onload = () => resolve()
    script.onerror = () => reject("Failed to load Midtrans")
    document.body.appendChild(script)
  })
}