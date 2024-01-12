import { Home } from "./page-layout";


export async function generateMetadata() {
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_AUTH_URL),
    openGraph: {
      title: `Freetify`,
      description: `Free Online Music Player for You`
    }
  }
}

export default function App() {
  return <Home />;
}
