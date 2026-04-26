import "./globals.css";
import SessionWrapper from "@/components/layout/SessionWrapper";

export const metadata = {
  title: "PropCRM",
  description: "Property Dealer CRM System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}