import "./index.css"

export const metadata = {
  title: "InterTech LMS - Admin Panel",
  description: "Admin panel for InterTech Learning Management System",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}