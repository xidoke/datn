// app/layout.tsx
import '../styles/globals.css';
import 'styles/editor.css';
// import GlobalContextProvider from 'contexts/globalContextProvider';
// import CommandPalette from 'components/command-palette';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* <GlobalContextProvider>
          <>
            <CommandPalette />
            {children}
          </>
        </GlobalContextProvider> */}
      </body>
    </html>
  );
}

export const metadata = {
  title: 'My App',
  description: 'This is my app.',
};
