import './globals.css'; 
import '../input.css'
export const metadata = {
  title: 'TaskBoard',
  description: 'Minimal project management tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
